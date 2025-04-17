import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CalendarComponent from "./Pages/CalendarComponent";
import ExportCustomToolbar from "./Pages/CheckinTable";
import DashboardLayout from "./Pages/DashboardLayout";





const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <DashboardLayout />,
            children: [
                { index: true, element: <CalendarComponent /> },
                { path: 'table', element: <ExportCustomToolbar /> },
            ],
        },
    ]
);

export function Routes() {
    return <RouterProvider router={router} />;
}