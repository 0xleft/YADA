import flask
import pymongo
from flask import session

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("grades", __name__)

@api.route("/api/grades/get", methods=["GET"])
def get_grades():
    data = flask.request.get_json(silent=True, force=True)
    if not data:
        return "Invalid request", 400
    
    username = session["username"]
    year = data["year"]

    return flask.jsonify(db["grades"].find({"username": username, "year": year}))