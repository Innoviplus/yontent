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
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Reviews from "./pages/Reviews";
import CreateReview from "./pages/CreateReview";
import EditReview from "./pages/EditReview";
import MissionDetail from "./pages/MissionDetail";
import RedeemPoints from "./pages/RedeemPoints";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PointsManagement from "./pages/Admin/PointsManagement";
import ReviewManagement from "./pages/Admin/ReviewManagement";
import UserManagement from "./pages/Admin/UserManagement";
import MissionManagement from "./pages/Admin/MissionManagement";
import MissionReceiptSubmission from "./pages/MissionReceiptSubmission";

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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/edit",
    element: <EditProfile />,
  },
  {
    path: "/reviews",
    element: <Reviews />,
  },
  {
    path: "/reviews/create",
    element: <CreateReview />,
  },
  {
    path: "/reviews/edit/:id",
    element: <EditReview />,
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
    path: "/admin/reviews",
    element: <ReviewManagement />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
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
