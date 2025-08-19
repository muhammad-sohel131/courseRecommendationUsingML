// Home.jsx
import { useEffect, useState } from "react";
import { CourseCard } from "../components/Coursecard";
import { Link } from "react-router-dom";
import banner from "../assets/bannerE.jpg";
export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/recommend/popularity?top_n=10")
      .then((res) => res.json())
      .then((data) => setCourses(data.items))
      .catch((err) => console.error(err));
  }, []);

  console.log(courses);

  return (
    <div>
      {/* Banner */}
      <section
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0,0,0,.5)",
          backgroundBlendMode: "overlay"
        }}
        className="text-white py-20 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Course</h1>
        <p className="text-lg opacity-90 mb-6">
          Tailored recommendations to boost your learning journey.
        </p>
        <Link
          to="/recommended-course"
          className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          Get Recommendations
        </Link>
      </section>

      {/* Popular Courses */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">🔥 Popular Courses</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.course_id} {...course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
