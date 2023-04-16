use crate::{
    jwt_auth,
    model::{LoginUserSchema, RegisterUserSchema, TokenClaims, User, UpdateUserSchema},
    response::FilteredUser,
    AppState,
};
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie},
    get, post, web::{self, Json}, HttpMessage, HttpRequest, HttpResponse, Responder, put,
};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{prelude::*, Duration};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;

use sqlx::Row;

#[get("/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "JWT Authentication in Rust using Actix-web, Postgres, and SQLX";

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

    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
        .fetch_one(&data.db)
        .await
        .unwrap();

    

    let json_response = serde_json::json!({
        "status":  "success",
        "data": serde_json::json!({
            "user": filter_user_record(&user)
        })
    });

    HttpResponse::Ok().json(json_response)
}

#[put("/users/me")]
async fn update_user_handler(
    req: HttpRequest,
    body: Json<UpdateUserSchema>,
    data: web::Data<AppState>,
    _: jwt_auth::JwtMiddleware,
) -> impl Responder {

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

fn filter_user_record(user: &User) -> FilteredUser {
    FilteredUser {
        id: user.id.to_string(),
        first_name: user.first_name.to_owned(),
        last_name: user.last_name.to_owned(),
        user_name: user.user_name.to_owned(),
        photo: user.photo.to_owned(),
        role: user.role.to_owned(),
        createdAt: user.created_at.unwrap(),
        updatedAt: user.updated_at.unwrap(),
    }
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(register_user_handler)
        .service(login_user_handler)
        .service(update_user_handler)
        .service(logout_handler)
        .service(get_me_handler);

    
    conf.service(scope);
}
