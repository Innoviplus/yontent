
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PointsProvider } from "./contexts/PointsContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import RedeemPoints from "./pages/RedeemPoints";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PointsManagement from "./pages/Admin/PointsManagement";
import UserManagement from "./pages/Admin/UserManagement";
import MissionReceiptSubmission from "./pages/MissionReceiptSubmission";
import ReviewManagement from "./pages/Admin/ReviewManagement";
import MissionManagement from "./pages/Admin/MissionManagement";

const routes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reviews",
    element: <Reviews />,
  },
  {
    path: "/missions",
    element: <Missions />,
  },
  {
    path: "/missions/:id",
    element: <MissionDetail />,
  },
  {
    path: "/redeem",
    element: <RedeemPoints />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/points",
    element: <PointsManagement />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/reviews",
    element: <ReviewManagement />,
  },
  {
    path: "/admin/missions",
    element: <MissionManagement />,
  },
  {
    path: "/mission-receipt/:id",
    element: <MissionReceiptSubmission />,
  },
];

function App() {
  return (
    <AuthProvider>
      <PointsProvider>
        <ReviewProvider>
          <Router>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Router>
        </ReviewProvider>
      </PointsProvider>
    </AuthProvider>
  );
}

export default App;
