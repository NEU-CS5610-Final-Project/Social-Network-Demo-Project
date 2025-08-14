import { Container, Navbar, Form, Button, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as accountClient from "../Account/client";
import { setCurrentUser } from "../Account/reducer";

export default function Banner() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"movies" | "users">("movies");
    const location = useLocation();
    const isAccountPage = location.pathname.includes("/Account");
    const isHomePage = location.pathname === "/" || location.pathname === "/home";

    const Signout = async () => {
        await accountClient.signout();
        dispatch(setCurrentUser(null));
        navigate("/Account/signin");
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        // Navigate to home page with search query and type
        navigate(`/?q=${encodeURIComponent(searchQuery.trim())}&page=1&type=${searchType}`);
        setSearchQuery(""); // Clear search input after navigation
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };
    return (
        <Navbar className="shadow-sm navbar-dark" style={{ backgroundColor: "#0f1419" }}>
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

                {/* Search Bar - Only show when not on home page or account page */}
                {!isHomePage && !isAccountPage && (
                    <div className="flex-grow-1 mx-4" style={{ maxWidth: "600px" }}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup>
                                <select
                                    className="form-select"
                                    style={{ maxWidth: "105px" }}
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as "movies" | "users")}
                                >
                                    <option value="movies">Movies</option>
                                    <option value="users">Users</option>
                                </select>
                                <Form.Control
                                    type="text"
                                    placeholder={`Search ${searchType}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="border-end-0"
                                />
                                <Button
                                    type="submit"
                                    variant="outline-secondary"
                                    className="border-start-0"
                                >
                                    <i className="bi bi-search"></i>
                                    Search
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                )}

                {/* buttons */}
                <div className="d-flex align-items-center gap-3">
                    {currentUser ? (
                        <div>
                            <Link to={`/Account/profile/${currentUser._id}`}>
                                <img
                                    src={`/avatar/${currentUser.avatar}.png` || "/avatar/default.png"}
                                    alt="User Avatar"
                                    className="rounded-circle border border-1 border-light"
                                    width="40"
                                    height="40"
                                    style={{ cursor: "pointer", backgroundColor: "white" }} />
                            </Link>
                            <button
                                onClick={Signout}
                                className="btn btn-outline-light ms-2">
                                Logout
                            </button>
                        </div>
                    ) : (isAccountPage ? null :
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