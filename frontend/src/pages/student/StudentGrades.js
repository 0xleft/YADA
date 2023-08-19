import React from "react";
import { Chart, AxisOptions } from 'react-charts';

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
                10
            ]
    }

    return (
        <>
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
                            <Chart data={{
                                labels: summary.averageGradeHistory.map((_, index) => `Semester ${index + 1}`),
                                datasets: [
                                    {
                                        label: 'Average Grade History',
                                        data: summary.averageGradeHistory,
                                        fill: false,
                                        borderColor: 'rgba(75,192,192,1)',
                                    },
                                ],
                            }} options={
                                {
                                    primaryAxis: {
                                        type: 'linear',
                                        position: 'bottom'
                                    },
                                    secondaryAxis: {
                                        type: 'linear',
                                        position: 'left'
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