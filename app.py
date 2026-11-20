from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from db import connect_db

app = Flask(__name__)
CORS(app)


@app.route("/")
def login_page():
    return render_template("login.html")
@app.route("/dashboard")
def dashboard_page():
    return render_template("index.html")


# ==========================
# ANIMALS
# ==========================

@app.route("/animals", methods=["GET"])
def get_animals():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM animals")
    animals = cursor.fetchall()

    conn.close()

    return jsonify(animals)


@app.route("/animals", methods=["POST"])
def add_animal():

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO animals
        (
            name, species, breed, age,
            gender, status, rescue_date,
            location, notes
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["name"],
        data["species"],
        data["breed"],
        data["age"],
        data["gender"],
        data["status"],
        data["rescueDate"],
        data["location"],
        data["notes"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Animal Added"})


@app.route("/animals/<int:animal_id>", methods=["PUT"])
def update_animal(animal_id):

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE animals
        SET name=%s, species=%s, breed=%s, age=%s,
            gender=%s, status=%s, rescue_date=%s,
            location=%s, notes=%s
        WHERE animal_id=%s
    """, (
        data["name"],
        data["species"],
        data["breed"],
        data["age"],
        data["gender"],
        data["status"],
        data["rescueDate"],
        data["location"],
        data["notes"],
        animal_id
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Animal Updated"})


@app.route("/animals/<int:animal_id>", methods=["DELETE"])
def delete_animal(animal_id):

    conn = connect_db()
    cursor = conn.cursor()

    # medical_records, vaccinations and adoptions are removed
    # automatically (ON DELETE CASCADE)
    cursor.execute(
        "DELETE FROM animals WHERE animal_id=%s",
        (animal_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Animal Deleted"})


# ==========================
# MEDICAL RECORDS
# ==========================

@app.route("/medical", methods=["GET"])
def get_medical():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT m.*, a.name AS animal_name
        FROM medical_records m
        JOIN animals a ON m.animal_id = a.animal_id
        ORDER BY visit_date DESC
    """)

    records = cursor.fetchall()

    conn.close()

    return jsonify(records)


@app.route("/medical", methods=["POST"])
def add_medical():

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO medical_records
        (
            animal_id, visit_date, condition_name,
            treatment, medication, veterinarian
        )
        VALUES(%s,%s,%s,%s,%s,%s)
    """, (
        data["animalId"],
        data["date"],
        data["condition"],
        data["treatment"],
        data["medication"],
        data["vet"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "saved"})


# ==========================
# VACCINATIONS
# ==========================

@app.route("/vaccinations", methods=["GET"])
def get_vaccinations():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT v.*, a.name AS animal_name
        FROM vaccinations v
        JOIN animals a ON v.animal_id = a.animal_id
        ORDER BY next_due
    """)

    records = cursor.fetchall()

    conn.close()

    return jsonify(records)


@app.route("/vaccinations", methods=["POST"])
def add_vaccination():

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO vaccinations
        (animal_id, vaccine_name, date_given, next_due)
        VALUES(%s,%s,%s,%s)
    """, (
        data["animalId"],
        data["name"],
        data["given"],
        data["due"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "saved"})


# ==========================
# ADOPTIONS
# ==========================

@app.route("/adoptions", methods=["GET"])
def get_adoptions():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT ad.*, a.name AS animal_name
        FROM adoptions ad
        JOIN animals a ON ad.animal_id = a.animal_id
        ORDER BY adoption_date DESC
    """)

    records = cursor.fetchall()

    conn.close()

    return jsonify(records)


@app.route("/adoptions", methods=["POST"])
def add_adoption():

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO adoptions
        (animal_id, adopter_name, phone, adoption_date)
        VALUES(%s,%s,%s,%s)
    """, (
        data["animalId"],
        data["adopter"],
        data["phone"],
        data["date"]
    ))

    cursor.execute("""
        UPDATE animals
        SET status='Adopted'
        WHERE animal_id=%s
    """, (data["animalId"],))

    conn.commit()
    conn.close()

    return jsonify({"message": "Adoption Recorded"})


# ==========================
# STAFF
# ==========================

@app.route("/staff", methods=["GET"])
def get_staff():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM staff
        ORDER BY staff_id DESC
    """)

    staff = cursor.fetchall()

    conn.close()

    return jsonify(staff)


@app.route("/staff", methods=["POST"])
def add_staff():

    data = request.json

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO staff
        (
            full_name, role, phone, email,
            join_date, status, responsibility
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["full_name"],
        data["role"],
        data["phone"],
        data["email"],
        data["join_date"],
        data["status"],
        data["responsibility"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Staff added"})


# ==========================
# DASHBOARD
# ==========================

@app.route("/dashboard-stats")
def dashboard_stats():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) total FROM animals")
    total = cursor.fetchone()["total"]

    cursor.execute(
        "SELECT COUNT(*) total FROM animals WHERE status='Under Care'"
    )
    care = cursor.fetchone()["total"]

    cursor.execute(
        "SELECT COUNT(*) total FROM animals WHERE status='Adopted'"
    )
    adopted = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) total
        FROM vaccinations
        WHERE next_due <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    """)
    due = cursor.fetchone()["total"]

    conn.close()

    return jsonify({
        "total": total,
        "care": care,
        "adopted": adopted,
        "due": due
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    ) 