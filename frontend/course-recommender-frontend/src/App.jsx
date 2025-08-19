// const API_BASE = "http://localhost:8000";
// const res = await fetch(`${API_BASE}/recommend/popularity?top_n=${popTopN}`);
// const res = await fetch(`${API_BASE}/recommend/content?course_id=${contentCourseId}&top_n=${contentTopN}`);
// const res = await fetch(`${API_BASE}/recommend/collaborative?user_id=${userId}&top_n=${collabTopN}`);
//   const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&n=24`);
// const res  =    await fetch(`${API_BASE}/train/content`, { method: "POST" });
//   const res =  await fetch(`${API_BASE}/train/collaborative`, { method: "POST" });

import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import './index.css'

export default function App() {
  return (
   <>
     <Header />
     <Outlet />
   </>
  )
}
