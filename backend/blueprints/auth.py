import pymongo
import flask
from flask import session, jsonify, request, send_file, Response, redirect
import hashlib
from authorizatoin import authorization
from utils import authToString
import pandas
import time

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("auth", __name__)

# userid and auth_level are stored in session

@api.route("/api/auth/logout", methods=["GET"])
@authorization(required_level=0)
def logout():
    session.clear()
    return redirect("/")

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
        return "Wrong username or password", 401
    
    session["userid"] = user["userid"]
    session["auth_level"] = user["auth_level"]

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

    user = db.users.find_one({"userid": session["userid"], "password": hashlib.sha256((old_password + "saltysalt").encode()).hexdigest()})
    if not user:
        return "Wrong password", 401
    
    db.users.update_one({"userid": session["userid"]}, {"$set": {"password": hashlib.sha256((new_password + "saltysalt").encode()).hexdigest()}})

    # clear session so he has to log in again using the new password
    session.clear()
    return "Password changed", 200

@api.route("/api/auth/get_user_info", methods=["GET"])
@authorization(required_level=0)
def get_user_info():
    userid = session["userid"]

    user = db.users.find_one({"userid": userid})

    if not user:
        return "User not found", 404
    
    return jsonify({
        "namesurname": user["namesurname"],
        "auth_level": authToString(user["auth_level"]),
    }), 200