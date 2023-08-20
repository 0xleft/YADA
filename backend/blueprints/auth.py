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
        return "Wrong username or password", 401
    
    session["userid"] = str(user["_id"])
    session["auth_level"] = user["auth_level"]

    return jsonify({
        "namesurname": user["namesurname"],
        "auth_level": authToString(user["auth_level"]),
    }), 200

@api.route("/api/auth/create_user", methods=["POST"])
@authorization(required_level=2)
def create_user():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "namesurname" in data or not "auth_level" in data:
        return "No namesurname or auth_level", 400

    namesurname = data["namesurname"]
    auth_level = data["auth_level"]

    if auth_level < 0 or auth_level >= 2:
        return "Invalid auth level", 400
    
    if db.users.find_one({"namesurname": namesurname}):
        return "User already exists", 400

    username = namesurname.lower().replace(" ", "_")

    db.users.insert_one({
        "username": username,
        "password": hashlib.sha256(("changeme123" + "saltysalt").encode()).hexdigest(),
        "namesurname": namesurname,
        "auth_level": auth_level
    })

    return "User created", 200

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

@api.route("/api/auth/upload_user_structure", methods=["POST"])
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
            "auth_level": int(row["auth_level"])
        })

    return "Users uploaded", 200

@api.route("/api/auth/download_user_stucture", methods=["GET"])
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