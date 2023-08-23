import React, { useEffect, useState } from "react";
import Popup from "../../common/Popup";
import axios from "axios";

const AdminUsers = () => {

    const uploadData = () => {
        // upload user data to server
        // it must a csv file
    }

    const downloadData = () => {
        // redirect to download page
        open("/api/users/download_user_stucture", "_blank")
    }

    const [users, setUsers] = useState([]);

    const deleteUser = (id) => {
        axios.post("/api/users/remove_user", {
            userid: id
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            const newUsers = users.filter((user) => {
                return user.userid !== id
            })
            setUsers(newUsers)
        }).catch((error) => {
            console.log("error");
            return;
        });
    }

    const search = () => {
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
                        <h1 className="text-2xl pt-4 mb-4">Users</h1>
                        <button className="w-1/2 shadow-md h-10 mt-12 mb-10 ml-4" onClick={() => {
                            togglePopup("Create user", (
                                <>
                                    <input className="shadow-md h-10 bg-white mb-4 w-full" placeholder="User name" id="namesurname" />
                                    <select className="shadow-md h-10 bg-white mb-4 w-full" id="authLevel">
                                        <option value={0} key={0}>Student</option>
                                        <option value={1} key={1}>Teacher</option>
                                    </select>
                                    <button className="shadow-md h-10 w-full" onClick={() => {
                                        const namesurname = document.getElementById("namesurname").value;
                                        const authLevel = document.getElementById("authLevel").value;

                                        axios.post("/api/users/create_user", {
                                            namesurname: namesurname,
                                            auth_level: authLevel
                                        }).then((response) => {
                                            if (response.status !== 200) {
                                                return;
                                            }
                                        
                                            setUsers([...users, {namesurname: response.data.namesurename, auth_level: response.data.auth_level, id: response.data.userid, username: response.data.username}]);
                                            setPopup(false);
                                        }).catch((error) => {
                                            console.log("error");
                                            return;
                                        });

                                    }}>Create</button>
                                </>
                            ))
                        }}>Create user
                        </button>

                        <div className="flex flex-col w-full">
                        <div className="flex flex-row first:ml-4 last:mr-10">
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Name" id="searchName" onChange={search} />
                                    <select className="shadow-md h-10 bg-primary w-full" id="searchAuthLevel">
                                        <option value={0} key={0}>Students</option>
                                        <option value={1} key={1}>Teachers</option>
                                    </select>
                                    <button className="shadow-md h-10 w-full" onClick={search}>Search</button>
                                </div>
                            <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2 min-h-screen">
                                {users.map((user) => {
                                    return (
                                        <div className="flex flex-row h-14 shadow-sm items-center mt-3" key={user.userid}>
                                            <div className="ml-10 flex flex-col w-full items-center">
                                                <h1 className="w-full">{user.namesurname}</h1>
                                                <h3 className="w-full">{user.username}</h3>
                                            </div>
                                            <h3 className="w-full">{user.auth_level}</h3>
                                            <button className="w-1/2 m-4 shadow-md h-10 ml-auto" onClick={deleteUser.bind(null, user.userid)}>Delete</button>
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

export default AdminUsers;