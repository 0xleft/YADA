import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorization import authorization

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("lessons", __name__)

# lesson structure:
# {
#     "subject": "subject",
#     "lessonid": "lessonid",
#     "length": "length",
#     "day": "day",
#     "start_time": "start_time",
#     "room": "room",
#     "current": "current",
#     "teacher": "teacher",
# }

@api.route("/api/lessons/create_lesson", methods=["POST"])
@authorization(required_level=2)
def create_lesson():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "subject" in data or not "length" in data or not "day" in data or not "start_time" in data or not "room" in data or not "teacher" in data:
        return "Invalid data", 400
    
    subject = data["subject"]
    length = data["length"]
    day = data["day"]
    start_time = data["start_time"]
    room = data["room"]
    teacher = data["teacher"]

    