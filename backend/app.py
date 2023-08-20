import flask
import pymongo
import os
import waitress
from blueprints import auth
import hashlib
from authorizatoin import authorization

app = flask.Flask(__name__)

app.secret_key = os.urandom(2023)

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

@app.route("/api", methods=["GET"])
def default():
    return "", 418

db.users.update_one({"username": "admin"}, {"$set": 
    {
        "password": hashlib.sha256(("admin" + "saltysalt").encode()).hexdigest(),
        "namesurname": "Admin Admin",
        "auth_level": 2
    }}, upsert=True)
print("A new admin user has been created. Username: admin, Password: admin. Please change this ASAP.")

if __name__ == "__main__":
    app.register_blueprint(auth.api)

    waitress.serve(app, port=5000)