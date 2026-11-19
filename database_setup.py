import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

conn = mysql.connector.connect(
    host=os.getenv("MYSQLHOST"),
    user=os.getenv("MYSQLUSER"),
    password=os.getenv("MYSQLPASSWORD")
)

cursor = conn.cursor()

cursor.execute(
    "CREATE DATABASE IF NOT EXISTS karma_rescue"
)

conn.commit()

print("Database Created Successfully")

conn.close()