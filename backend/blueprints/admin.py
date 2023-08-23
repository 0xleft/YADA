import pymongo
import flask
from flask import session, jsonify, request, send_file, Response
import hashlib
from authorizatoin import authorization
import pandas

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

api = flask.Blueprint("admin", __name__)

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
        server_load = {"value": [0] * 24}

    return jsonify({
        "successLogins": successful_login_attempts["value"],
        "failLogins": failed_login_attempts["value"],
        "createdTasks": created_tasks["value"],
        "gradedTasks": graded_tasks["value"],
        "serverLoad": server_load["value"]
    }), 200