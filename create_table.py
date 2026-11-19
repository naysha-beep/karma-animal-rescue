import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()
conn = mysql.connector.connect(
    host=os.getenv("MYSQLHOST"),
    user=os.getenv("MYSQLUSER"),
    password=os.getenv("MYSQLPASSWORD"),
    database=os.getenv("MYSQLDATABASE")
)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS animals(
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    species VARCHAR(50),
    breed VARCHAR(100),
    age VARCHAR(50),
    gender VARCHAR(50),
    status VARCHAR(50),
    rescue_date DATE,
    location VARCHAR(255),
    notes TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS medical_records(
    medical_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT,
    visit_date DATE,
    condition_name VARCHAR(255),
    treatment TEXT,
    medication TEXT,
    veterinarian VARCHAR(100),
    FOREIGN KEY(animal_id)
    REFERENCES animals(animal_id)
    ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS vaccinations(
    vaccine_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT,
    vaccine_name VARCHAR(100),
    date_given DATE,
    next_due DATE,
    FOREIGN KEY(animal_id)
    REFERENCES animals(animal_id)
    ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS adoptions(
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT,
    adopter_name VARCHAR(100),
    phone VARCHAR(30),
    adoption_date DATE,
    FOREIGN KEY(animal_id)
    REFERENCES animals(animal_id)
    ON DELETE CASCADE
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS staff(
    staff_id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    role VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    email VARCHAR(100),

    join_date DATE,

    status ENUM(
        'Active',
        'On Leave'
    ) DEFAULT 'Active',

    responsibility TEXT
)
""")

conn.commit()
print("Tables Created Successfully")

conn.close()