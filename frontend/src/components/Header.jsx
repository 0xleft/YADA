import React from "react";
import StudentNav from "./StudentNav";
import AdminNav from "./AdminNav";
import TeacherNav from "./TeacherNav";

const Header = ({ username, auth_level }) => {
    return (
        <>
            <div className="flex flex-col items-center" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="self-end flex flex-row mt-12 gap-8 w-2/3 items-start">
                        {/* this so its accessable from shit */}
                        {window.innerWidth > 690 ? <img src="../../../../../../../unknown_icon.svg" /> : undefined}
                        <div className="flex flex-col mt-10 gap-5 w-1/2 items-start">
                            <div className="text-4xl font-['Inter'] w-max">Welcome back!</div>
                            <div className="self-stretch relative flex flex-col justify-end mr-6 items-start pt-8 px-px">
                                <div className="text-3xl font-['Inter'] text-[#676767] absolute top-0 left-0 h-10 w-max">
                                    {username || "Unknown"}
                                </div>
                                <div className="text-xl font-['Inter'] text-[#676767] relative pl-0">
                                    {auth_level || "Unknown"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12">
                        {auth_level === "student" ? <StudentNav /> : undefined}
                        {auth_level === "teacher" ? <TeacherNav /> : undefined}
                        {auth_level === "admin" ? <AdminNav /> : undefined}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;