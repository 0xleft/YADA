import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorizatoin import authorization
from utils import authToString
import pandas

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("admin", __name__)

@api.route("/api/admin/create_user", methods=["POST"])
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

@api.route("/api/admin/upload_user_structure", methods=["POST"])
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

@api.route("/api/admin/download_user_stucture", methods=["GET"])
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

@api.route("/api/admin/remove_user", methods=["POST"])
@authorization(required_level=2)
def remove_user():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "userid" in data:
        return "No userid", 400

    userid = data["userid"]

    if not db.users.find_one({"_id": userid}):
        return "User does not exist", 400

    db.users.delete_one({"_id": userid})

    return "User deleted", 200

@api.route("/api/admin/create_class", methods=["POST"])
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

    db.classes.insert_one({
        "name": name,
        "year": year
    })

    return "Class created", 200

@api.route("/api/admin/upload_class_structure", methods=["POST"])
@authorization(required_level=2)
def upload_class_structure():
    # TODO TEST

    # upload a file containing all the classes
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
        if not "name" in row or not "year" in row:
            return "Invalid file structure", 400
        
    # clear database for auth level 0 and 1
    db.classes.delete_many({})

    for index, row in df.iterrows():
        db.classes.insert_one({
            "name": row["name"],
            "year": int(row["year"])
        })

    return "Classes uploaded", 200

@api.route("/api/admin/download_class_stucture", methods=["GET"])
@authorization(required_level=2)
def download_class_stucture():
    classes_data = list(db.classes.find({}))
    classes_df = pandas.DataFrame(classes_data)
    response = Response(
        classes_df.to_csv(index=False),
        content_type='text/csv',
        headers={'Content-Disposition': 'attachment; filename=data.csv'}
    )
    return response, 200

@api.route("/api/admin/remove_class", methods=["POST"])
@authorization(required_level=2)
def remove_class():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "classid" in data:
        return "No classid", 400

    classid = data["classid"]

    if not db.classes.find_one({"_id": classid}):
        return "Class does not exist", 400

    db.classes.delete_one({"_id": classid})

    return "Class deleted", 200

@api.route("/api/admin/summary", methods=["GET"])
def summary():
    # returns 
        #const analytics = {
        #successLogins: 100,
        #failLogins: 10,
        #createdTasks: 20,
        #gradedTasks: 30,
        #serverLoad: [
        #    10,
        #    9.5,
        #    8.5,
        #    7.4,
        #]
    #}

    successful_login_attempts = db.analytics.find_one({"type": "successful_login_attempts"})
    failed_login_attempts = db.analytics.find_one({"type": "failed_login_attempts"})

    created_tasks = db.analytics.find_one({"type": "created_tasks"})
    graded_tasks = db.analytics.find_one({"type": "graded_tasks"})

    server_load = db.analytics.find_one({"type": "server_load"})

    if not successful_login_attempts:
        successful_login_attempts = {"value": 0}

    if not failed_login_attempts:
        failed_login_attempts = {"value": 0}

    if not created_tasks:
        created_tasks = {"value": 0}

    if not graded_tasks:
        graded_tasks = {"value": 0}

    if not server_load:
        server_load = {"value": []}

    return jsonify({
        "successful_login_attempts": successful_login_attempts["value"],
        "failed_login_attempts": failed_login_attempts["value"],
        "created_tasks": created_tasks["value"],
        "graded_tasks": graded_tasks["value"],
        "server_load": server_load["value"]
    }), 200