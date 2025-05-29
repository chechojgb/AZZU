function ButtonPurple({ content, onClick }) {
    return (
        <button
            onClick={onClick} // ← esto lo hace funcional
            className="text-sm font-medium text-purple-light-20 hover:underline dark:text-cyan-400 cursor-pointer"
        >
            {content}
        </button>
    );
}

export default ButtonPurple;