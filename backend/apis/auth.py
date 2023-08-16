import flask
import pymongo
from flask import session
import hashlib

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("auth", __name__)

@api.route("/api/auth/login", methods=["POST"])
def login():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    if not "username" in data or not "password" in data:
        return "Invalid request", 400
    
    user = db.users.find_one({"username": data["username"], "password": hashlib.sha256(data["password"].encode()).hexdigest()})
    if not user:
        return "Invalid credentials", 401
    
    session["username"] = user["username"]
    session["auth_level"] = user["auth_level"]
    return "Authed :)", 200
    

# admin only
@api.route("/api/auth/add_user", methods=["POST"])
def add_user():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "username" in data or not "password" in data or not "email" in data or not "phone" in data or not "full_name" in data or not "auth_level" in data:
        return "Invalid request", 400
    
    if not session["auth_level"] == 2:
        return "Unauthorized", 401
    
    if db.users.find_one({"username": data["username"]}):
        return "User already exists", 400
    
    db.users.insert_one({
        "username": data["username"],
        "password": hashlib.sha256(data["password"].encode()).hexdigest(),
        "email": data["email"],
        "phone": data["phone"],
        "full_name": data["full_name"],
        "auth_level": data["auth_level"]
    })
    return "User added :)", 200

# admin only
@api.route("/api/auth/remove_user", methods=["POST"])
def remove_user():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "username" in data:
        return "Invalid request", 400
    
    if not session["auth_level"] == 2:
        return "Unauthorized", 401
    
    if not db.users.find_one({"username": data["username"]}):
        return "User does not exist", 400
    
    db.users.delete_one({"username": data["username"]})
    return "User removed :)", 200


@api.route("/api/auth/change_password", methods=["POST"])
def change_password():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "old_password" in data or not "new_password" in data:
        return "Invalid request", 400
    
    if not session["username"]:
        return "Unauthorized", 401
    
    user = db.users.find_one({"username": session["username"], "password": hashlib.sha256(data["old_password"].encode()).hexdigest()})
    if not user:
        return "Invalid credentials", 401
    
    db.users.update_one({"username": session["username"]}, {"$set": {"password": hashlib.sha256(data["new_password"].encode()).hexdigest()}})
    return "Password changed :)", 200