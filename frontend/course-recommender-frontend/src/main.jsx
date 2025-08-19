import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home.jsx';
import AllCourses from './pages/AllCourse.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Recommendations from './pages/ Recommendations.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/courses',
        element: <AllCourses />
      },
      {
        path: '/course/:courseId',
        element: <CourseDetails />
      },
      {
        path: '/recommended-course',
        element: <Recommendations />
      }
    ]
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
