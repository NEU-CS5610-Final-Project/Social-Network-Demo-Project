import { Navigate, Route, Routes } from "react-router";
import Signin from "./signin";
import Signup from "./signup";
import Profile from "./profile";

export default function Account() {
    return (
        <div>
            <br />
            <Routes>
                <Route path="/" element={<Navigate to="/Account/signin" />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile/:uid" element={<Profile />} />
            </Routes>
        </div>
    )
}