import { Navigate, Route, Routes } from "react-router"
import Home from "./Home";
import Session from "./Account/Session"
import Account from "./Account";
import Banner from "./Home/banner";

export default function MovieNetwork() {
    return (
        <Session>
            <Banner />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/Account/*" element={<Account />} />
            </Routes>
        </Session>
    )
}
