# step2_load_data.py

import pandas as pd

# Step 2: Load the CSV files
courses = pd.read_csv("data/courses.csv")
ratings = pd.read_csv("data/ratings.csv")

# Display the first 5 rows of each file
print("Courses Data:")
print(courses.head(), "\n")

print("Ratings Data:")
print(ratings.head(), "\n")

# Check basic info
print("\n--- Courses Info ---")
print(courses.info())

print("\n--- Ratings Info ---")
print(ratings.info())

# Check if any missing values exist
print("\nMissing values in Courses:\n", courses.isnull().sum())
print("\nMissing values in Ratings:\n", ratings.isnull().sum())

# Show unique counts for IDs
print("\nNumber of unique courses:", courses['course_id'].nunique())
print("Number of unique users:", ratings['user_id'].nunique())
print("Number of ratings:", ratings.shape[0])
