import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Home";
import Session from "./Account/Session"
import Account from "./Account";
import Banner from "./Home/banner";
import MovieDetails from "./MovieDetails/index";
import Admin from "./Admin";


export default function MovieNetwork() {
    return (
        <Session>
            <Banner />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/Account/*" element={<Account />} />
                <Route path="/movie/:movieId" element={<MovieDetails />} />
                <Route path="/Admin/*" element={<Admin />} />
            </Routes>
        </Session>
    )
}
