use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct FilteredUser {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub user_name: String,
    pub role: String,
    pub photo: String,
}

#[derive(Serialize, Debug)]
pub struct UserData {
    pub user: FilteredUser,
}

#[derive(Serialize, Debug)]
pub struct UserResponse {
    pub status: String,
    pub data: UserData,
}
