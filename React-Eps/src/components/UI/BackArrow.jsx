import { useNavigate } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

export default function BackArrow() {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer text-white">
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: '1.25rem' }} />
        </button>
    );
}
