import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
from authorization import authorization
import pandas

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
        "year": year
    })

    return classdb.inserted_id, 200

@api.route("/api/classes/upload_class_structure", methods=["POST"])
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

@api.route("/api/classes/download_class_stucture", methods=["GET"])
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

@api.route("/api/classes/remove_class", methods=["POST"])
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

@api.route("/api/classes/get_my_classes")
@authorization(required_level=1)
def get_my_classes():
    data = request.get_json(force=True, silent=True)
    if not data:
        return "No data", 400

    userid = data["userid"]

    classes = list(db.classes.find({"students": userid}))

    classes_out = []
    for clazz in classes:
        classes_out.append({
            "name": clazz["name"],
            "classid": str(clazz["_id"])
        })

    return jsonify(classes_out), 200