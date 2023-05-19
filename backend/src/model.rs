use chrono::prelude::*;
use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct User {
    pub id: uuid::Uuid,
    pub first_name: String,
    pub last_name: String,
    pub user_name: String,
    pub password: String,
    pub role: String,
    pub photo: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct Lesson {
    pub id: uuid::Uuid,
    pub create_user_id: uuid::Uuid,
    pub name: String,
}
#[derive(Debug, Serialize)]
pub struct LessonGetSchema {
    pub id: uuid::Uuid,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct LessonCreateSchema {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct LessonUpdateSchema {
    pub lesson_id: uuid::Uuid,
    pub name: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct Book {
    pub id: uuid::Uuid,
    pub create_user_id: Option<uuid::Uuid>,
    pub name: String,
}

#[derive(Debug, Serialize)]
pub struct BookGetSchema {
    pub id: uuid::Uuid,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct BookCreateSchema {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct BookUpdateSchema {
    pub book_id: uuid::Uuid,
    pub name: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct LessonProblemSolve {
    pub id: uuid::Uuid,
    pub lesson_id: uuid::Uuid,
    pub create_user_id: uuid::Uuid,
    pub correct_answer: i16,
    pub wrong_answer: i16,
    pub empty_answer: i16,
    pub total_time: i32,
    pub date: DateTime<Utc>,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct LessonProblemSolveGetSchema {
    pub id: uuid::Uuid,
    pub lesson_id: uuid::Uuid,
    pub create_user_id: uuid::Uuid,
    pub correct_answer: i16,
    pub wrong_answer: i16,
    pub empty_answer: i16,
    pub total_time:i32,
    pub date:DateTime<Utc>,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct LessonProblemSolveCreateSchema {
    pub lesson_id: uuid::Uuid,
    pub correct_answer: i16,
    pub wrong_answer: i16,
    pub empty_answer: i16,
    pub total_time:i32,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct LessonProblemSolveUpdateSchema {
    pub id: uuid::Uuid,
    pub lesson_id: uuid::Uuid,
    pub correct_answer: i16,
    pub wrong_answer: i16,
    pub empty_answer: i16,
    pub total_time:i32,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
}

#[derive(Debug, Deserialize)]
pub struct RegisterUserSchema {
    pub first_name: String,
    pub last_name: String,
    pub user_name: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUserSchema {
    pub user_name: String,
    pub password: String,
}


#[derive(Debug, Deserialize)]
pub struct UpdateUserSchema {
    pub user_name: Option<String>,
    pub current_password: Option<String>,
    pub new_password: Option<String>,
    pub photo: Option<String>,
}

