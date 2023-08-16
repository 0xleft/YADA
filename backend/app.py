import flask
import pymongo
import os
import waitress
from apis import index, auth, grades, planning

app = flask.Flask(__name__)

app.secret_key = os.urandom(2014)

client = pymongo.MongoClient("mongodb://mongodb:27017/")
db = client["main"]

@app.route("/api", methods=["GET"])
def default():
    return "", 200

if __name__ == "__main__":
    app.register_blueprint(index.api)
    app.register_blueprint(auth.api)
    app.register_blueprint(grades.api)
    app.register_blueprint(planning.api)

    waitress.serve(app, port=5000)