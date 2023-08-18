import { Routes, Route, Outlet, Link } from "react-router-dom";
import NoMatch from "./common/404";
import { useLocation } from 'react-router-dom';
import Header from "./components/Header";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
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

  // if not logged in, redirect to login page

  return (
    <>
      {!isNonHeaderPage && <Header auth_level={"student"} username={"Margie Simpson"} />}
      <Outlet />
    </>
  );
}

export default App;