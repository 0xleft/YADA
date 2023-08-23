import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import Popup from '../../common/Popup';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StudentGrades = () => {

    // TODO
    // fetch last graded tasks from backend by student classes only incldue tasks from last 14 days

    const gradedTasks = [
        {
            subject: "Math",
            title: "Math homework",
            grade: 10
        },
        {
            subject: "German",
            title: "German homework",
            grade: 7,
        }
    ]

    // TODO
    // fetch summary info from the backend

    const summary = {
        average: 8.5,
        classRank: 2,
        classSize: 20,
        classAverage: 7.5,
            averageGradeHistory: [
                10,
                9.5,
                8.5,
                7.4,
                6.5,
                8.7,
                9.3,
                10,
                10
            ]
    }

    // This is so stupid
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
        12: "December",
    }

    const [popupContent, setPopupContent] = useState(<></>);
    const [popup, setPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");

    const togglePopup = (title, content) => {
        setPopupContent(content);
        setPopupTitle(title);
        setPopup(!popup);
    }

    return (
        <>
            {popup ? <Popup title={popupTitle} children={popupContent} close={togglePopup} /> : undefined}

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Latest results</h1>
                        <div>
                            {gradedTasks.map((task) => {
                                return (
                                    <div className="shadow-md p-4 flex flex-row justify-between" key={task.title}>
                                        <div className="flex flex-col ml-10">
                                            <h2 className="text-xl">{task.subject}</h2>
                                            <p className="text-2xl">{task.title}</p>
                                        </div>
                                        <div className="flex flex-col mr-10">
                                            <h2 className="text-xl">Grade</h2>
                                            <p className="text-2xl">{task.grade}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Summary</h1>
                        <div className="shadow-md p-4">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col">
                                    <h2 className="text-xl">Average</h2>
                                    <p className="text-2xl">{summary.average}</p>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl">Class rank</h2>
                                    <p className="text-2xl">{summary.classRank}/{summary.classSize}</p>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl">Class average</h2>
                                    <p className="text-2xl">{summary.classAverage}</p>
                                </div>
                            </div>

                            {/* GRAPH */}
                            <Line className="mt-10" data={
                                {
                                    datasets: [
                                        {
                                          label: 'Grade',
                                          data: summary.averageGradeHistory,
                                          borderColor: 'rgb(255, 99, 132)',
                                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        },
                                    ],
                                    labels: Array.from(Array(summary.averageGradeHistory.length).keys()).map((i) => monthToName[i + 1]),
                                }
                            } options={
                                {
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: false,
                                            text: 'Grades average over time',
                                        },
                                    }
                                }
                            } />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentGrades;