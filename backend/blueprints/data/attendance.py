import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorization import authorization

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("attendance", __name__)

# attendace objects will be created as the lessons are created which means one creation of a lesson will create a year's worth of attendance objects

# attendance structure:
# {
#     "lessonid": "lessonid",
#     "day": "day",
#     "month": "month",
#     "year": "year",
#     "attendaceid": "attendanceid",
#     "students": [
#         {
#             "userid": "userid",
#             "present": "present"
#         }
#     ],
#     "teacher": "userid of the teacher"
# }

# student
@api.route("/api/attendance/get_missed_attendances", methods=["POST"])
@authorization(required_level=0)
def get_missed_attendances():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "userid" in data:
        return "Invalid data", 400
    
    userid = data["userid"]

    attendances = db.attendance.find({"students": {"$elemMatch": {"userid": userid, "present": False}}})

    attendances_out = []
    for attendance in attendances:
        attendances_out.append({
            "lessonid": attendance["lessonid"],
            "day": attendance["day"],
            "month": attendance["month"],
            "year": attendance["year"],
            "teacher": attendance["teacher"]
        })

    return jsonify(attendances_out), 200

@api.route("/api/attendance/submit_attendance", methods=["POST"])
@authorization(required_level=1)
def submit_attendance():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "lessonid" in data or not "day" in data or not "month" in data or not "year" in data or not "students" in data:
        return "Invalid data", 400
    
    lessonid = data["lessonid"]
    day = data["day"]
    month = data["month"]
    year = data["year"]
    students = data["students"]

    teacherid = session["userid"]

    attendance = db.attendance.find_one({"lessonid": lessonid, "day": day, "month": month, "year": year, "teacher": teacherid})
    if attendance:
        return "Attendance doesn't exist", 400
    
    attendance = db.attendance.update_one({"lessonid": lessonid, "day": day, "month": month, "year": year, "teacher": teacherid}, {"$set": {"students": students}})

    return jsonify({
        "lessonid": lessonid,
        "day": day,
        "month": month,
        "year": year,
        "students": students,
        "teacher": teacherid
    }), 200

@api.route("/api/attendance/get_attendance", methods=["POST"])
@authorization(required_level=1)
def get_attendance():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "lessonid" in data or not "day" in data or not "month" in data or not "year" in data:
        return "Invalid data", 400
    
    lessonid = data["lessonid"]
    day = data["day"]
    month = data["month"]
    year = data["year"]
    
    teacherid = session["userid"]

    attendance = db.attendance.find_one({"lessonid": lessonid, "day": day, "month": month, "year": year, "teacher": teacherid})
    if not attendance:
        return "Attendance doesn't exist", 400
    
    return jsonify({
        "lessonid": attendance["lessonid"],
        "day": attendance["day"],
        "month": attendance["month"],
        "year": attendance["year"],
        "students": attendance["students"],
        "teacher": attendance["teacher"]
    }), 200