import flask
import pymongo
import os
import waitress
from blueprints import auth, search, admin, student
from blueprints.data import tasks, users, classes
import hashlib
from authorization import authorization
import time

app = flask.Flask(__name__)

app.secret_key = os.urandom(2023)

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

@app.route("/api", methods=["GET"])
def default():
    return "YADA", 418

@app.route("/api/health", methods=["GET"])
def health():
    print("Health check")
    return "OK", 200

# TODO
# REMOVE THIS
db.users.update_one({"username": "admin"}, {"$set": 
    {
        "password": hashlib.sha256(("admin" + "saltysalt").encode()).hexdigest(),
        "namesurname": "Admin Admin",
        "auth_level": 2,
        "userid": hashlib.sha256(("admin" + str(time.time())).encode()).hexdigest(),
    }}, upsert=True)
print("A new admin user has been created. Username: admin, Password: admin. Please change this ASAP.")

if __name__ == "__main__":
    app.register_blueprint(auth.api)
    app.register_blueprint(search.api)
    app.register_blueprint(admin.api)
    app.register_blueprint(student.api)

    app.register_blueprint(tasks.api)
    app.register_blueprint(users.api)
    app.register_blueprint(classes.api)

    waitress.serve(app, port=5000)