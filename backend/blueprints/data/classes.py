import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
from authorization import authorization
import pandas
import time
import hashlib

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("classes", __name__)

# class structure:
# {
#     "name": "name",
#     "year": 2020,
#     "classid": "classid",
#     "members": [
#         "userid"
#     ]
# }

@api.route("/api/classes/create_class", methods=["POST"])
@authorization(required_level=2)
def create_class():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "name" in data or not "year" in data:
        return "No name or year", 400

    name = data["name"]
    year = data["year"]

    if db.classes.find_one({"name": name, "year": year}):
        return "Class already exists", 400

    classdb = db.classes.insert_one({
        "name": name,
        "year": year,
        "classid": hashlib.sha256((name + str(year) + str(time.time())).encode()).hexdigest(),
    })

    classdb = db.classes.find_one({"_id": classdb.inserted_id})

    return jsonify({
        "name": classdb["name"],
        "year": classdb["year"],
        "classid": classdb["classid"]
    }), 200

@api.route("/api/classes/download_class_stucture", methods=["GET"])
@authorization(required_level=2)
def download_user_stucture():
    class_data = list(db.classes.find({}))
    class_df = pandas.DataFrame(class_data)
    response = Response(
        class_df.to_csv(index=False),
        content_type='text/csv',
        headers={'Content-Disposition': 'attachment; filename=data.csv'}
    )
    return response, 200

@api.route("/api/classes/remove_class", methods=["POST"])
@authorization(required_level=2)
def remove_class():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "classid" in data:
        return "No classid", 400

    classid = data["classid"]

    if not db.classes.find_one({"classid": classid}):
        return "Class does not exist", 400

    db.classes.delete_one({"classid": classid})

    return "Class deleted", 200