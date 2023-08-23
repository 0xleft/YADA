import React, { useEffect } from 'react';
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
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {

    const [analytics, setAnalytics] = useState({
        successLogins: 0,
        failLogins: 0,
        createdTasks: 0,
        serverLoad: Array(24).fill(0)
    });

    useEffect(() => {
        axios.get("/api/admin/summary").then((response) => {
            if (response.status !== 200) {
                return;
            }
            setAnalytics(response.data);
        }).catch((error) => {
            console.log("error");
            return;
        });
    }, []);

    // todo fetch quick action statuses
    const quickActions = {
        nonAdminLogins: true,
        maintenanceMode: false
    }

    const [quickActionsState, setQuickActionsState] = useState(quickActions);

    const toggleQuickAction = (action) => {
        // TODO
        // send request to backend to toggle the action
        setQuickActionsState({ ...quickActionsState, [action]: !quickActionsState[action] })
    }

    return (
        <>
            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Latest results</h1>
                        <div className="shadow-md p-4">
                            <div className="flex flex-row">
                                <div className="flex flex-col gap-10 w-max mr-20 mt-5">
                                    <div className="flex flex-col w-max">
                                        <h2 className="text-xl">Successful logins</h2>
                                        <p className="text-2xl">{analytics.successLogins}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl">Failed logins</h2>
                                        <p className="text-2xl">{analytics.failLogins}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl">Created tasks</h2>
                                        <p className="text-2xl">{analytics.createdTasks}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl"> tasks</h2>
                                        <p className="text-2xl">{analytics.createdTasks}</p>
                                    </div>
                                </div>

                                {/* GRAPH make it fit */}
                                <div className="flex flex-col w-full">
                                    <Line data={
                                        {
                                            datasets: [
                                                {
                                                    label: 'Server load',
                                                    data: analytics.serverLoad,
                                                    borderColor: 'rgb(255, 99, 132)',
                                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                },
                                            ],
                                            labels: Array(24).fill(0).map((_, i) => i + ":00")
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
                </div>
            </div>

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Quick actions</h1>
                        <div className="shadow-md p-4">
                            <div className="flex flex-row">
                                <div className="flex flex-col gap-10 mr-20 mt-5 h-max">
                                    <div className="flex flex-row items-center">
                                        <div className="flex flex-col w-max">
                                            <h2 className="text-xl w-max">Non-admin logins</h2>
                                            <p className="text-2xl">{quickActionsState.nonAdminLogins ? "Enabled" : "Disabled"}</p>
                                        </div>
                                        <button onClick={() => toggleQuickAction("nonAdminLogins")} className="w-1/2 m-4 shadow-md h-10">Toggle non admin logins</button>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col w-max">
                                            <h2 className="text-xl w-max">Maintenance mode</h2>
                                            <p className="text-2xl">{quickActionsState.maintenanceMode ? "Enabled" : "Disabled"}</p>
                                        </div>
                                        <button onClick={() => toggleQuickAction("maintenanceMode")} className="w-1/2 m-4 shadow-md h-10">Toggle maintenance mode</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;