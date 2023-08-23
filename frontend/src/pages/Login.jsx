import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();

    const login = () => {
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        axios.post("/api/auth/login", {
            username: username,
            password: password
        }).then((response) => {

            if (response.status !== 200) {
                localStorage.setItem("namesurname", "");
                localStorage.setItem("type", "");
                return;
            }

            const data = response.data;
            localStorage.setItem("namesurname", data.namesurname);
            localStorage.setItem("type", data.auth_level);

            navigate("/" + data.auth_level);
        }).catch((error) => {
            console.log("error");
        });
    };

    return (
        <>
            <div className="flex flex-col w-full" id="NewRootRoot">
                <div className="bg-[#d9d9d9] flex flex-col gap-6 h-[1165px] shrink-0 items-center pt-16 shadow-md">
                    <div className="flex flex-col gap-1 w-1/2 items-center">
                        <div className="text-4xl font-['Inter']">Please login</div>
                        <div className="shadow-md self-stretch flex flex-col justify-end gap-2 h-48 shrink-0 px-6 py-3">
                            <div className="flex flex-col ml-px items-start">
                                <input id="username" className="shadow-md self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] ml-2">
                                    username
                                </div>
                            </div>
                            <div className="flex flex-col ml-px items-start">
                                <input id="password" className="shadow-md self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] ml-2">
                                    password
                                </div>
                            </div>
                        </div>
                        <div className="shadow-md bg-white self-end flex flex-col mr-px h-12 shrink-0 items-start pt-3 pb-10 pl-4 pr-4">
                            <button onClick={login} className="text-xl font-['Inter']">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;