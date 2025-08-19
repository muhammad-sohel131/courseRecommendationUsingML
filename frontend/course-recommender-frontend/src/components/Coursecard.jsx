import { Link } from "react-router-dom";

export function CourseCard({ course_id, title, description, rating, num_ratings, enrollments, tags }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
      <Link to={`/course/${course_id}`}>
        <h3 className="text-lg font-bold text-blue-600 hover:underline">{title}</h3>
      </Link>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
        <span>⭐ {rating} ({num_ratings} reviews)</span>
        <span>👥 {enrollments}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags?.split("|").map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}