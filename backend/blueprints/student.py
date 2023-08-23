import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorizatoin import authorization
from utils import auth_to_string
import pandas

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("student", __name__)

@api.route("/api/student/get_summary", methods=["GET"])
@authorization(required_level=0)
def get_summary():
    #const summary = {
    #    average: 8.5,
    #    classRank: 2,
    #    classSize: 20,
    #    classAverage: 7.5,
    #        averageGradeHistory: [
    #            10,
    #            9.5,
    #            8.5,
    #            7.4,
    #            6.5,
    #            8.7,
    #            9.3,
    #            10,
    #            10
    #        ]
    #}

    userid = session["userid"]

    # TODO