-- users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- user_classes mapping
CREATE TABLE user_classes (
    user_id INT REFERENCES users(id),
    class_id INT REFERENCES classes(id),
    PRIMARY KEY (user_id, class_id)
);

-- exams table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    class_id INT REFERENCES classes(id),
    weight_pg INT DEFAULT 70,
    weight_essay INT DEFAULT 30,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
