import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Changepwd = () => {
    const navigate = useNavigate();

    const changepwd = () => {
        const old_password = document.getElementById("old_password").value;
        const new_password = document.getElementById("new_password").value;

        if (old_password === "" || new_password === "") {
            return;
        }

        axios.post("/api/auth/change_password", {
            old_password: old_password,
            new_password: new_password
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
        }).catch((error) => {
            console.log("error");
            return;
        });

        navigate("/login");
    };

    return (
        <>
            <div className="flex flex-col w-ful;;" id="NewRootRoot">
                <div className="bg-lisecondary flex flex-col gap-6 h-[1165px] shrink-0 items-center pt-16">
                    <div className="flex flex-col gap-1 w-1/2 items-center">
                        <div className="text-4xl font-['Inter']">Change password</div>
                        <div className="shadow-md self-stretch flex flex-col justify-end gap-2 pt-8 pb-5 px-6">
                            <div className="flex flex-col ml-px items-start">
                                <input id="old_password" className="shadow-md self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] ml-2">
                                    old password
                                </div>
                            </div>
                            <div className="flex flex-col ml-px items-start">
                                <input id="new_password" className="shadow-md self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] ml-2">
                                    new password
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-md self-end flex flex-col mr-px h-12 shrink-0 items-start pt-2 pb-3 pl-4">
                            <button onClick={changepwd} className="text-xl font-['Inter'] mr-16">Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Changepwd;