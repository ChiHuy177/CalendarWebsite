import { Avatar } from "@mui/material";
// import CalendarComponent from "./CalendarComponent";
import { Link, Outlet } from "react-router-dom";
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import BackupTableIcon from '@mui/icons-material/BackupTable';
export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-[#0D2463] to-[#050E35] text-white shadow-lg">
                <div className="p-4 border-b border-blue-400 flex justify-center items-center">
                    <img src="./logovntt.png" alt="VNTT" className="w-48" />
                </div>
                <nav className="mt-4">
                    <ul>
                        <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer transition duration-300">
                            <Link to="/" className="text-white font-medium flex items-center space-x-2">
                                
                                <span><CalendarMonthTwoToneIcon/> Staff checkin calendar</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer transition duration-300">
                            <Link to="/table" className="text-white font-medium flex items-center space-x-2">
                                
                                <span><BackupTableIcon/> Staff checkin table</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-[#001529] shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#00CAFF]">Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-b from-[#0D2463] to-[#050E35] p-6  shadow-lg">
                        <Outlet/>
                    </div>
                </main>


            </div>
        </div>
    );
}