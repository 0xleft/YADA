import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
from authorization import authorization
from utils import auth_to_string
import re

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("search", __name__)

@api.route("/api/search/users", methods=["POST"])
@authorization(required_level=2)
def search_users():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    name = data["name"]
    auth_level = int(data["auth_level"])

    # add limit ?
    users = db.users.find({"namesurname": {"$regex": re.compile(name)}, "auth_level": auth_level})

    users_out = []
    for user in users:
        users_out.append({
            "namesurname": user["namesurname"],
            "username": user["username"],
            "auth_level": auth_to_string(user["auth_level"]),
            "userid": user["userid"]
        })

    return jsonify(users_out), 200

@api.route("/api/search/classes", methods=["POST"])
@authorization(required_level=2)
def search_classes():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    name = data["name"]
    year = data["year"]

    classes = db.classes.find({"name": {"$regex": re.compile(name)}})
    
    classes_out = []
    for clazz in classes:
        classes_out.append({
            "name": clazz["name"],
            "year": clazz["year"],
            "classid": clazz["classid"]
        })

    return jsonify(classes_out), 200