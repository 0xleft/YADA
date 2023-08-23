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
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
          <Route path="" element={<AdminDashboard />} />
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
  const navigate = useNavigate();
  const location = useLocation();

  const nonHeaderPages = [
    '/login',
    '/changepwd'
  ];
  const isNonHeaderPage = nonHeaderPages.includes(location.pathname);

  const [user, setUser] = useState(null);
  const [authLevel, setAuthLevel] = useState(null);

  useEffect(() => {
    if (isNonHeaderPage) {
      return;
    }

    axios.get("http://localhost/api/auth/get_user_info").then((response) => {
      if (response.status !== 200) {
        navigate("/login");
        return;
      }
    }).catch((error) => {
      console.log("error");
      navigate("/login");
      return;
    });

    if (localStorage.getItem("namesurname") === null) {
      navigate("/login");
      return;
    }

    if (localStorage.getItem("type") === null) {
      navigate("/login");
      return;
    }

    if (location.pathname === "/") {
      navigate("/" + localStorage.getItem("type"));
      return;
    }

    setUser(localStorage.getItem("namesurname"));
    setAuthLevel(localStorage.getItem("type"));
  }, [location]);

  return (
    <>
      {!isNonHeaderPage && <Header username={user} auth_level={authLevel} />}
      <Outlet />
    </>
  );
}

export default App;