import {Badge} from "@/components/ui/badge.tsx";

const DateBadges = ({
                        dateTime,
                        variant,
                    }: {
    dateTime: string;
    variant: "entry" | "exit" | "fallback" | "unauthorized" | "default" | "secondary" | "destructive" | "outline" | null | undefined;
}) => {
    const date = new Date(dateTime);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Manila',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila',
    });

    return (
        <div className="flex space-x-2">
            <Badge variant={variant} className="text-sm px-2 py-1">{formattedDate}</Badge>
            <Badge variant={variant} className="text-sm px-2 py-1">{formattedTime}</Badge>
        </div>
    );
};

export default DateBadges;
