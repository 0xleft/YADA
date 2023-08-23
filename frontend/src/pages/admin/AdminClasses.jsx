import React, { useEffect } from "react";
import { useState } from "react";
import Popup from "../../common/Popup";
import axios from "axios";

const AdminClasses = () => {
    const uploadData = () => {
        // upload class data to server 
        // it must a csv file
    }

    const downloadData = () => {
        open("/api/classes/download_class_stucture", "_blank")
    }

    const [classes, setClasses] = useState([]);

    const deleteClass = (id) => {
        axios.post("/api/classes/remove_class", {
            classid: id
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            const newClasses = classes.filter((clas) => {
                return clas.classid !== id
            })
            setClasses(newClasses)
        }).catch((error) => {
            console.log("error");
            return;
        });
    }

    const search = () => {
        const searchName = document.getElementById("searchName").value;
        const searchYear = document.getElementById("searchYear").value;

        axios.post("/api/search/classes", {
            name: searchName,
            year: searchYear
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            setClasses(response.data)
        }).catch((error) => {
            console.log("error");
            return;
        });
    }

    const [users, setUsers] = useState([]);

    const searchUsers = () => {
        const searchName = document.getElementById("searchName").value;
        const searchAuthLevel = document.getElementById("searchAuthLevel").value;

        axios.post("/api/search/users", {
            name: searchName,
            auth_level: searchAuthLevel
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            setUsers(response.data)
        }).catch((error) => {
            console.log("error");
            return;
        });
    }

    useEffect(() => {
        search();
    }, []);

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

                                        axios.post("/api/classes/create_class", {
                                            name: className,
                                            year: classYear
                                        }).then((response) => {
                                            if (response.status !== 200) {
                                                return;
                                            }
                                        
                                            setClasses([...classes, {name: response.data.name, year: response.data.year, classid: response.data.classid}]);
                                            setPopup(false);
                                        }).catch((error) => {
                                            console.log("error");
                                            return;
                                        });


                                    }}>Create</button>
                                </>
                            ))
                        }}>Create class
                        </button>
                        
                        <div className="flex flex-col w-full">
                        <div className="flex flex-row first:ml-4 last:mr-10">
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Class Name" id="searchName" />
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Year" id="searchYear" />
                                    <button className="shadow-md h-10 w-full" onClick={search}>Search</button>
                                </div>
                            <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2 min-h-screen">
                                {classes.map((clas) => {
                                    return (
                                        <div className="flex flex-row h-10 shadow-sm items-center mt-3" key={clas.classid}>
                                            <h1 className="ml-10 w-full">{clas.name}</h1>
                                            <h1 className="w-full">{clas.year}</h1>
                                            <button className="w-1/2 m-4 shadow-md h-10" onClick={() => {
                                                togglePopup("Edit class members", (
                                                    <>
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex flex-row first:ml-4 last:mr-10">
                                                                <input className="shadow-md h-10 bg-primary w-full" placeholder="Name" id="searchName" />
                                                                <select className="shadow-md h-10 bg-primary w-full" id="searchAuthLevel">
                                                                    <option value={0} key={0}>Students</option>
                                                                    <option value={1} key={1}>Teachers</option>
                                                                </select>
                                                                <button className="shadow-md h-10 w-full" onClick={searchUsers}>Search</button>
                                                            </div>
                                                            <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2 min-h-screen">
                                                                {users.map((user) => {
                                                                    return (
                                                                        <div className="flex flex-row h-10 shadow-sm items-center mt-3" key={user.userid}>
                                                                            <h1 className="ml-10 w-full">{user.name}</h1>
                                                                            <h1 className="w-full">{user.auth_level}</h1>
                                                                            <button className="w-1/2 m-4 shadow-md h-10" onClick={() => {
                                                                                axios.post("/api/classes/add_user_to_class", {
                                                                                    userid: user.userid,
                                                                                    classid: clas.classid
                                                                                }).then((response) => {
                                                                                    if (response.status !== 200) {
                                                                                        return;
                                                                                    }
                                                                                }).catch((error) => {
                                                                                    console.log("error");
                                                                                    return;
                                                                                });
                                                                            }}>Add</button>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                            }}>Edit</button>
                                            <button className="w-1/2 m-4 shadow-md h-10 ml-auto" onClick={deleteClass.bind(null, clas.classid)}>Delete</button>
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