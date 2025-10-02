

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/livesitter"
mongo = PyMongo(app)

overlays = mongo.db.overlays

def to_json(doc):
    return {
        "id": str(doc["_id"]),
        "type": doc.get("type", "text"),
        "content": doc.get("content", ""),
        "x": doc.get("x", 50),
        "y": doc.get("y", 50),
        "width": doc.get("width", 150),
        "height": doc.get("height", 50)
    }


@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.json
    new_overlay = {
        "type": data.get("type", "text"),
        "content": data.get("content", ""),
        "x": data.get("x", 50),
        "y": data.get("y", 50),
        "width": data.get("width", 150),
        "height": data.get("height", 50)
    }
    res = overlays.insert_one(new_overlay)
    saved = overlays.find_one({"_id": res.inserted_id})
    return jsonify(to_json(saved)), 201


@app.route("/api/overlays", methods=["GET"])
def get_overlays():
    docs = overlays.find()
    return jsonify([to_json(d) for d in docs])


@app.route("/api/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json
    overlays.update_one({"_id": ObjectId(id)}, {"$set": data})
    updated = overlays.find_one({"_id": ObjectId(id)})
    return jsonify(to_json(updated))


@app.route("/api/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    overlays.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
