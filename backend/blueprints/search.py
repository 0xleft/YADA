import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorizatoin import authorization
from utils import authToString
import pandas

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
    clazz = data["class"]

    users = db.users.find({"namesurname": {"$regex": name, "$options": "i"}, "class": {"$regex": clazz, "$options": "i"}})
    
    users_out = []
    for user in users:
        users_out.append({
            "namesurname": user["namesurname"],
            "class": user["class"],
            "userid": str(user["_id"])
        })

    return jsonify(users_out), 200

@api.route("/api/search/classes", methods=["POST"])
@authorization(required_level=2)
def search_classes():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    clazz = data["class"]
    year = data["year"]

    classes = db.classes.find({"name": {"$regex": clazz, "$options": "i"}, "year": year})
    
    classes_out = []
    for clazz in classes:
        classes_out.append({
            "name": clazz["name"],
            "classid": str(clazz["_id"])
        })

    return jsonify(classes_out), 200