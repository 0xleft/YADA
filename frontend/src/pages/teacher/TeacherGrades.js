import React from "react";
import { useState } from "react";
import Popup from "../../common/Popup";

const TeacherGrades = () => {

    // TODO fetch tasks
    const fetchedTasks = [
        {name: "Task 1", class: "S2G1", subject: "Math", published: false, id: 1},
        {name: "Task 2", class: "S2G1", subject: "Math", published: true, id: 2},
        {name: "Task 3", class: "S2G1", subject: "Math", published: false, id: 3},
        {name: "Task 4", class: "S2G1", subject: "Math", published: true, id: 4},
        {name: "Task 5", class: "S2G1", subject: "Math", published: false, id: 5},
        {name: "Task 6", class: "S2G1", subject: "Math", published: true, id: 6},
    ]

    const [tasks, setTasks] = useState(fetchedTasks);

    const [popupContent, setPopupContent] = useState(<></>);

    const [popup, setPopup] = useState(false);

    const [popupTitle, setPopupTitle] = useState("");

    const togglePopup = (title, content) => {
        setPopupContent(content);
        setPopupTitle(title);
        setPopup(!popup);
    }

    // TODO
    // fetch classes for the teacher to choose when creating
    const classes = [
        {name: "S2G1"},
        {name: "S2G2"},
        {name: "S2G3"},
        {name: "S2G4"},
    ]

    // TODO
    // fetch subjects for the teacher to choose when creating
    const subjects = [
        {name: "Math"},
        {name: "English"}        
    ]

    // TODO
    // submit grades to backend
    const submitGrades = (taskId, studentGrades) => {
        // TODO
        // send grades to backend
        setPopup(false);
    }

    const publishGrades = (taskId) => {
        submitGrades(taskId, tasks.find((task) => task.id === taskId).students);

        const newTasks = tasks.map((task) => {
            if (task.id === taskId) {
                task.published = true;
            }
            return task;
        })
        setTasks(newTasks);
        setPopup(false)
    }

    const unpublishGrades = (taskId) => {
        // TODO
        // mark task as unpublished
        const newTasks = tasks.map((task) => {
            if (task.id === taskId) {
                task.published = false;
            }
            return task;
        })
        setTasks(newTasks);
        setPopup(false)
    }

    const deleteTask = (taskId) => {
        // TODO
        // delete task from backend
        const newTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(newTasks);
        setPopup(false);
    }

    const createTask = () => {
        // TODO
        // send task to backend
        // the backend should send the id of the task back

        const taskName = document.getElementById("taskTitle").value;
        const taskClass = document.getElementById("taskClass").value;
        const taskSubject = document.getElementById("taskSubject").value;

        const newTasks = [...tasks, {name: taskName, class: taskClass, subject: taskSubject, published: false, id: 99}];
        setTasks(newTasks);
        setPopup(false);
    }

    return (
        <>
            {popup ? <Popup title={popupTitle} children={popupContent} close={togglePopup} /> : undefined}

            {/* UNGRADED TASKS */}

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4">Ungraded tasks</h1>
                        <button className="shadow-md p-3 mt-10 w-2/5" onClick={
                            () => {
                                togglePopup("Create new task", (
                                    <>
                                        <div className="flex flex-col w-full mt-10">
                                            <div className="flex flex-col ml-px items-start">
                                                <div className="text-xs font-['Inter'] text-[#646464] ml-2">
                                                    Task title
                                                </div>
                                                <input id="taskTitle" className="shadow-md self-stretch h-10 shrink-0 pl-3" placeholder="Example test" require={true} />
                                                <div className="text-xs font-['Inter'] text-[#646464] ml-2 mt-4">
                                                    Class
                                                </div>
                                                <select id="taskClass" className="shadow-md self-stretch h-10 shrink-0 pl-3" require={true}>
                                                    {classes.map((classObj) => (
                                                        <option key={classObj.name} value={classObj.name}>{classObj.name}</option>
                                                    ))}
                                                </select>
                                                <div className="text-xs font-['Inter'] text-[#646464] ml-2 mt-4">
                                                    Subject
                                                </div>
                                                <select id="taskSubject" className="shadow-md self-stretch h-10 shrink-0 pl-3" require={true}>
                                                    {subjects.map((subject) => (
                                                        <option key={subject.name} value={subject.name}>{subject.name}</option>
                                                    ))}
                                                </select>

                                                <button className="shadow-md p-3 mt-10 w-2/5" onClick={createTask}>Create task</button>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                        }>Create new task</button>
                            <div className="flex flex-col w-full">
                            {tasks.filter((task) => !task.published).map((task) => {
                                return (
                                    <div className="flex flex-row items-center shadow-md mt-5 p-4 w-full" key={task.name}>
                                        <h1 className="mr-10">Name: {task.name}</h1>
                                        <h1 className="mr-10">Class: {task.class}</h1>
                                        <h1 className="mr-10">Subject: {task.subject}</h1>
                                        <button className="ml-auto w-1/5 shadow-md p-3" onClick={
                                            () => {
                                                const taskId = task.id;

                                                // TODO 
                                                // fetch class for task for grading and for info before opening popup
                                                
                                                const taskInfo = {
                                                    id: task.id,
                                                    name: "Task 1",
                                                    class: "S2G1",
                                                    subject: "Math",
                                                    published: false,
                                                    students: [
                                                        {name: "John Doe", grade: 10},
                                                        {name: "Jane Doe", grade: 9},
                                                        {name: "John Smith", grade: 8},
                                                        {name: "Jane Smith", grade: 7},
                                                    ]
                                                }

                                                togglePopup(`Grading ${task.name}`, (
                                                    <>
                                                        <div className="flex flex-col w-full">
                                                            {/* button to save grade and a button to post grades */}
                                                            <div className="flex flex-row">
                                                                <button className="shadow-md p-3 mt-10 w-2/5" onClick={submitGrades.bind(null, taskInfo.students)}>Save grades</button>
                                                                <button className="shadow-md p-3 mt-10 w-2/5" onClick={publishGrades.bind(null, taskId)}>Publish grades</button>
                                                            </div>
                                                            {taskInfo.students.map((student, index) => (
                                                                <div className="flex flex-col shadow-md w-full overflow-auto" key={student.name}>
                                                                <div className="flex flex-row items-center pl-4 pr-4 p-4">
                                                                  <img src="../../../unknown_icon.svg" className="w-10 h-10" />
                                                                  <h1 className="ml-4 text-xl w-full">{student.name}</h1>
                                                                  <input type="number" max={10} min={0} className="w-1/5 shadow-md p-3" defaultValue={taskInfo.students[index].grade} onChange={(e) => taskInfo.students[index].grade = e.target.value} />
                                                                </div>
                                                              </div>
                                                            ))}
                                                            <button className="shadow-md p-3 mt-10 w-2/5" onClick={deleteTask.bind(null, taskId)}>Delete grades</button>
                                                        </div>
                                                    </>
                                                ))
                                            }
                                        }>Grade</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* GRADED TASKS */}

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4">Graded tasks</h1>
                            <div className="flex flex-col w-full">
                            {tasks.filter((task) => task.published).map((task) => {
                                return (
                                    <div className="flex flex-row items-center shadow-md mt-5 p-4 w-full" key={task.name}>
                                        <h1 className="mr-10">Name: {task.name}</h1>
                                        <h1 className="mr-10">Class: {task.class}</h1>
                                        <h1 className="mr-10">Subject: {task.subject}</h1>
                                        <button className="ml-auto w-1/5 shadow-md p-3" onClick={
                                            () => {
                                                const taskId = task.id;

                                                // TODO 
                                                // fetch class for task for grading and for info before opening popup
                                                const taskInfo = {
                                                    id: 10,
                                                    name: "Task 1",
                                                    class: "S2G1",
                                                    subject: "Math",
                                                    published: false,
                                                    students: [
                                                        {name: "John Doe", grade: 10},
                                                        {name: "Jane Doe", grade: 9},
                                                        {name: "John Smith", grade: 8},
                                                        {name: "Jane Smith", grade: 7},
                                                    ]
                                                }

                                                togglePopup(`Viewing ${task.name}`, (
                                                    <>
                                                        <div className="flex flex-col w-full">
                                                            {/* button to save grade and a button to post grades */}
                                                            <div className="flex flex-row">
                                                                <button className="shadow-md p-3 mt-10 w-2/5" onClick={unpublishGrades.bind(null, taskId)}>Unpublish grades</button>
                                                            </div>
                                                            {taskInfo.students.map((student, index) => (
                                                                <div className="flex flex-col shadow-md w-full overflow-auto" key={student.name}>
                                                                <div className="flex flex-row items-center pl-4 pr-4 p-4">
                                                                  <img src="../../../unknown_icon.svg" className="w-10 h-10" />
                                                                  <h1 className="ml-4 text-xl w-full">{student.name}</h1>
                                                                  <input type="number" max={10} min={0} className="w-1/5 shadow-md p-3" value={taskInfo.students[index].grade} readOnly={true} />
                                                                </div>
                                                              </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                ))
                                            }
                                        }>Info</button>
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

export default TeacherGrades;