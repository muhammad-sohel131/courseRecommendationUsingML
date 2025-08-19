import os
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

MODEL_DIR = "models"
CONTENT_MODEL = os.path.join(MODEL_DIR, "content_model_embeddings.joblib")

# Choose a lightweight but accurate embedding model
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"


def train_and_save_content(courses_csv="data/courses.csv"):
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Load course data
    courses = pd.read_csv(courses_csv).copy()

    # Combine all text fields into a single string per course
    courses["combined"] = (
        courses["category"].fillna("") + " " +
        courses["tags"].fillna("") + " " +
        courses["level"].fillna("") + " " +
        courses["description"].fillna("")
    )

    # Load transformer model for embeddings
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    # Encode text into semantic embeddings
    embeddings = model.encode(courses["combined"].tolist(), show_progress_bar=True)

    # Compute cosine similarity between all courses
    sim = cosine_similarity(embeddings, embeddings)

    # Save everything
    joblib.dump({
        "courses": courses,
        "model_name": EMBEDDING_MODEL_NAME,
        "embeddings": embeddings,
        "sim": sim
    }, CONTENT_MODEL)

    return {"courses": courses, "embeddings": embeddings, "sim": sim}


def _load():
    if not os.path.exists(CONTENT_MODEL):
        return train_and_save_content()
    data = joblib.load(CONTENT_MODEL)
    return data


def recommend_similar(course_id, top_n=5):
    data = _load()
    courses, sim = data["courses"], data["sim"]

    # Ensure course exists
    if course_id not in courses["course_id"].values:
        return []

    # Find the index of the selected course
    idx = courses.index[courses["course_id"] == course_id][0]

    # Get similarity scores for this course
    scores = list(enumerate(sim[idx]))

    # Sort by similarity, skip the course itself
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    # Get course details for top N similar
    idxs = [i for i, _ in scores]
    out = courses.iloc[idxs][[
        "course_id", "title", "category", "level",
        "rating", "num_ratings", "enrollments", "tags"
    ]]

    return out.to_dict(orient="records")