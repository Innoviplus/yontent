
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
import MissionReceiptSubmission from "./pages/MissionReceiptSubmission";
import Index from "./pages/Index";
import UserRankings from "./pages/UserRankings";
import ReviewDetail from "./pages/ReviewDetail";

const routes = [
  {
    path: "/",
    element: <Index />,
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
    path: "/reviews/:id",
    element: <ReviewDetail />,
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
    path: "/mission-receipt/:id",
    element: <MissionReceiptSubmission />,
  },
  {
    path: "/user-rankings",
    element: <UserRankings />,
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
