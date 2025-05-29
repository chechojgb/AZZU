import React from "react";

function ButtonLarge({ content }) {
    return (
        <button  className="bg-purple-light-20 hover-bg-purple-light-20 text-white font-bold py-2 px-14 rounded shadow-lg cursor-pointer " >
            {content}
        </button>
    );
}

export default ButtonLarge;