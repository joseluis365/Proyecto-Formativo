import { useNavigate } from "react-router-dom";

export default function BackArrow() {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer text-white">
            <span className="material-symbols-outlined text-base">arrow_back_ios</span>
        </button>
    );
}
