import React from "react";

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    setTimeout(() => {
        message = null
    }, 5000)

    return (
        <>
            <div className={"flex justify-center items-center h-12 bg-" + type + " text-white text-xl font-['Inter']"}>
                {message}
            </div>
        </>
    )
}