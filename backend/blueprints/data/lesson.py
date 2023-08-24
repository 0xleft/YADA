import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorization import authorization
import time
from datetime import datetime, timedelta

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

# creating a lesson will create a year's worth of attendance objects

@api.route("/api/lessons/create_lesson", methods=["POST"])
@authorization(required_level=2)
def create_lesson():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "subject" in data or not "length" in data or not "day" in data or not "start_time" in data or not "room" in data or not "teacher" in data:
        return "Invalid data", 400
    
    subject = data["subject"]
    length = int(data["length"])
    day = int(data["day"])
    start_time = int(data["start_time"])
    period = data["period"]
    room = data["room"]
    teacher = data["teacher"]

    if not db.users.find_one({"userid": teacher}):
        return "Invalid teacher", 400
    
    lesson = db.lessons.find_one({"subject": subject, "day": day, "start_time": start_time, "room": room})
    if lesson:
        return "Lesson already exists", 400
    
    lesson = db.lessons.insert_one({
        "subject": subject,
        "lessonid": hashlib.sha256((subject + str(time.time())).encode()).hexdigest(),
        "length": length,
        "day": day,
        "start_time": start_time,
        "room": room,
        "current": 0,
        "teacher": teacher,
        "students": []
    })

    lesson = db.lessons.find_one({"_id": lesson.inserted_id})

    month_start = int(period.split("-")[0])
    month_end = int(period.split("-")[1])

    current_date = datetime(datetime.now().year, month_start, 1)
    while current_date <= datetime(datetime.now().year, month_end, 31):
        if current_date.weekday() == day:
            db.attendances.insert_one({
                "lessonid": lesson["lessonid"],
                "day": current_date.day,
                "month": current_date.month,
                "year": current_date.year,
                "attendanceid": hashlib.sha256((lesson["lessonid"] + str(current_date.day) + str(current_date.month) + str(current_date.year) + str(time.time())).encode()).hexdigest(),
                "students": [],
                "teacher": teacher
            })

        current_date += timedelta(days=1)

    return jsonify({
        "subject": lesson["subject"],
        "lessonid": lesson["lessonid"],
        "length": lesson["length"],
        "day": lesson["day"],
        "start_time": lesson["start_time"],
        "room": lesson["room"],
        "current": lesson["current"],
        "teacher": lesson["teacher"],
        "students": lesson["students"]
    }), 200