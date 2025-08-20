# Personalized Course Recommendation System
**Live url: *** https://course-recommender-frontend-five.vercel.app

It is a web-based platform that provides **personalized course recommendations** using multiple machine learning approaches. It features a modern React frontend with Tailwind CSS and a Python backend implementing popularity-based, content-based, and collaborative filtering recommendation algorithms.

## Features

### Frontend
- **React.js & Tailwind CSS:** Responsive and modern UI design.
- **Home Page:** Displays popularity-based courses for quick access.
- **All Courses Page:** Lists all available courses.
- **Course Details:** Clicking a course shows related courses fetched from the **content-based recommendation API**.
- **Recommendation Page:** Users can input a **user ID** to see collaborative filtering recommendations.

### Backend
- **Python & Flask API** serving ML recommendation algorithms.
- **Popularity-Based Recommendation:** Highlights trending courses based on user interactions.
- **Content-Based Recommendation:** Uses **SentenceTransformer embeddings** to find courses similar to a selected course.
- **Collaborative Filtering:** Provides personalized recommendations using user-course interactions from CSV data.
- **Data Storage:** CSV files for courses and user interactions.
- **No Login System:** Collaborative filtering uses prepared user IDs for testing.

### Tools & Libraries
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Python, Flask, Pandas, Joblib
- **ML & NLP:** Scikit-learn, Sentence-Transformers
- **Other:** Git, Node.js, npm

## How It Works

1. **Popularity-Based Recommendations:** Home page shows trending courses based on ratings and enrollments.
2. **Content-Based Recommendations:** Clicking a course fetches top-N similar courses using semantic embeddings (cosine similarity).
3. **Collaborative Filtering:** Input user ID on the Recommendation page to get personalized course suggestions using user-course interaction data.

## Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```
