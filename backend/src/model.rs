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
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct Lesson {
    pub id: uuid::Uuid,
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
}
#[derive(Debug, Deserialize)]
pub struct LessonCreateSchema {
    pub name: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct Book {
    pub id: uuid::Uuid,
    #[serde(rename = "createUserId")]
    pub create_user_id: Option<uuid::Uuid>,
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct BookGetSchema {
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
#[derive(Debug, Deserialize)]
pub struct BookDeleteSchema {
    pub book_id: uuid::Uuid,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct LessonProblemSolve {
    #[serde(rename = "lessonId")]
    pub lesson_id: uuid::Uuid,
    #[serde(rename = "createUserId")]
    pub create_user_id: uuid::Uuid,
    #[serde(rename = "correctAnswer")]
    pub correct_answer: u16,
    #[serde(rename = "wrongAnswer")]
    pub wrong_answer: u16,
    #[serde(rename = "emptyAnswer")]
    pub empty_answer: u16,
    #[serde(rename = "totalTime")]
    pub total_time:u16,
    pub date:DateTime<Utc>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
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

