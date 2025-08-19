# collaborative_model.py

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import StandardScaler

MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "cf_svd.joblib")
INDEX_PATH = os.path.join(MODEL_DIR, "cf_indices.joblib")


def _build_user_item(ratings_df: pd.DataFrame):
    # """
    # Build the user-item ratings matrix.
    # Returns:
    #   R (DataFrame): users x items ratings matrix (NaN->0)
    #   user_ids (list), item_ids (list)
    # """
    R = ratings_df.pivot_table(index="user_id", columns="course_id", values="rating")
    return R.fillna(0.0), list(R.index), list(R.columns)


def train_and_save_cf(ratings_csv="data/ratings.csv", n_components=32, random_state=42):
    """
    Train a collaborative filtering model using TruncatedSVD (matrix factorization).
    Saves the model artifacts to disk.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)
    ratings = pd.read_csv(ratings_csv)

    # Build matrix
    R, user_ids, item_ids = _build_user_item(ratings)
    X = R.values.astype(np.float32)

    # Mean-center per user (remove user bias)
    user_means = X.mean(axis=1, keepdims=True)
    X_centered = X - user_means

    # Dynamically adjust n_components to avoid SVD errors
    max_possible = min(len(user_ids), len(item_ids)) - 1
    if n_components > max_possible:
        n_components = max_possible

    # SVD factorization (matrix factorization)
    svd = TruncatedSVD(n_components=n_components, random_state=random_state)
    U = svd.fit_transform(X_centered)            # (n_users x k)
    S = svd.singular_values_                     # (k,)
    VT = svd.components_                         # (k x n_items)

    # Scale latent spaces for stability
    u_scaler = StandardScaler(with_mean=False)
    v_scaler = StandardScaler(with_mean=False)
    U_scaled = u_scaler.fit_transform(U)
    VT_scaled = v_scaler.fit_transform(VT.T).T   # scale columns, then transpose back

    artifact = {
        "svd": svd,
        "U": U_scaled,            # (n_users x k)
        "S": S,                   # (k,)
        "VT": VT_scaled,          # (k x n_items)
        "user_means": user_means, # (n_users x 1)
        "user_ids": user_ids,
        "item_ids": item_ids,
    }
    joblib.dump(artifact, MODEL_PATH)
    joblib.dump({
        "user_to_idx": {u: i for i, u in enumerate(user_ids)},
        "item_to_idx": {it: i for i, it in enumerate(item_ids)},
    }, INDEX_PATH)
    return artifact


def _load_artifacts():
    """Load saved collaborative filtering artifacts."""
    if not (os.path.exists(MODEL_PATH) and os.path.exists(INDEX_PATH)):
        # First-time training if missing
        artifact = train_and_save_cf()
        index = joblib.load(INDEX_PATH)
        artifact["user_to_idx"] = index["user_to_idx"]
        artifact["item_to_idx"] = index["item_to_idx"]
        return artifact
    
    artifact = joblib.load(MODEL_PATH)
    index = joblib.load(INDEX_PATH)
    artifact["user_to_idx"] = index["user_to_idx"]
    artifact["item_to_idx"] = index["item_to_idx"]
    return artifact



def recommend_for_user(user_id, top_n=5, courses_csv="data/courses.csv"):
    """
    Recommend courses for a given user based on collaborative filtering.
    Predict scores = U * S * VT + user_mean, then rank unseen items.
    """
    art = _load_artifacts()
    U = art["U"]                      # (n_users x k)
    S = art["S"]                      # (k,)
    VT = art["VT"]                    # (k x n_items)
    user_means = art["user_means"]    # (n_users x 1)
    user_to_idx = art["user_to_idx"]
    item_ids = art["item_ids"]

    courses = pd.read_csv(courses_csv)
    meta = courses.set_index("course_id")[["title", "category", "level", "rating", "num_ratings", "enrollments", "tags"]]

    # Cold start → fallback to popularity
    if user_id not in user_to_idx:
        cold = courses.sort_values(["num_ratings", "rating"], ascending=False).head(top_n)
        out = cold[["course_id", "title", "category", "level", "rating", "num_ratings", "enrollments"]].copy()
        out["reason"] = "cold_start_popular"
        return out.to_dict(orient="records")

    u = user_to_idx[user_id]
    user_latent = U[u] * S
    preds = user_latent @ VT
    preds = preds + float(user_means[u])  # add back user bias

    # Mask already-rated items
    rated = pd.read_csv("data/ratings.csv")
    rated_set = set(rated[rated["user_id"] == user_id]["course_id"].tolist())
    mask = np.array([(-np.inf if cid in rated_set else p) for cid, p in zip(item_ids, preds)])

    # Get top recommendations
    top_idx = np.argsort(mask)[::-1][:top_n]
    top_course_ids = [item_ids[i] for i in top_idx]
    scores = [float(mask[i]) for i in top_idx]

    result = meta.loc[top_course_ids].reset_index()
    result.insert(1, "pred_score", np.round(scores, 4))
    return result.to_dict(orient="records")
