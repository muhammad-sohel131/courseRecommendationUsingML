import { useEffect, useState } from "react";
import { CourseCard } from "../components/Coursecard";
export default function AllCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data.courses))
      .catch(err => console.error(err));
  }, []);

  console.log(courses)
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">📚 All Courses</h2>
      {courses.length === 0 ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <CourseCard key={course.course_id} {...course} />
          ))}
        </div>
      )}
    </div>
  );
}