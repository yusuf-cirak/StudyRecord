use crate::{
    jwt_auth,
    model::{LoginUserSchema, RegisterUserSchema, TokenClaims, User, UpdateUserSchema,Book,BookGetSchema, BookCreateSchema, BookUpdateSchema,Lesson, LessonGetSchema, LessonCreateSchema, LessonUpdateSchema },
    response::FilteredUser,
    AppState,
};
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie},
    get, post, web::{self, Json}, HttpMessage, HttpRequest, HttpResponse, Responder, put, delete,
};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{prelude::*, Duration};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;

use sqlx::Row;
use uuid::Uuid;

#[get("/health-check")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "The application is running healthy!";

    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE}))
}

#[post("/auth/register")]
async fn register_user_handler(
    body: web::Json<RegisterUserSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let exists: bool = sqlx::query("SELECT EXISTS(SELECT 1 FROM users WHERE user_name = $1)")
        .bind(body.user_name.to_owned())
        .fetch_one(&data.db)
        .await
        .unwrap()
        .get(0);

    if exists {
        return HttpResponse::Conflict().json(
            serde_json::json!({"status": "fail","message": "User with that user name already exists"}),
        );
    }

    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default()
        .hash_password(body.password.as_bytes(), &salt)
        .expect("Error while hashing password")
        .to_string();
    let query_result = sqlx::query_as!(
        User,
        "INSERT INTO users (first_name,last_name,user_name,password) VALUES ($1, $2, $3, $4) RETURNING *",
        body.first_name.to_string(),
        body.last_name.to_string(),
        body.user_name.to_string(),
        hashed_password
    )
    .fetch_one(&data.db)
    .await;

    match query_result {
        Ok(user) => {

            let now = Utc::now();
    let iat = now.timestamp() as usize;
        let exp = (now + Duration::minutes(60)).timestamp() as usize;
            
            let claims: TokenClaims = TokenClaims {
                sub: user.id.to_string(),
                exp,
                iat,
            };
            let token = encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
            )
            .unwrap();
        
            let cookie = Cookie::build("token", token.to_owned())
                .path("/")
                .max_age(ActixWebDuration::new(60 * 60, 0))
                .http_only(true)
                .finish();
            let user_response = serde_json::json!({"status": "success","user": filter_user_record(&user)
            });

            return HttpResponse::Ok().cookie(cookie).json(user_response);
        }
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error","message": format!("{:?}", e)}));
        }
    }
}
#[post("/auth/login")]
async fn login_user_handler(
    body: web::Json<LoginUserSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let query_result = sqlx::query_as!(User, "SELECT * FROM users WHERE user_name = $1", body.user_name)
        .fetch_optional(&data.db)
        .await
        .unwrap();

    let is_valid = query_result.to_owned().map_or(false, |user| {
        let parsed_hash = PasswordHash::new(&user.password).unwrap();
        Argon2::default()
            .verify_password(body.password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true)
    });

    if !is_valid {
        return HttpResponse::BadRequest()
            .json(json!({"status": "fail", "message": "Invalid user name or password"}));
    }

    let user = query_result.unwrap();

    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::minutes(60)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user.id.to_string(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token.to_owned())
        .path("/")
        .max_age(ActixWebDuration::new(60 * 60, 0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(json!({"status": "success", "user": filter_user_record(&user)}))
}

#[get("/auth/logout")]
async fn logout_handler(_: jwt_auth::JwtMiddleware) -> impl Responder {
    let cookie = Cookie::build("token", "")
        .path("/")
        .max_age(ActixWebDuration::new(-1, 0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(json!({"status": "success"}))
}

#[get("/users/me")]
async fn get_me_handler(
    req: HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {
    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

        let query_result = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
        .fetch_optional(&data.db)
        .await
        .unwrap();


    let user = query_result.unwrap();

        let now = Utc::now();
        let iat = now.timestamp() as usize;
        let exp = (now + Duration::minutes(60)).timestamp() as usize;
        let claims: TokenClaims = TokenClaims {
            sub: user.id.to_string(),
            exp,
            iat,
        };
    
        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
        )
        .unwrap();
    
        let cookie = Cookie::build("token", token.to_owned())
            .path("/")
            .max_age(ActixWebDuration::new(60 * 60, 0))
            .http_only(true)
            .finish();

        println!("{:?}", user);
    
        HttpResponse::Ok()
            .cookie(cookie)
            .json(json!({"status": "success", "user": filter_user_record(&user)}))
   
}

#[put("/users/me")]
async fn update_user_handler(
    req: HttpRequest,
    body: Json<UpdateUserSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {
    println!("Req received");
    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
        .fetch_one(&data.db)
        .await
        .unwrap();


    let mut query = String::from("UPDATE users SET");

    if let Some(new_photo) = &body.photo {
        query += &format!(" photo='{}',", new_photo);

    }
    
    if let Some(updated_user_name) = &body.user_name {
        query += &format!(" user_name='{}',", updated_user_name);
    }
    if let (Some(current_password), Some(new_password)) = (&body.current_password, &body.new_password) {
        let parsed_hash = PasswordHash::new(&user.password).unwrap();
    
        let is_valid = Argon2::default()
            .verify_password(current_password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true);
    
        if !is_valid {
            return HttpResponse::BadRequest()
                .json(json!({"status": "fail", "message": "Password does not match!"}));
        }
    
        let salt = SaltString::generate(&mut OsRng);
        let updated_password = Argon2::default()
            .hash_password(new_password.as_bytes(), &salt)
            .unwrap_or_else(|_| panic!("Error while hashing password"))
            .to_string();
    
        query += &format!(" password='{}'", updated_password);
    } else if let (None, None) = (&body.current_password, &body.new_password) {
        query.truncate(query.len() - 1);
    }
    query += " WHERE id=$1";

    println!("Query: {}", query);

let updated_user = sqlx::query(&query)
    .bind(user.id)
    .execute(&data.db)
    .await;

    match updated_user {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
            });
            return HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Failed to update user: {}", err);
            return HttpResponse::NoContent().finish()
        }
    }
}

#[get("/books")]
async fn book_get_all_handler(
    req: HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        BookGetSchema,
        "SELECT id,name FROM books  WHERE create_user_id = $1",
        user_id
    )
    .fetch_all(&data.db)
    .await;

    match query_result {
        Ok(books) => HttpResponse::Ok().json(json!({"status": "success", "data": books})),
        Err(err) => {
            eprintln!("Failed to get all books: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[get("/books/{book_id}")]
async fn book_get_by_id_handler(
    path: web::Path<String>,
    req: HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let book_id = Uuid::parse_str(&path.into_inner()).unwrap();

    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        BookGetSchema,
        "SELECT id,name FROM books  WHERE create_user_id = $1 AND id = $2",
        user_id,
        book_id
    )
    .fetch_one(&data.db)
    .await;

    match query_result {
        Ok(book) => HttpResponse::Ok().json(json!({"status": "success", "data": book})),
        Err(err) => {
            eprintln!("Failed to fetch book: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[post("/books")]
async fn book_create_handler(
    req: HttpRequest,
    body: Json<BookCreateSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let book_exists = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM books WHERE name = $1)")
        .bind(&body.name)
        .fetch_one(&data.db)
        .await
        .unwrap();

    if book_exists {
        return HttpResponse::BadRequest()
            .json(json!({"status": "fail", "message": "Book already exists"}));
    }

    let ext = req.extensions();
    let user_id: &Uuid = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        Book,
        "INSERT INTO books (name,create_user_id) VALUES ($1,$2) RETURNING *",
        body.name,
        user_id,
    )
    .fetch_one(&data.db)
    .await;

    match query_result {
        Ok(book) => HttpResponse::Ok().json(json!({"status": "success", "book": book})),
        Err(err) => {
            eprintln!("Failed to create book: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[put("/books")]
async fn book_update_handler(
    req: HttpRequest,
    body: Json<BookUpdateSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let book = sqlx::query_as!(Book,"SELECT * FROM books WHERE id = $1", body.book_id)
        .fetch_one(&data.db)
        .await
        .unwrap();


    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();
    let create_user_id = book.create_user_id.clone().unwrap();

    if !user_id.eq(&create_user_id) {
        return HttpResponse::BadRequest()
            .json(json!({"status": "fail", "message": "You did not created this book"}));
    }
    let query = format!("UPDATE books SET name='{}' WHERE id=$1", body.name);
    let updated_book = sqlx::query(&query)
    .bind(body.book_id)
    .execute(&data.db)
    .await;

    match updated_book {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
            });
            return HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Failed to update book: {}", err);
            return HttpResponse::NoContent().finish()
        }
    }
 
}

#[delete("/books/{book_id}")]
async fn book_delete_handler(
    path: web::Path<String>,
    req:HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let book_id = Uuid::parse_str(&path.into_inner()).unwrap();

    let book = sqlx::query_as!(Book,"SELECT * FROM books WHERE id = $1",book_id)
        .fetch_one(&data.db)
        .await
        .unwrap();

        let ext = req.extensions();
        let user_id = ext.get::<uuid::Uuid>().unwrap();

        let create_user_id = book.create_user_id.clone().unwrap();

        if !user_id.eq(&create_user_id) {
            return HttpResponse::BadRequest()
                .json(json!({"status": "fail", "message": "You did not created this book"}));
        }

  
    let query = "DELETE FROM books WHERE id=$1";
    let book_deleted = sqlx::query(&query)
    .bind(book_id)
    .execute(&data.db)
    .await;

    match book_deleted {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
            });
            return HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Failed to delete book: {}", err);
            return HttpResponse::NoContent().finish()
        }
    }
 
}

#[get("/lessons")]
async fn lesson_get_all_handler(
    req: HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        LessonGetSchema,
        "SELECT id,name FROM lessons WHERE create_user_id = $1",
        user_id
    )
    .fetch_all(&data.db)
    .await;

    match query_result {
        Ok(lessons) => HttpResponse::Ok().json(json!({"status": "success", "data": lessons})),
        Err(err) => {
            eprintln!("Failed to get all books: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[get("/lessons/{lesson_id}")]
async fn lesson_get_by_id_handler(
    path: web::Path<String>,
    req: HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let lesson_id = Uuid::parse_str(&path.into_inner()).unwrap();

    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        LessonGetSchema,
        "SELECT id,name FROM lessons  WHERE create_user_id = $1 AND id = $2",
        user_id,
        lesson_id
    )
    .fetch_one(&data.db)
    .await;

    match query_result {
        Ok(lesson) => HttpResponse::Ok().json(json!({"status": "success", "data": lesson})),
        Err(err) => {
            eprintln!("Failed to fetch lesson: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[post("/lessons")]
async fn lesson_create_handler(
    req: HttpRequest,
    body: Json<LessonCreateSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let lesson_exists = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM lessons WHERE name = $1)")
        .bind(&body.name)
        .fetch_one(&data.db)
        .await
        .unwrap();

    if lesson_exists {
        return HttpResponse::BadRequest()
            .json(json!({"status": "fail", "message": "Book already exists"}));
    }

    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    let query_result = sqlx::query_as!(
        Lesson,
        "INSERT INTO lessons (name,create_user_id) VALUES ($1,$2) RETURNING *",
        body.name,
        user_id,
    )
    .fetch_one(&data.db)
    .await;

    match query_result {
        Ok(lesson) => HttpResponse::Ok().json(json!({"status": "success", "book": lesson})),
        Err(err) => {
            eprintln!("Failed to create book: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
 
}

#[put("/lessons")]
async fn lesson_update_handler(
    req: HttpRequest,
    body: Json<LessonUpdateSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let lesson = sqlx::query_as!(Lesson,"SELECT * FROM lessons WHERE id = $1", body.lesson_id)
        .fetch_one(&data.db)
        .await
        .unwrap();


    let ext = req.extensions();
    let user_id = ext.get::<uuid::Uuid>().unwrap();

    if !user_id.eq(&lesson.create_user_id) {
        return HttpResponse::BadRequest()
            .json(json!({"status": "fail", "message": "You did not created this lesson"}));
    }
    let query = format!("UPDATE lessons SET name='{}' WHERE id=$1", body.name);
    let updated_lesson = sqlx::query(&query)
    .bind(body.lesson_id)
    .execute(&data.db)
    .await;

    match updated_lesson {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
            });
            return HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Failed to update lesson: {}", err);
            return HttpResponse::NoContent().finish()
        }
    }
 
}

#[delete("/lessons/{lesson_id}")]
async fn lesson_delete_handler(
    path: web::Path<String>,
    req:HttpRequest,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

    let lesson_id = Uuid::parse_str(&path.into_inner()).unwrap();


    let lesson = sqlx::query_as!(Lesson,"SELECT * FROM lessons WHERE id = $1",lesson_id)
        .fetch_one(&data.db)
        .await
        .unwrap();

        let ext = req.extensions();
        let user_id = ext.get::<uuid::Uuid>().unwrap();

        let create_user_id = lesson.create_user_id.clone();

        if !user_id.eq(&create_user_id) {
            return HttpResponse::BadRequest()
                .json(json!({"status": "fail", "message": "You did not created this book"}));
        }

  
    let query = "DELETE FROM lessons WHERE id=$1";
    let lesson_deleted = sqlx::query(&query)
    .bind(lesson_id)
    .execute(&data.db)
    .await;

    match lesson_deleted {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
            });
            return HttpResponse::Ok().json(response)
        }
        Err(err) => {
            eprintln!("Failed to delete lesson: {}", err);
            return HttpResponse::NoContent().finish()
        }
    }
 
}

fn filter_user_record(user: &User) -> FilteredUser {
    FilteredUser {
        id: user.id.to_string(),
        first_name: user.first_name.to_owned(),
        last_name: user.last_name.to_owned(),
        user_name: user.user_name.to_owned(),
        photo: user.photo.to_owned(),
        role: user.role.to_owned(),
    }
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(register_user_handler)
        .service(login_user_handler)
        .service(update_user_handler)
        .service(logout_handler)
        .service(get_me_handler)
        .service(book_get_all_handler)
        .service(book_get_by_id_handler)
        .service(book_create_handler)
        .service(book_update_handler)
        .service(book_delete_handler)
        .service(lesson_get_all_handler)
        .service(lesson_get_by_id_handler)
        .service(lesson_create_handler)
        .service(lesson_update_handler)
        .service(lesson_delete_handler);

    
    conf.service(scope);
}
