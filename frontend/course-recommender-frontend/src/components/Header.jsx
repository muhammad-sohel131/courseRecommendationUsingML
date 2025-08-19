import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">MyCourses</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              All Courses
            </NavLink>

            <NavLink
              to="/recommended-course"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Recommended Course
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col space-y-2 px-4 py-3">
            <NavLink
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              All Courses
            </NavLink>

            <NavLink
              to="/recommended-course"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Recommended Course
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
