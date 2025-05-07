import React from "react";

function ButtonLarge({ content }) {
    return (
        <button  className="bg-[#00acc1] hover:bg-[#00acc1] text-white font-bold py-2 px-14 rounded-lg shadow-lg cursor-pointer" >
            {content}
        </button>
    );
}

export default ButtonLarge;