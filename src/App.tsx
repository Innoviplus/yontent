
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
import MissionReceiptSubmission from "./pages/MissionReceiptSubmission";
import Index from "./pages/Index";
import UserRankings from "./pages/UserRankings";
import ReviewDetail from "./pages/ReviewDetail";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import FollowersList from "./pages/FollowersList";
import FollowingList from "./pages/FollowingList";
import EditReview from "./pages/EditReview";
import SubmitReview from "./pages/SubmitReview";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Redeem from "./pages/Redeem";
import RewardDetail from "./pages/RewardDetail";

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
    path: "/mission-receipt/:id",
    element: <MissionReceiptSubmission />,
  },
  {
    path: "/user-rankings",
    element: <UserRankings />,
  },
  {
    path: "/user/:username",
    element: <UserProfile />,
  },
  {
    path: "/followers/:id",
    element: <FollowersList />,
  },
  {
    path: "/following/:id",
    element: <FollowingList />,
  },
  {
    path: "/edit-review/:id",
    element: <EditReview />,
  },
  {
    path: "/submit-review",
    element: <SubmitReview />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/redeem",
    element: <Redeem />,
  },
  {
    path: "/rewards/:id",
    element: <RewardDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
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
