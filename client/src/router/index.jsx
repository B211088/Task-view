import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../page/Login";
import Dashboard from "../page/Dashboard";
import AuthProvider from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../page/ErrorPage";
import ViewTasks from "../component/ViewTasks/ViewTasks";
import TaskDetail from "../component/Task/TaskDetail";
import { plansLoader } from "../utils/plansUtils";
import { tasksLoader } from "../utils/tasksUtils";
import { taskLoader } from "../utils/taskUtils";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { element: <Login />, path: "/login" },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Dashboard />,
            path: "/",
            loader: plansLoader,
            children: [
              {
                element: <ViewTasks />,
                path: `plans/:planId`,
                loader: tasksLoader,
                children: [
                  {
                    element: <TaskDetail />,
                    path: "task/:taskId",
                    loader: taskLoader,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
