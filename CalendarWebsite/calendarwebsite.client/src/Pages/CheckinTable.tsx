import axios from 'axios';
import { DataGrid, GridColDef, GridColumnGroupingModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { formatTime, User } from '../interfaces/type';
import { formatDate } from '@fullcalendar/core/index.js';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton, styled, TextField } from '@mui/material';
import { Bounce, toast } from 'react-toastify';



export default function ExportCustomToolbar() {
    const [rows, setRows] = useState([]);
    const [nameOfUsers, setNameOfUsers] = useState<string[]>([]);
    // const [filter, setFilter] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(false);



    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: "Thông tin nhân viên",
            children: [{ field: 'id' }, { field: 'userId' }]
        }, {
            groupId: "Thời gian làm việc",
            children: [{ field: 'workingDate' }, { field: 'inAt' }, { field: 'outAt' }, { field: 'totalTime' }]
        }
    ]

    const columns: GridColDef[] = [
        { field: 'id', headerName: '#', flex: 0.5, headerAlign: 'center' },
        { field: 'userId', headerName: 'Email', flex: 2, headerAlign: 'center' },
        { field: 'workingDate', headerName: 'Day of working', flex: 1, headerAlign: 'center' },
        { field: 'inAt', headerName: 'Check-in Time', flex: 1, headerAlign: 'center' },
        { field: 'outAt', headerName: 'Check-out Time', flex: 1, headerAlign: 'center' },
        { field: 'totalTime', headerName: 'Total Working Time', flex: 1, headerAlign: 'center' },
    ];
    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .no-rows-primary': {
            fill: '#3D4751',
            ...theme.applyStyles('light', {
                fill: '#AEB8C2',
            }),
        },
        '& .no-rows-secondary': {
            fill: '#1D2126',
            ...theme.applyStyles('light', {
                fill: '#E8EAED',
            }),
        },
    }));
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width={96}
                    viewBox="0 0 452 257"
                    aria-hidden
                    focusable="false"
                    className='pt-5'
                >
                    <path
                        className="no-rows-primary"
                        d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                    />
                    <path
                        className="no-rows-primary"
                        d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                    />
                    <path
                        className="no-rows-primary"
                        d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                    />
                    <path
                        className="no-rows-secondary"
                        d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                    />
                </svg>
                <Box sx={{ mt: 2 }}>No rows</Box>
            </StyledGridOverlay>
        );
    }
    function MyCustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector
                    slotProps={{ tooltip: { title: 'Change density' } }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <GridToolbarExport
                    slotProps={{
                        tooltip: { title: 'Export data' },
                        button: { variant: 'outlined' },
                    }}
                />
                <Button
                    onClick={handleExportExcel}
                    className="mb-6 cursor-pointer px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <DownloadRoundedIcon /> Export to Excel
                </Button>
            </GridToolbarContainer>
        );
    }


    async function fetchDataByUserId(userId: string, month: number, year: number): Promise<void> {
        try {
            setLoading(true);
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

                const oneHour = 1 * 3600000; // 1 hour in milliseconds
                const oneMinute = 1 * 60000; // 1 minute in milliseconds

                let totalTime = 0;
                if (inAt && outAt) {
                    totalTime = (outAt.getTime() - inAt.getTime() - oneHour) / oneMinute;
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
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
        }
    }

    function handleSearch() {
        if (selectedName === '' || selectedMonth === '' || selectedYear === '') {
            toast.error('Vui lòng nhập đầy đủ tên, tháng và năm tìm kiếm!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        } else {
            fetchDataByUserId(selectedName, parseInt(selectedMonth), parseInt(selectedYear));
        }
    }

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectedName('');
    //     setFilter(e.target.value);
    // };

    // const handleNameClick = (name: string) => {
    //     setSelectedName(name);
    //     setFilter('');
    // };

    const handleMonthChange = (e: SelectChangeEvent) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e: SelectChangeEvent) => {
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
                <Autocomplete
                    disablePortal
                    options={nameOfUsers}
                    sx={{
                        width: '50%',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        '& .MuiInputLabel-root': {
                            color: '#083B75', // Màu chữ của label
                            backgroundColor: 'white', // Màu nền của label
                            padding: '0 5px',
                            borderRadius: '5px', // Bo tròn góc của label
                        },
                    }}
                    value={selectedName}
                    onChange={(_event, value) => setSelectedName(value || '')}
                    renderInput={(params) => (
                        <TextField {...params}
                            label="Nhập tên"
                        ></TextField>)
                    }
                />
                <div className="relative w-110">

                    {/* <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
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
                        className="absolute ml-[15px] rounded-sm left-6 top-0.5 text-sm text-gray-500 transform -translate-y-1/2 scale-100 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600 transition-all duration-300 ease-in-out"
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
                    </button> */}
                    {/* {filter && (
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
                    )} */}
                </div>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
                <Box sx={{
                    minWidth: 120,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="month-select-label"
                            sx={{
                                backgroundColor: 'white',
                                padding: '0 5px',
                                borderRadius: '4px',
                            }}>
                            Chọn tháng
                        </InputLabel>
                        <Select
                            labelId="month-select-label"
                            id="month-select"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{
                    minWidth: 120,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="year-select-label"
                            sx={{
                                backgroundColor: 'white',
                                padding: '0 5px',
                                borderRadius: '4px',
                            }}>
                            Chọn năm
                        </InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <MenuItem key={i} value={2025 - i}>
                                    Năm {2025 - i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        backgroundColor: '#00B6E6', // Custom background color
                        color: 'white', // Text color
                        padding: '10px 20px', // Padding
                        borderRadius: '8px', // Rounded corners
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow
                        '&:hover': {
                            backgroundColor: '#052A5E', // Hover background color
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SearchRoundedIcon
                        sx={{
                            fontSize: '1.5rem', // Icon size
                        }}
                    />
                    <span
                        className="font-medium ml-2 hidden sm:inline"
                    >
                        Tìm kiếm
                    </span>
                </Button>
            </div>


            <div className="w-full overflow-x-auto p-5 bg-white rounded-lg shadow-md">
                {loading ? (<Box sx={{ width: '100%', height: '100%' }}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </Box>) :
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        slots={{
                            toolbar: MyCustomToolbar,
                            noRowsOverlay: CustomNoRowsOverlay
                        }}
                        columnGroupingModel={columnGroupingModel}
                        sx={{
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: '#f5f5f5',

                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: '#EEEEEE', // Màu nền cho hàng lẻ
                            },
                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                backgroundColor: '#ffffff', // Màu nền cho hàng chẵn
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#D1E4F6', // Màu nền khi hover
                            },
                        }}
                    />}

            </div>
        </div>
    );
}
