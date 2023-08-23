import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {

    const currentPath = window.location.pathname;

    return (
        <>
            <div className="shadow-lg flex flex-col justify-center pl-3 gap-20 h-56 items-center">
                <div className={"self-start flex flex-col w-32 h-8 shrink-0 items-start pt-1 pb-1 pl-1 " + (currentPath === "/admin/dashboard" ? "" : "shadow-md")}>
                    <Link to="/admin" className="text-xl font-['Inter']">Dashboard</Link>
                </div>
                <div className="flex flex-col mr-3 gap-2 w-32">
                    <div className={"flex flex-col mr-px h-8 shrink-0 items-start pt-1 pb-1 pl-1 " + (currentPath === "/admin/users" ? "" : "shadow-md")}>
                        <Link to="/admin/users" className="text-xl font-['Inter']">Users</Link>
                    </div>
                    <div className={"flex flex-col ml-px h-8 shrink-0 items-start pl-1 py-1 " + (currentPath === "/admin/classes" ? "" : "shadow-md")}>
                        <Link to="/admin/classes" className="text-xl font-['Inter']">Classes</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminNav;