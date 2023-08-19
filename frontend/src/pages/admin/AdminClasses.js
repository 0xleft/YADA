import React from "react";
import { useState } from "react";
import Popup from "../../common/Popup";

const AdminClasses = () => {
    const uploadData = () => {
        // upload class data to server 
        // it must a csv file
    }

    const downloadData = () => {
        // fetch class data from server
    }

    // TODO
    // fetch classes from server
    const [classes, setClasses] = useState([
        {
            name: "S4ENA",
            year: 12,
            id: 1
        },
        {
            name: "S3ENB",
            year: 4,
            id: 2
        },
    ]);

    const deleteClass = (id) => {
        // TODO
        // delete class from server
        const newClasses = classes.filter((clas) => {
            return clas.id !== id
        })
        setClasses(newClasses)
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
                        <h1 className="text-2xl pt-4 mb-4">Data managment</h1>
                        <div className="flex flex-row w-full">
                            <button className="w-1/2 shadow-md h-10 mt-12" onClick={uploadData}>Upload data</button>
                            <button className="w-1/2 shadow-md h-10 mt-12" onClick={downloadData}>Download data</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10" id="NewRootRoot">
                <div className="shadow-md bg-primary flex flex-row justify-between items-center pb-8 pl-12 pr-16 w-4/5">
                    <div className="flex flex-col w-full">
                        <h1 className="text-2xl pt-4 mb-4">Classes</h1>
                        {/* a name and class input fields and search button on the right */}
                        {/* table is only rendered when a search is executed */}

                        <button className="w-1/2 shadow-md h-10 mt-12 mb-10 ml-4" onClick={() => {
                            togglePopup("Create class", (
                                <>
                                    <input className="shadow-md h-10 bg-white mb-4 w-full" placeholder="Class Name" id="className" />
                                    <input className="shadow-md h-10 bg-white mb-4 w-full" placeholder="Year" id="classYear" />
                                    <button className="shadow-md h-10 w-full" onClick={() => {
                                        const className = document.getElementById("className").value;
                                        const classYear = document.getElementById("classYear").value;

                                        // TODO
                                        // submit class to server server responds with the id of the class
                                        setClasses([...classes, {name: className, year: classYear, id: 3}])
                                        setPopup(false);
                                    }}>Create</button>
                                </>
                            ))
                        }}>Create class
                        </button>
                        
                        <div className="flex flex-col w-full">
                        <div className="flex flex-row first:ml-4 last:mr-10">
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Class Name" id="searchName" />
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Year" id="searchYear" />
                                    <button className="shadow-md h-10 w-full" onClick={() => {
                                        const searchName = document.getElementById("searchName").value;
                                        const searchYear = document.getElementById("searchYear").value;

                                        // TODO
                                        // fetch users from server

                                        // setClasses(classes)
                                    }}>Search</button>
                                </div>
                            <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2 min-h-screen">
                                {classes.map((clas) => {
                                    return (
                                        <div className="flex flex-row h-10 shadow-sm items-center mt-3" key={clas.name}>
                                            <h1 className="ml-10 w-full">{clas.name}</h1>
                                            <h1 className="w-full">{clas.year}</h1>
                                            <button className="w-1/2 m-4 shadow-md h-10 ml-auto" onClick={deleteClass.bind(null, clas.id)}>Delete</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminClasses;