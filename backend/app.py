# app.py
from flask import Flask, request, jsonify
from popularity import top_popular
from content_model import recommend_similar, train_and_save_content
from collaborative_model import recommend_for_user, train_and_save_cf
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # after `app = Flask(__name__)`


@app.route("/")
def root():
    return jsonify({"message": "Course Recommender API is running", "endpoints": [
        "/recommend/popularity?top_n=5",
        "/recommend/content?course_id=101&top_n=5",
        "/recommend/collaborative?user_id=1&top_n=5",
        "/train/content",
        "/train/collaborative"
    ]})

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "courses.csv")

@app.route("/api/courses", methods=["GET"])
def get_all_courses():
    try:
        courses_df = pd.read_csv(DATA_PATH)
        courses = courses_df.to_dict(orient="records")
        return jsonify({"status": "success", "courses": courses}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
# --- Popularity ---
@app.route("/recommend/popularity", methods=["GET"])
def api_popularity():
    top_n = int(request.args.get("top_n", 5))
    return jsonify({"method":"popularity", "items": top_popular(top_n)})

# --- Content-based (TF-IDF) ---
@app.route("/recommend/content", methods=["GET"])
def api_content():
    try:
        course_id = int(request.args.get("course_id"))
    except (TypeError, ValueError):
        return jsonify({"error":"Provide integer course_id"}), 400
    top_n = int(request.args.get("top_n", 5))
    recs = recommend_similar(course_id, top_n)
    if not recs:
        return jsonify({"error":"course_id not found"}), 404
    return jsonify({"method":"content", "items": recs})

# --- Collaborative (SVD model) ---
@app.route("/recommend/collaborative", methods=["GET"])
def api_collab():
    try:
        user_id = int(request.args.get("user_id"))
    except (TypeError, ValueError):
        return jsonify({"error":"Provide integer user_id"}), 400
    top_n = int(request.args.get("top_n", 5))
    recs = recommend_for_user(user_id, top_n)
    return jsonify({"method":"collaborative", "user_id": user_id, "items": recs})

# --- (Optional) Train endpoints ---
@app.route("/train/content", methods=["POST", "GET"])
def api_train_content():
    train_and_save_content()
    return jsonify({"status":"ok","trained":"content"})

@app.route("/train/collaborative", methods=["POST", "GET"])
def api_train_collab():
    train_and_save_cf()
    return jsonify({"status":"ok","trained":"collaborative"})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
