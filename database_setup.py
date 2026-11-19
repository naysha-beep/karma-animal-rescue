import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="shivi1701"
)

cursor = conn.cursor()

cursor.execute(
    "CREATE DATABASE IF NOT EXISTS karma_rescue"
)

print("Database Created")

conn.close()