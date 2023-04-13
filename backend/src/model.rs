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
