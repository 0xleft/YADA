import React from "react";
import { useState } from "react";
import Popup from "../../common/Popup";

const StudentHome = () => {

    // TODO
    // fetch attendance data from backend
    // data will only include problematic days (days with attendance < 100%)

    const attendanceData = [
        {
            month: 3,
            day: 10,
            problems: [
                "German",
            ]
        },
        {
            month: 2,
            day: 1,
            problems: [
                "German",
                "Math",
            ]
        },
    ]


    // TODO
    // fetch assigned tasks from backend by student classes only incldue tasks from last 14 days
    const asignedTasks = [
        {
            subject: "Math",
            title: "Math homework",
            // ungraded task
        },
        {
            subject: "German",
            title: "German homework",
            grade: 10
        },
        {
            subject: "German",
            title: "German homework",
            grade: 7,
        }
    ]

    const [popupContent, setPopupContent] = useState(<></>);
    const [popup, setPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");

    const togglePopup = (title, content) => {
        setPopupContent(content);
        setPopupTitle(title);
        setPopup(!popup);
    }

    const monthToName = {
        1: "January",
        2: "Febuary",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July ",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "Decemeber",
    }

    return (
        <>
            {popup ? <Popup title={popupTitle} children={popupContent} close={togglePopup} /> : undefined}

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Asigned tasks</h1>
                        
                        {asignedTasks.map((task) => {
                            return (
                                <div className="flex flex-col shadow-md w-full overflow-auto p-5" key={task.title}>
                                    <div className="flex flex-row items-center pl-4 pr-4">
                                        <h1 className="ml-4 text-xl w-full">{task.title}</h1>
                                        <h1 className="ml-4 text-xl w-full">{task.subject}</h1>
                                        <h1 className="ml-4 text-xl w-full">{task.grade ? "graded" : "ungraded"}</h1>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4">Attendance</h1>
                        {/* create a table where each row is a month where normal days are gray and days with problem are red color 10x10 px size*/}
                        {/* include a scale of days at the top and months on the left */}
                        {/* when click on day show a popup with the problem */}

                        {/* border solid black */}
                        <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2">
                            {Array(12).fill(0).map((_, month) => {
                                return (
                                    <div className="flex flex-row h-10 mt-1 shadow-sm items-center" key={month}>
                                        <h1 className="w-0 z-10">{monthToName[month+1]}</h1>
                                        {Array(31).fill(0).map((_, day) => {
                                            return (
                                                <div className="flex flex-col w-10 h-10 shadow-sm" key={day}>
                                                    {attendanceData.map((data) => {
                                                        if (data.month === month+1 && data.day === day+1) {
                                                            return (
                                                                <div className="flex flex-col w-10 h-10" key={day}>
                                                                    <div className="flex flex-row w-10 h-10" onClick={() => togglePopup("Missing attendance", <div className="flex flex-col items-center">
                                                                        {data.problems.map((problem) => {
                                                                            return (
                                                                                <div className="flex flex-col shadow-md w-full overflow-auto" key={problem}>
                                                                                    <div className="flex flex-row items-center pl-4 pr-4">
                                                                                        <h1 className="ml-4 text-xl w-full">{problem}</h1>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )}
                                                                    </div>)}>
                                                                        <div className="flex flex-col w-10 h-10 bg-red-300"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentHome;