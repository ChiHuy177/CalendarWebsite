import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./Pages/DashboardLayout";
import CalendarComponent from "./Pages/CalendarComponent";
import ExportCustomToolbar from "./Pages/CheckinTable";




const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <CalendarComponent/>
            },
            {
                path: '/table',
                element: <ExportCustomToolbar/>
            }
        ]
    }
]);

export function Routes() {
    return <RouterProvider router={router} />;
}