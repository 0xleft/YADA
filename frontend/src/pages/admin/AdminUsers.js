import React, { useState } from "react";

const AdminUsers = () => {

    const uploadData = () => {
        // upload user data to server 
        // it must a csv file
    }

    const downloadData = () => {
        // fetch user data from server
    }

    const [users, setUsers] = useState([
        {
            name: "John Doe",
            class: "12A",
            id: 1
        },
        {
            name: "John Doe",
            class: "12A",
            id: 2
        },
    ]);

    const deleteUser = (id) => {
        // TODO
        // delete user from server
        const newUsers = users.filter((user) => {
            return user.id !== id
        })
        setUsers(newUsers)
    }

    return (
        <>
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
                        {/* a name and class input fields and search button on the right */}
                        {/* table is only rendered when a search is executed */}

                        <div className="flex flex-col w-full">
                        <div className="flex flex-row first:ml-4 last:mr-10">
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Name" id="searchName" />
                                    <input className="shadow-md h-10 bg-primary w-full" placeholder="Class" id="searchClass" />
                                    <button className="shadow-md h-10 w-full" onClick={() => {
                                        const searchName = document.getElementById("searchName").value;
                                        const searchClass = document.getElementById("searchClass").value;

                                        // TODO
                                        // fetch users from server

                                        // setUsers(users)
                                    }}>Search</button>
                                </div>
                            <div className="border-2 border-secondary shadow-md w-full flex flex-col m-2 min-h-screen">
                                {users.map((user) => {
                                    return (
                                        <div className="flex flex-row h-10 shadow-sm items-center mt-3" key={user.name}>
                                            <h1 className="ml-10 w-full">{user.name}</h1>
                                            <h1 className="w-full">{user.class}</h1>
                                            <button className="w-1/2 m-4 shadow-md h-10 ml-auto" onClick={deleteUser.bind(null, user.id)}>Delete</button>
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