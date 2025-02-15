import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import DashboardPage from "@/app/dashboard.tsx";
import LoginPage from "@/app/login.tsx";
import NotFoundPage from "@/app/not-found.tsx";
import OverviewPage from "@/app/overview.tsx";
import ProfilePage from "@/app/profile.tsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<OverviewPage />}></Route>
                    <Route path=":type"></Route>
                    <Route path=":type/:id" element={<ProfilePage />}></Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App
