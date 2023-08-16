import flask
import pymongo
from flask import session

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("planning", __name__)

@api.route("/api/planning/get_week_schedule", methods=["GET"])
def get_week_schedule():
    if not "username" in session:
        return "Unauthorized", 401
    
    username = session["username"]
    return flask.jsonify(db["planning"].find({"username": username, "type": "schedule"}))

@api.route("/api/planning/get_week_homework", methods=["GET"])
def get_week_homework():
    if not "username" in session:
        return "Unauthorized", 401
    
    username = session["username"]
    return flask.jsonify(db["planning"].find({"username": username, "type": "homework"}))

@api.route("/api/planning/get_week_tests", methods=["GET"])
def get_week_tests():
    if not "username" in session:
        return "Unauthorized", 401
    
    username = session["username"]
    return flask.jsonify(db["planning"].find({"username": username, "type": "tests"}))