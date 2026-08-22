import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";
import Gallery from "./pages/Gallery";
import TeamPoints from "./pages/TeamPoints";
import Announcements from "./pages/Announcements";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminDashboardNew from "./pages/AdminDashboardNew";
import CandidateRegistration from "./pages/CandidateRegistration";
import Leaderboard from "./pages/Leaderboard";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/team-points"
          element={<TeamPoints />}
        />

        <Route
          path="/announcements"
          element={<Announcements />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboardNew />}
        />

        <Route
          path="/candidate-registration"
          element={<CandidateRegistration />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/admin-settings"
          element={<AdminSettings />}
        />
      </Routes>
    </>
  );
}

export default App;