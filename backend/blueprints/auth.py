import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorizatoin import authorization
from utils import authToString
import pandas

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("auth", __name__)

# userid and auth_level are stored in session

@api.route("/api/auth/logout", methods=["GET"])
@authorization(required_level=0)
def logout():
    session.clear()
    return "Logged out", 200

@api.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "username" in data or not "password" in data:
        return "No username or password", 400
    
    username = data["username"]
    password = data["password"]

    user = db.users.find_one({"username": username, "password": hashlib.sha256((password + "saltysalt").encode()).hexdigest()})
    if not user:
        db.analytics.update_one({"type": "failed_login_attempts"}, {"$inc": {"value": 1}}, upsert=True)
        return "Wrong username or password", 401
    
    session["userid"] = str(user["_id"])
    session["auth_level"] = user["auth_level"]

    db.analytics.update_one({"type": "successful_login_attempts"}, {"$inc": {"value": 1}}, upsert=True)
    return jsonify({
        "namesurname": user["namesurname"],
        "auth_level": authToString(user["auth_level"]),
    }), 200

@api.route("/api/auth/change_password", methods=["POST"])
@authorization(required_level=0)
def change_password():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "old_password" in data or not "new_password" in data:
        return "No old_password or new_password", 400
    
    old_password = data["old_password"]
    new_password = data["new_password"]

    user = db.users.find_one({"_id": session["userid"], "password": hashlib.sha256((old_password + "saltysalt").encode()).hexdigest()})
    if not user:
        return "Wrong password", 401
    
    db.users.update_one({"_id": session["userid"]}, {"$set": {"password": hashlib.sha256((new_password + "saltysalt").encode()).hexdigest()}})
    return "Password changed", 200

@api.route("/api/auth/get_user_info", methods=["GET"])
@authorization(required_level=0)
def get_user_info():
    userid = session["userid"]

    user = db.users.find_one({"_id": userid})

    return jsonify({
        "namesurname": user["namesurname"],
        "auth_level": authToString(user["auth_level"]),
        "userid": str(user["_id"]),
        "class": user["class"]
    }), 200