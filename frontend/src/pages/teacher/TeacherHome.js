import React from "react";
import { useState } from "react";
import Popup from "../../common/Popup";

const TeacherHome = () => {

    // TODO
    // fetch current lesson info
    const response = {room: "D504", timeLeft: 45, subject: "Math", students: 20}

    const takeAttendanceCurrent = () => {
        // TODO
        togglePopup()
        // toggle the popup for taking attendence
    }

    // TODO
    // fetch schedule
    const schedule = [
        {
            day: "Monday",
            lessons: [
                {room: "D504", time: "8:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "9:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "10:00", length: 45, subject: "Math", students: 20, current: true},
            ],
        },
        {
            day: "Tuesday",
            lessons: [
                {room: "D504", time: "8:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "9:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "10:00", length: 45, subject: "Math", students: 20},
            ]
        },
        {
            day: "Wednesday",
            lessons: [
                {room: "D504", time: "8:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "9:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "10:00", length: 45, subject: "Math", students: 20},
            ]
        },
        {
            day: "Thursday",
            lessons: [
                {room: "D504", time: "8:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "10:00", length: 45, subject: "Music", students: 20},
            ]
        },
        {
            day: "Friday",
            lessons: [
                {room: "D504", time: "8:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "9:00", length: 45, subject: "Math", students: 20},
                {room: "D504", time: "12:00", length: 45, subject: "Math", students: 20},
            ]
        }
    ]

    const students = [
        {name: "John Doe", present: true},
        {name: "Left Mojoe", present: true},
        {name: "Bob Joe", present: true},
        {name: "Sim Bobaguard", present: true},
    ]

    const [popupToggled, setPopupToggled] = useState(false)

    const togglePopup = () => {
        setPopupToggled(!popupToggled)
    }

    const [attendance, setAttendance] = useState(students)

    const changeAttendance = (index, present) => {
        let newAttendance = [...attendance]
        newAttendance[index].present = present
        setAttendance(newAttendance)
    }

    const submitAttendance = () => {
        // TODO
        // send attendance to backend
        togglePopup()
    }

    return (
        <>
          {popupToggled ? (
            <>
              <Popup title="Attendance" close={togglePopup}>
                <div className="flex flex-row">
                  <button onClick={submitAttendance} className="w-1/2 m-4 shadow-md h-10 mt-12">Save</button>
                  <button onClick={togglePopup} className="w-1/2 m-4 shadow-md h-10 mt-12">Discard</button>
                </div>
                <div className="flex flex-col items-center">
                    {attendance.map((student, index) => {
                      return (
                        <>
                          
                          <div className="flex flex-col shadow-md w-full overflow-auto">
                            <div className="flex flex-row items-center pl-4 pr-4">
                              <img src="../../../unknown_icon.svg" className="w-10 h-10" />
                              <h1 className="ml-4 text-xl w-full">{student.name}</h1>
                              <button onClick={() => changeAttendance(index, true)} className="w-1/2 m-4 shadow-md h-10 mt-12">Present</button>
                              <button onClick={() => changeAttendance(index, false)} className="w-1/2 m-4 shadow-md h-10 mt-12">Absent</button>
                            </div>
                          </div>
                        </>
                      )
                    })}
                </div>
              </Popup>
            </>
          ) : null}

          <div className="flex flex-col items-center mt-10" id="NewRootRoot">
              <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                  <div className="flex flex-col w-full">
                      <h1 className="text-2xl pt-4">Current lesson</h1>
                      <div className="pl-28 pt-4 flex flex-col">
                          <h1>Room: {response.room}</h1>
                          <h1>Time left: {response.timeLeft}</h1>
                          <h1>Subject: {response.subject}</h1>
                          <h1>Students: {response.students}</h1>
                      </div>
                  </div>
                  <div className="flex justify-center items-center w-full h-full">
                      <button onClick={takeAttendanceCurrent} className="w-1/2 shadow-md h-10 mt-12">Attendance</button>
                  </div>
              </div>
          </div>
        
          <div className="flex flex-col items-center mt-10" id="NewRootRoot">
              <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                  <div className="flex flex-col w-full">
                      <h1 className="text-2xl pt-4 mb-10">Schedule</h1>
                      <div className="flex-1 grid grid-cols-5">
                          {schedule.map((day) => {

                              return (
                                <>
                                  <div className="flex flex-col items-center" key={day.day}>
                                      <h1 className="text-xl mb-10">{day.day}</h1>
                                      {day.lessons.map((lesson) => {
                                        return (
                                          <>
                                            {/* one hour is h-screen/9 place the lesson in the correct place */}
                                            <div className={`border-1 shadow-md w-4/5 flex flex-col m-2 ${
                                              lesson.current ? "bg-secondary" : ""
                                            }`} key={`${lesson.time}-${lesson.room}`}>
                                              <h1>{lesson.time}</h1>
                                              <h1>{lesson.subject}</h1>
                                              <h1>{lesson.room}</h1>
                                            </div>
                                          </>
                                        )
                                      })}
                                  </div>
                                </>
                              )
                          })}
                      </div>
                  </div>
              </div>
          </div>
        </>
    )
}

export default TeacherHome;