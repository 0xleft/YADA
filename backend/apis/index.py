import flask
import pymongo
from flask import session
import datetime

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("index", __name__)

@api.route("/api/index/announcements", methods=["GET"])
def announcements():
    # returns id?
    return flask.jsonify(db["announcements"].find(limit=20))

# teacher only
@api.route("/api/index/announcements/add_teacher", methods=["POST"])
def add_announcement_teacher():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "title" in data or not "content" in data:
        return "Invalid request", 400
    
    if not session["auth_level"] >= 1:
        return "Unauthorized", 401

    if db.announcements.find_one({"title": data["title"]}):
        return "Announcement already exists", 400
    
    db.announcements.insert_one({
        "title": data["title"],
        "content": data["content"],
        "author": session["username"],
        "date": datetime.datetime.now(),
        "type": "teacher"
    })
    return "Announcement added :)", 200

# admin only
@api.route("/api/index/announcements/add_admin", methods=["POST"])
def add_announcement():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "title" in data or not "content" in data:
        return "Invalid request", 400
    
    if not session["auth_level"] == 2:
        return "Unauthorized", 401
    
    if db.announcements.find_one({"title": data["title"]}):
        return "Announcement already exists", 400

    db.announcements.insert_one({
        "title": data["title"],
        "content": data["content"],
        "author": session["username"],
        "date": datetime.datetime.now(),
        "type": "admin"
    })
    return "Announcement added :)", 200
    

# admin only
@api.route("/api/index/announcements/remove", methods=["POST"])
def remove_announcement():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    if not "id" in data:
        return "Invalid request", 400
    
    if not session["auth_level"] == 2:
        return "Unauthorized", 401
    
    if not db.announcements.find_one({"title": data["title"]}):
        return "Announcement doesn't exist", 400
    
    db.announcements.delete_one({"title": data["title"]})
    return "Announcement removed :)", 200