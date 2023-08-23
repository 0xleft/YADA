import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorization import authorization
import pandas
import time
from utils import auth_to_string

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("users", __name__)

@api.route("/api/users/create_user", methods=["POST"])
@authorization(required_level=2)
def create_user():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "namesurname" in data or not "auth_level" in data:
        return "No namesurname or auth_level", 400

    namesurname = data["namesurname"]
    auth_level = int(data["auth_level"])

    if auth_level < 0 or auth_level >= 2:
        return "Invalid auth level", 400
    
    username = namesurname.lower().replace(" ", "_")
    
    if db.users.find_one({"namesurname": namesurname, "username": username}):
        return "User already exists", 400

    user = db.users.insert_one({
        "username": username,
        "password": hashlib.sha256(("changeme123" + "saltysalt").encode()).hexdigest(),
        "namesurname": namesurname,
        "auth_level": auth_level,
        "userid": hashlib.sha256((username + str(time.time())).encode()).hexdigest()
    })

    added_user = db.users.find_one({"_id": user.inserted_id})

    return jsonify({
        "namesurname": added_user["namesurname"],
        "username": added_user["username"],
        "auth_level": auth_to_string(added_user["auth_level"]),
        "userid": added_user["userid"]
    }), 200


@api.route("/api/users/upload_user_structure", methods=["POST"])
@authorization(required_level=2)
def upload_user_structure():
    # TODO TEST

    # upload a file containing all the users
    # the file should be a csv file

    if "file" not in request.files:
        return "No file", 400
    
    file = request.files["file"]
    if file.filename == "":
        return "No file", 400
    
    if not file.filename.endswith(".csv"):
        return "Invalid file type", 400
    
    # read the csv file
    df = pandas.read_csv(file)
    for index, row in df.iterrows():
        if not "username" in row or not "password" in row or not "namesurname" in row or not "auth_level" in row:
            return "Invalid file structure", 400
        
        if row["auth_level"] < 0 or row["auth_level"] >= 2:
            return "Invalid auth level", 400
        
    # clear database for auth level 0 and 1
    db.users.delete_many({"auth_level": {"$in": [0, 1]}})

    for index, row in df.iterrows():
        db.users.insert_one({
            "username": row["username"],
            "password": hashlib.sha256((row["password"] + "saltysalt").encode()).hexdigest(),
            "namesurname": row["namesurname"],
            "auth_level": int(row["auth_level"]),
            "userid": hashlib.sha256((row["username"] + str(time.time())).encode()).hexdigest()
        })

    return "Users uploaded", 200

@api.route("/api/users/download_user_stucture", methods=["GET"])
@authorization(required_level=2)
def download_user_stucture():
    users_data = list(db.users.find({"auth_level": {"$in": [0, 1]}}))
    users_df = pandas.DataFrame(users_data)
    response = Response(
        users_df.to_csv(index=False),
        content_type='text/csv',
        headers={'Content-Disposition': 'attachment; filename=data.csv'}
    )
    return response, 200

@api.route("/api/users/remove_user", methods=["POST"])
@authorization(required_level=2)
def remove_user():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "userid" in data:
        return "No userid", 400

    userid = data["userid"]

    if not db.users.find_one({"userid": userid}):
        return "User does not exist", 400

    user = db.users.find_one({"userid": userid})

    if user["auth_level"] == 2:
        return "Cannot delete admin", 400

    db.users.delete_one({"userid": userid})

    return "User deleted", 200