// Recommendations.jsx
import { useState } from "react";
import { CourseCard } from "../components/Coursecard";

export default function Recommendations() {
  const [userId, setUserId] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = () => {
    if (!userId) return alert("Please enter a user ID");
    setLoading(true);
    fetch(`http://localhost:8000/recommend/collaborative?user_id=${userId}&top_n=5`)
      .then(res => res.json())
      .then(data => setCourses(data.items))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  console.log(courses)
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🎯 Recommended Courses for You</h2>

      {/* Input + Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchRecommendations}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Get Recommendations
        </button>
      </div>

      {/* Course List */}
      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <CourseCard key={course.course_id} {...course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recommendations yet. Enter a User ID above.</p>
      )}
    </div>
  );
}
