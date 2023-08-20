import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
from authorizatoin import authorization
from utils import authToString

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("tasks", __name__)

@api.route("/api/tasks/get_asigned_tasks", methods=["GET"])
@authorization(required_level=0)
def get_asigned_tasks():
    # TODO TEST

    userid = session["userid"]

    tasks = db.tasks.find({'asigned_to': {'$in': [userid]}})

    tasks_out = []
    for task in tasks:
        tasks_out.append({
            "title": task["title"],
            "subject": task["subject"],
            "taskid": str(task["_id"]),
            "graded": task["graded"]
        })

    return jsonify(tasks_out), 200

@api.route("/api/tasks/get_created_tasks", methods=["GET"])
@authorization(required_level=1)
def get_created_tasks():
    userid = session["userid"]

    tasks = db.tasks.find({'created_by': userid})

    tasks_out = []
    for task in tasks:
        tasks_out.append({
            "title": task["title"],
            "subject": task["subject"],
            "taskid": str(task["_id"]),
            "graded": task["graded"]
        })

    return jsonify(tasks_out), 200

@api.route("/api/tasks/create_task", methods=["POST"])
@authorization(required_level=1)
def create_task():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "title" in data or not "subject" or not "class" in data:
        return "Missing parameters", 400
    
    title = data["title"]
    subject = data["subject"]
    clazz = data["class"]

    # get all students of the class
    students = db.users.find({"class": clazz})

    # create a task where the asigned_to is the array of all the students
    task = {
        "title": title,
        "subject": subject,
        "created_by": session["userid"],
        "asigned_to": [str(student["_id"]) for student in students],
        "graded": False
    }

    taskdb = db.tasks.insert_one(task)

    return taskdb.inserted_id, 200

@api.route("/api/tasks/remove_task", methods=["POST"])
@authorization(required_level=1)
def remove_task():
    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "taskid" in data:
        return "No taskid", 400

    taskid = data["taskid"]

    if not db.tasks.find_one({"_id": taskid, "created_by": session["userid"]}):
        return "Task does not exist", 400

    db.tasks.delete_one({"_id": taskid, "created_by": session["userid"]})

    return "Task deleted", 200

@api.route("/api/tasks/get_task_grade_info", methods=["POST"])
@authorization(required_level=1)
def get_task_grade_info():
    #const taskInfo = {
    #    id: task.id,
    #    name: "Task 1",
    #    class: "S2G1",
    #    subject: "Math",
    #    published: false,
    #    students: [
    #        {name: "John Doe", grade: 10},
    #        {name: "Jane Doe", grade: 9},
    #        {name: "John Smith", grade: 8},
    #        {name: "Jane Smith", grade: 7},
    #    ]
    #}

    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "taskid" in data:
        return "No taskid", 400
    
    taskid = data["taskid"]

    task = db.tasks.find_one({"_id": taskid, "created_by": session["userid"]})

    if not task:
        return "Task does not exist", 400
    
    students = db.users.find({"_id": {"$in": task["asigned_to"]}})
    students_out = []
    for student in students:
        students_out.append({
            "name": student["namesurname"],
            "grade": student["grades"][str(taskid)],
            "userid": str(student["_id"])
        })

    return jsonify({
        "id": str(task["_id"]),
        "name": task["title"],
        "class": task["class"],
        "subject": task["subject"],
        "published": task["graded"],
        "students": students_out
    }), 200

@api.route("/api/tasks/submit_grades", methods=["POST"])
@authorization(required_level=1)
def submit_grades():
    #students: [
    #        {id:mongoid, grade: 10},
    #        {id:mongoid2, grade: 2},
    #        {id:mongoid3, grade: 1},
    #        {id:mongoid4, grade: 10},
    #    ]

    data = request.get_json(silent=True, force=True)
    if not data:
        return "No data", 400
    
    if not "taskid" in data or not "students" in data:
        return "Missing parameters", 400
    
    taskid = data["taskid"]
    students = data["students"]

    for student in students:
        db.users.update_one({"_id": student["id"]}, {"$set": {"grades." + taskid: student["grade"]}})

    return "Grades submitted", 200

@api.route("/api/tasks/get_student_grade", methods=["GET"])
@authorization(0)
def get_student_grade():

    