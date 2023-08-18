import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const login = () => {
        
    };

    return (
        <>
            <div className="flex flex-col w-full" id="NewRootRoot">
                <div className="bg-[#d9d9d9] flex flex-col gap-6 h-[1165px] shrink-0 items-center pt-16 shadow-md">
                    <div className="flex flex-col gap-1 w-1/2 items-center">
                        <div className="text-4xl font-['Inter']">Please login</div>
                        <div className="bg-[#b3b3b3] self-stretch flex flex-col justify-end gap-2 h-48 shrink-0 px-6 py-3">
                            <div className="flex flex-col ml-px items-start">
                                <input id="username" className="bg-[#d9d9d9] self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] text-[#646464] ml-2">
                                    username
                                </div>
                            </div>
                            <div className="flex flex-col ml-px items-start">
                                <input id="password" className="bg-[#d9d9d9] self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] text-[#646464] ml-2">
                                    password
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#b3b3b3] self-end flex flex-col mr-px h-12 shrink-0 items-start pt-3 pb-10 pl-4 pr-4">
                            <button onClick={login} className="text-xl font-['Inter']">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;