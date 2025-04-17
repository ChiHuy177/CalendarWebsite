import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { formatTime, User } from '../interfaces/type';
import { formatDate } from '@fullcalendar/core/index.js';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

export default function ExportCustomToolbar() {
    const [rows, setRows] = useState([]);
    const [nameOfUsers, setNameOfUsers] = useState<string[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'userId', headerName: 'Email', flex: 2 },
        { field: 'workingDate', headerName: 'Day of working', flex: 1 },
        { field: 'inAt', headerName: 'Check-in Time', flex: 1 },
        { field: 'outAt', headerName: 'Check-out Time', flex: 1 },
        { field: 'totalTime', headerName: 'Total Working Time', flex: 1 },
    ];

    async function fetchDataByUserId(userId: string, month: number, year: number): Promise<void> {
        try {
            const userIdBeforeDash = userId.split('-')[0];
            const apiUrl = `${import.meta.env.VITE_API_URL}api/DataOnly_APIaCheckIn/GetUserByUserId`;
            const response = await axios.get(apiUrl, {
                params: {
                    month,
                    year,
                    userId: userIdBeforeDash,
                },
            });

            const data = response.data;
            const formattedData = data.map((item: User, index: number) => {
                const inAt = item.inAt ? new Date(item.inAt) : null;
                const outAt = item.outAt ? new Date(item.outAt) : null;

                let totalTime = 0;
                if (inAt && outAt) {
                    totalTime = (outAt.getTime() - inAt.getTime()) / (1000 * 60); 
                }

                const hours = Math.floor(totalTime / 60); 
                const minutes = Math.floor(totalTime % 60); 
                
                const formattedMinutes = minutes.toString().padStart(2, "0");

                return {
                    id: index + 1,
                    userId: item.userId,
                    workingDate: formatDate(item.at),
                    inAt: formatTime(item.inAt.toString()),
                    outAt: formatTime(item.outAt.toString()),
                    totalTime: hours > 0 || minutes > 0 ? `${hours}:${formattedMinutes}` : "N/A", 
                };
            });
            setRows(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
        }
    }

    function handleSearch() {
        if (selectedName === '' || selectedMonth === '' || selectedYear === '') {
            alert('Vui lòng chọn tên, tháng và năm trước khi tìm kiếm!');
            return;
        } else {
            fetchDataByUserId(selectedName, parseInt(selectedMonth), parseInt(selectedYear));
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName('');
        setFilter(e.target.value);
    };

    const handleNameClick = (name: string) => {
        setSelectedName(name);
        setFilter('');
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleExportExcel = async () => {
        if (selectedName === '' || selectedMonth === '' || selectedYear === '') {
            alert('Vui lòng chọn tên, tháng và năm trước khi xuất file!');
            return;
        }
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}api/export/ExportUserCheckinData`;
            const selectedNameBeforeDash = selectedName.split('-')[0];
            const response = await axios.get(apiUrl, {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                    userID: selectedNameBeforeDash,
                },
                responseType: 'blob', // Để nhận file dưới dạng blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `checkin-data-${selectedName}-${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Failed to export Excel file. Please try again.');
        }
    };

    useEffect(() => {
        async function getAllUserName() {
            try {
                const apiUrl = `${import.meta.env.VITE_API_URL}api/personalprofiles/GetAllUsersName`;
                const response = await axios.get(apiUrl);
                setNameOfUsers(response.data);
            } catch (error) {
                console.error('Error fetching user names:', error);
                alert('Failed to fetch user names. Please try again.');
            }
        }
        getAllUserName();
    }, []);

    return (
        <div className="p-6 bg-[#083B75] min-h-screen text-center max-w-screen rounded-lg">
            <h1 className="font-bold text-5xl pb-6 text-white">Staff Checkin Table</h1>
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

            <div className="mb-6 flex justify-center space-x-4">
                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="px-4 py-2 bg-white border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Chọn tháng</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="px-4 py-2 bg-white border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Chọn năm</option>
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={2025 - i}>
                            Năm {2025 - i}
                        </option>
                    ))}
                </select>
                <button
                    className="px-4 cursor-pointer py-2 bg-white border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={handleSearch}
                >
                    <span className="text-gray-800 font-medium">
                        <SearchRoundedIcon /> Tìm kiếm
                    </span>
                </button>
            </div>

            <button
                onClick={handleExportExcel}
                className="mb-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
                <DownloadRoundedIcon /> Export to Excel
            </button>

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
