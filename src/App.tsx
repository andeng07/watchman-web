import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import DashboardPage from "@/app/dashboard.tsx";
import LoginPage from "@/app/login.tsx";
import NotFoundPage from "@/app/not-found.tsx";
import OverviewPage from "@/app/overview.tsx";
import ProfilePage from "@/app/profile.tsx";
import ProtectedRoute from "@/app/proctected-route.tsx";
import ActiveSessionPage from "@/app/active-sessions.tsx";
import SessionsPage from "@/app/sessions.tsx";
import InteractionLogForm from "@/app/read-page.tsx";
import LogUserPage from "@/app/users.tsx";
import InteractionLogsPage from "@/app/interaction-logs.tsx";
import LogReaderPage from "@/app/readers.tsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="read/:id" element={<InteractionLogForm/>}></Route>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard" element={<DashboardPage/>}>
                        <Route index element={<Navigate to="overview" replace/>}/>
                        <Route path="overview" element={<OverviewPage/>}></Route>
                        <Route path="active-sessions" element={<ActiveSessionPage/>}></Route>
                        <Route path="sessions" element={<SessionsPage/>}></Route>
                        <Route path="logs" element={<InteractionLogsPage/>}></Route>
                        <Route path="users" element={<LogUserPage/>}></Route>
                        <Route path="readers" element={<LogReaderPage/>}></Route>
                        <Route path=":type/:id" element={<ProfilePage/>}></Route>
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    );
}

export default App
