
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export default function CheckInByDayTable() {

    const [dateValue, setDateValue] = useState<Dayjs>(dayjs());


    return (
        <div className="p-6 bg-[#083B75] min-h-screen text-center max-w-screen rounded-lg">
            <h1 className="font-bold text-5xl pb-6 text-white">Staff Checkin Table By Day</h1>
            <div className="mb-8 flex flex-col items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Basic date picker"
                        onChange={(newValue) => {
                            if (newValue) {
                                setDateValue(newValue);
                            }
                        }}
                        value={dateValue}
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            '& .MuiInputLabel-root': {
                                color: '#083B75',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                padding: '0 5px',
                                borderRadius: '4px',
                            },
                        }} />
                </LocalizationProvider>

            </div>
        </div>
    );
}