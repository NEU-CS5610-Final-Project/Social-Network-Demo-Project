import { Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as accountClient from "../Account/client";
import { setCurrentUser } from "../Account/reducer";
//
export default function Banner() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const Signout = async () => {
        await accountClient.signout();
        dispatch(setCurrentUser(null));
        navigate("/Account/signin");
    }
    const location = useLocation();
    const isSignPage = location.pathname.includes("/Account/signin") || location.pathname.includes("/Account/signup");
    return (
        <Navbar bg="light" className="shadow-sm">
            <Container className="d-flex justify-content-between align-items-center">
                {/* Logo */}
                <div className="navbar-brand m-0">
                    <Link to="/">
                        <img
                            src="https://via.placeholder.com/150x50/007bff/FFFFFF?text=LOGO"
                            alt="Logo"
                            height="50" />
                    </Link>
                </div>

                {/* buttons */}
                <div className="d-flex align-items-center gap-3">
                    {currentUser ? (
                        <div>
                            <Link to={`/Account/profile/${currentUser._id}`}>
                                <img
                                    src={`/avatar/${currentUser.avatar}.png` || "/avatar/default.png"}
                                    alt="User Avatar"
                                    className="rounded-circle"
                                    width="40"
                                    height="40"
                                    style={{ cursor: "pointer" }} />
                            </Link>
                            <button
                                onClick={Signout}
                                className="btn btn-outline-secondary ms-2">
                                Logout
                            </button>
                        </div>
                    ) : (isSignPage ? null :
                        <div>
                            <Link to="/Account/signin" className="btn btn-primary me-2">
                                Sign In
                            </Link>
                            <Link to="/Account/signup" className="btn btn-outline-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </Container>
        </Navbar>
    );
}