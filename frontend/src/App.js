import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from "./pages/Home";
import NoMatch from "./pages/404";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
    </Routes> 
  )
}

function Layout() {
  return (
      <Outlet />
  );
}

export default App;