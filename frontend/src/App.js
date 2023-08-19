import { Routes, Route, Outlet, Link } from "react-router-dom";
import NoMatch from "./common/404";
import { useLocation } from 'react-router-dom';
import Header from "./components/Header";
import Login from "./pages/Login";
import Changepwd from "./pages/Changepwd";
import StudentHome from "./pages/student/StudentHome";
import StudentGrades from "./pages/student/StudentGrades";
import StudentActivities from "./pages/student/StudentActivities";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherGrades from "./pages/teacher/TeacherGrades";
import TeacherActivities from "./pages/teacher/TeahcerActivities";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClasses from "./pages/admin/AdminClasses";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="changepwd" element={<Changepwd />} />

        {/* student */}
        <Route path="student">
          <Route path="" element={<StudentHome />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="activities" element={<StudentActivities />} />
          <Route path="*" element={<NoMatch />} />
        </Route>

        {/* teacher */}
        <Route path="teacher">
          <Route path="" element={<TeacherHome />} />
          <Route path="grades" element={<TeacherGrades />} />
          <Route path="activities" element={<TeacherActivities />} />
          <Route path="*" element={<NoMatch />} />
        </Route>

        {/* admin */}
        <Route path="admin">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
        
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

function Layout() {
  const location = useLocation();

  const nonHeaderPages = [
    '/login',
    '/changepwd'
  ];
  const isNonHeaderPage = nonHeaderPages.includes(location.pathname);

  // fetch user data from backend here
  // redirect to acording page like teacher or student or admin

  // if not logged in, redirect to login page

  return (
    <>
      {/* TESTING ONLY TODO REMOVE */}
      {!isNonHeaderPage && <Header auth_level={"teacher"} username={"Margie Simpson"} />}
      <Outlet />
    </>
  );
}

export default App;