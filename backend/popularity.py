# popularity.py
import pandas as pd

def top_popular(top_n=10, courses_csv="data/courses.csv"):
    courses = pd.read_csv(courses_csv)
    courses["num_ratings"] = pd.to_numeric(courses["num_ratings"], errors="coerce").fillna(0)
    courses["rating"] = pd.to_numeric(courses["rating"], errors="coerce").fillna(0)
    out = courses.sort_values(["num_ratings","rating"], ascending=False).head(top_n)
    return out[["course_id","title","category","level","rating","num_ratings","enrollments", "tags"]].to_dict(orient="records")
