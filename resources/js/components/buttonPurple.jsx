import { useLoadStatus } from "./context/loadContext";
import { themeByProject } from "./utils/theme";
import { usePage } from "@inertiajs/react";

function ButtonPurple({ content, onClick }) {
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];

    return (
        <button
            onClick={onClick} // ← esto lo hace funcional
            className={`text-sm font-medium ${theme.text}  hover:underline  cursor-pointer`}
        >
            {content}
        </button>
    );
}

export default ButtonPurple;