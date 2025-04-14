import React, { useEffect, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Bounce, toast } from 'react-toastify';

export default function CalendarComponent() {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [nameOfUsers, setNameOfUsers] = useState<string[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);

    const EventPopover = ({ eventInfo }: EventInput) => {
        const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget); // Gán phần tử DOM hiện tại làm anchor
        };

        const handlePopoverClose = () => {
            setAnchorEl(null); // Đóng Popover
        };

        const isOpen = Boolean(anchorEl);

        return (
            <div className="relative cursor-pointer">
                <div
                    className="text-center"
                    onClick={handlePopoverOpen}
                    role="button"
                >
                    <b className="pr-2.5">{eventInfo.timeText}</b>
                    <i>{eventInfo.event.title}</i>
                </div>

                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'top', // Hiển thị phía trên sự kiện
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom', // Điểm gốc để định vị
                        horizontal: 'center',
                    }}
                    sx={{
                        boxShadow: 'none', // Loại bỏ hiệu ứng bóng
                    }}
                >
                    <div className="p-4 max-w-xs">
                        <Typography variant="h6" className="text-xl text-blue-500 font-bold mb-2">
                            {eventInfo.event.title}
                        </Typography>
                        <Typography variant="body2" className="text-sm text-gray-700">
                            <span className="font-semibold">Thời gian:</span> {eventInfo.timeText}
                        </Typography>
                        <Typography className="text-sm text-gray-700 mt-2" variant="body2">
                            {eventInfo.event.extendedProps.description}
                        </Typography>
                    </div>
                </Popover>
            </div>
        );
    };

    useEffect(() => {
        async function getAllUserName() {
            const apiUrl = import.meta.env.VITE_API_URL + 'api/DataOnly_APIaCheckIn/GetAllUsersName';
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setNameOfUsers(data);
            }
        }
        getAllUserName();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName('');
        setFilter(e.target.value);
    };

    const handleNameClick = (name: string) => {
        setSelectedName(name);
        setFilter('');
    };

    async function findUserById(): Promise<void> {
        const selectedValue: string = selectedName;
        if (selectedValue === '') {
            toast.error('Vui lòng nhập tên!', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            return;
        }
        setLoading(true);

        const valueBeforeDash = selectedValue.split('-')[0];
        const apiUrl = import.meta.env.VITE_API_URL + 'api/DataOnly_APIaCheckIn/GetUserByUserId?userId=';
        const response = await fetch(apiUrl + valueBeforeDash);
        if (response.ok) {
            const data = await response.json();

            const eventList: EventInput[] = [];

            data.forEach((item: EventInput) => {
                const adjustedStart = new Date(item.inAt);
                adjustedStart.setHours(adjustedStart.getHours() + 7);

                const adjustedEnd = new Date(item.outAt);
                adjustedEnd.setHours(adjustedEnd.getHours() + 7);

                eventList.push({
                    id: item.id?.toString(),
                    title: 'Giờ vào',
                    start: adjustedStart,
                    extendedProps: {
                        description: adjustedStart.toLocaleString('vi-VN'),
                    },
                    className: 'bg-green-500 text-black rounded px-2',
                });

                eventList.push({
                    id: item.id?.toString() + '-out',
                    title: 'Giờ ra',
                    start: adjustedEnd,
                    extendedProps: {
                        description: adjustedEnd.toLocaleString('vi-VN'),
                    },
                    className: 'bg-red-400 text-black rounded px-2',
                });
            });

            setTimeout(() => {
                setLoading(false);
                setEvents(eventList);
            }, 1000);
        }
    }

    const handleEventClick = (info: any) => {
        setAnchorEl(info.el); // Set the clicked element as anchor
        setSelectedEvent(info.event); // Store the clicked event
    };



    return (
        <div className="p-6 bg-gray-50 min-h-screen text-center">
            <h1 className="font-bold text-5xl pb-6 text-black">Lịch Checkin</h1>

            <div className="mb-8 flex flex-col items-center">
                <div className="relative w-96">
                    <input
                        id="userIdField"
                        type="text"
                        placeholder=" "
                        value={selectedName || filter}
                        onChange={handleInputChange}
                        className="block w-full px-6 pb-2.5 pt-2.5 text-sm text-gray-900 bg-white rounded-full border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 hover:bg-gray-50 transition duration-300 ease-in-out peer"
                    />
                    <label
                        htmlFor="userIdField"
                        className="absolute left-6 top-0.5 text-sm text-gray-500 transform -translate-y-1/2 scale-100 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600 transition-all duration-300 ease-in-out"
                    >
                        Nhập tên
                    </label>

                    {filter && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
                            {nameOfUsers
                                ?.filter((name: string) => name.toLowerCase().includes(filter.toLowerCase()))
                                .map((filteredName: string, index: number) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 cursor-pointer transition duration-200 ease-in-out"
                                        onClick={() => handleNameClick(filteredName)}
                                    >
                                        <p className="text-gray-800 font-medium">{filteredName}</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={findUserById}
                    className="mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-700 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out cursor-pointer"
                >
                    Tìm
                </button>
            </div>

            <div className="relative">
                {loading && (
                    <div role="status">
                    <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
                )}

                {events?.length ? (
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                        }}
                        locale="vi"
                        events={events}
                        eventContent={(eventInfo) => <EventPopover eventInfo={eventInfo} />}
                        eventClick={handleEventClick}
                        editable={true}
                        selectable={true}
                    />
                ) : (
                    <div className="text-center mt-6">
                        <p className="mt-4 text-gray-500 font-medium">Không có sự kiện nào!</p>
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: '',
                            }}
                            locale="vi"
                            events={[]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


