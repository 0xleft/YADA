import React from "react";

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    return (
        <>
            <div className={"flex justify-center items-center h-12 bg-" + type + " text-white text-xl font-['Inter']"}>
                {message}
            </div>
        </>
    )
}