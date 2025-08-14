import { Route, Routes } from "react-router-dom";
import UserManager from "./UserManager";
import { useSelector } from "react-redux";

export default function Admin() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div>
            {currentUser && currentUser.role === "ADMIN" ? (
                <Routes>
                    <Route path="/UserManager" element={<UserManager />} />
                </Routes>
            ) : (
                <h2 className="text-center mt-5">You do not have permission to view this page.</h2>
            )}
        </div>
    );
}