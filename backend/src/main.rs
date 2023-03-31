use std::env;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;

mod constants;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn get_db_url() -> impl Responder {
    let database_url =env::var(constants::DATABASE_URL).expect("This env variable does not exist");
    HttpResponse::Ok().body(database_url)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .route("/db", web::get().to(get_db_url))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}