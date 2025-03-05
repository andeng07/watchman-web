import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {XIcon} from "lucide-react";

export default function CustomDatePicker({placeholder, selectedDate, setSelectedDate}: {
    placeholder: string;
    selectedDate: Date | null,
    setSelectedDate: (date: Date | null) => void
}) {
    return (
        <div className="flex gap-3">
            <DatePicker
                selected={selectedDate}
                onChange={(date) => date ? setSelectedDate(date) : null}
                className="py-2 px-4 border rounded-md text-sm bg-secondary"
                dateFormat="MMMM d, yyyy"
                placeholderText={placeholder}
            />
            <button onClick={() => setSelectedDate(null)}>
                <XIcon/>
            </button>
        </div>
    );
}