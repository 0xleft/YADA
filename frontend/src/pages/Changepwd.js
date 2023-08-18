import React from "react";
import { useNavigate } from "react-router-dom";

const Changepwd = () => {
    const navigate = useNavigate();

    const changepwd = () => {
        // TODO
        // send change password request
        // if success, navigate to login page
        navigate("/login");
    };

    return (
        <>
            <div className="flex flex-col w-full" id="NewRootRoot">
                <div className="bg-[#d9d9d9] flex flex-col gap-6 h-[1165px] shrink-0 items-center pt-16 shadow-md">
                    <div className="flex flex-col gap-1 w-1/2 items-center">
                        <div className="text-4xl font-['Inter']">Change password</div>
                        <div className="bg-[#b3b3b3] self-stretch flex flex-col justify-end gap-2 pt-8 pb-5 px-6">
                            <div className="flex flex-col ml-px items-start">
                                <input id="username" className="bg-[#d9d9d9] self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] text-[#646464] ml-2">
                                    username
                                </div>
                            </div>
                            <div className="flex flex-col ml-px items-start">
                                <input id="old_password" className="bg-[#d9d9d9] self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] text-[#646464] ml-2">
                                    old password
                                </div>
                            </div>
                            <div className="flex flex-col ml-px items-start">
                                <input id="new_password" className="bg-[#d9d9d9] self-stretch h-10 shrink-0 pl-3" />
                                <div className="text-xl font-['Inter'] text-[#646464] ml-2">
                                    new password
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#b3b3b3] self-end flex flex-col mr-px h-12 shrink-0 items-start pt-2 pb-3 pl-4">
                            <button onClick={changepwd} className="text-xl font-['Inter'] mr-16">Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Changepwd;