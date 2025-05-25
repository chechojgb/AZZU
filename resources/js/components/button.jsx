import React from "react";

function ButtonLarge({ content }) {
    return (
        <button  className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400 cursor-pointer" >
            {content}
        </button>
    );
}

export default ButtonLarge;