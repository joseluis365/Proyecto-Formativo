import CallRoundedIcon from '@mui/icons-material/CallRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';

const iconMap = {
    call: CallRoundedIcon,
    mail: MailRoundedIcon,
    schedule: ScheduleRoundedIcon,
};

export default function ContactItem({icon, title, description}) {
    const IconComponent = iconMap[icon] || CallRoundedIcon;

    return (
        <div className="flex gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <IconComponent sx={{ fontSize: '1rem' }} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
                {description.map((item) => (
                    <p key={item.id} className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                )) }
                <p className="text-xs text-slate-600 dark:text-slate-400"></p>
            </div>
        </div>
    )
}
