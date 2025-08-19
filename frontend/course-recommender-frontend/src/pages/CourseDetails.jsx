// CourseDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import banner from "../assets/bannerE.jpg";
import { CourseCard } from "../components/Coursecard";

export default function CourseDetails() {
  const { courseId } = useParams();
  console.log(courseId);
  const [course, setCourse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch course details
    fetch("http://localhost:8000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        const found = data.courses.find((c) => c.course_id == courseId);
        setCourse(found);
      })
      .catch((err) => console.error(err));

    // Fetch content-based recommendations
    fetch(
      `http://localhost:8000/recommend/content?course_id=${courseId}&top_n=5`
    )
      .then((res) => res.json())
      .then((data) => setRecommendations(data.items))
      .catch((err) => console.error(err));
  }, [courseId]);

  if (!course) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading course details...
      </p>
    );
  }

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0,0,0,.8)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 text-white">
          {/* Course Details */}
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="mb-4">{course.description}</p>
          <div className="flex items-center space-x-6 text-smmb-6">
            <span>
              ⭐ {course.rating} ({course.num_ratings} reviews)
            </span>
            <span>👥 {course.enrollments} enrolled</span>
            <span>📂 {course.category}</span>
            <span>🎯 {course.level}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {course.tags.split("|").map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-2xl font-bold mb-6">💡 Related Courses</h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-500">Loading recommendations...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((course) => (
              <CourseCard key={course.course_id} {...course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
