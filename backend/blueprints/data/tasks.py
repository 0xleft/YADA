import pymongo
import flask
from flask import session, jsonify, request, send_file, Response

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("tasks", __name__)

# task structure:
# {
#     "title": "title",
#     "description": "description",
#     "taskid": "taskid",
#     "lessonid": "lessonid",
#     "status": "graded?",
#     "grades": [
#         {
#             "userid": "userid",
#             "grade": 10
#         }
#     ]
# }