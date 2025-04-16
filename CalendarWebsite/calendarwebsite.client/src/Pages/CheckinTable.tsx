import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { formatTime, User } from '../interfaces/type';
import { formatDate } from '@fullcalendar/core/index.js';


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

export default function ExportCustomToolbar() {
    const [rows, setRows] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [nameOfUsers, setNameOfUsers] = useState<string[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedName, setSelectedName] = useState('');


    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 }, // Takes up 0.5x the width
        { field: 'userId', headerName: 'Email', flex: 2 }, // Takes up 2x the width
        { field: 'workingDate', headerName: 'Day of working', flex: 1 }, // Takes up 1x the width
        { field: 'inAt', headerName: 'Check-in Time', flex: 1 }, // Takes up 1x the width
        { field: 'outAt', headerName: 'Check-out Time', flex: 1 }, // Takes up 1x the width
    ];

    async function fetchDataByUserId(userId : string): Promise<void> {
        const userIdBeforeDash = userId.split('-')[0];
        const apiUrl = import.meta.env.VITE_API_URL + 'api/DataOnly_APIaCheckIn/GetUserByUserId?month=' + 3 + '&year=' + 2025 + '&userId=';
        console.log(apiUrl+userIdBeforeDash);
        const response = await fetch(apiUrl+userIdBeforeDash);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const formattedData = data.map((item: User, index: number) => ({
                id: index + 1,
                userId: item.userId,
                workingDate: formatDate(item.at),
                inAt: formatTime(item.inAt),
                outAt: formatTime(item.outAt),
            }));
            setRows(formattedData);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName('');
        setFilter(e.target.value);
    };

    const handleNameClick = (name: string) => {
        setSelectedName(name);
        setFilter('');
        fetchDataByUserId(name);
    };

    useEffect(() => {
            async function getAllUserName() {
                const apiUrl = import.meta.env.VITE_API_URL + 'api/personalprofiles/GetAllUsersName';
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setNameOfUsers(data);
                }
            }
            getAllUserName();
        }, []);

    return (
        <div className="p-6 bg-[#083B75] min-h-screen text-center max-w-screen rounded-lg">
            <h1 className="font-bold text-5xl pb-6 text-white">Staff Checkin Table</h1>
            {/* <button onClick={fetchData}>Test</button> */}
            <div className="mb-8 flex flex-col items-center">
                <div className="relative w-96">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </span>
                    <input
                        autoComplete="off"
                        id="userIdField"
                        type="text"
                        placeholder=" "
                        value={selectedName || filter}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 pb-2.5 pt-2.5 text-sm text-gray-900 bg-white rounded-full border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 hover:bg-gray-50 transition duration-300 ease-in-out peer"
                    />
                    <label
                        htmlFor="userIdField"
                        className="absolute ml-[15px] left-6 top-0.5 text-sm text-gray-500 transform -translate-y-1/2 scale-100 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600 transition-all duration-300 ease-in-out"
                    >
                        Nhập tên
                    </label>
                    <button
                        type="button"
                        onClick={() => {
                            setFilter('');
                            setSelectedName('');
                        }}
                        className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        ✕
                    </button>
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


            </div>
            <div className="w-full overflow-x-auto p-5 bg-white rounded-lg shadow-md">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                />
            </div>

        </div>
    );
}
