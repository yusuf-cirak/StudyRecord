-- Add up migration script here

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
    "users" (
        id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        user_name VARCHAR(255) NOT NULL UNIQUE,
        photo VARCHAR NOT NULL DEFAULT 'default.png',
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW()
    );

CREATE INDEX user_names_index ON users (user_name);

CREATE TABLE lessons (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    create_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- create the books table
CREATE TABLE books (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    create_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- create the lesson_problem_solves table
CREATE TABLE lesson_problem_solves (
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    create_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    correct_answer SMALLINT NOT NULL,
    wrong_answer SMALLINT NOT NULL,
    empty_answer SMALLINT NOT NULL,
    total_time INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);