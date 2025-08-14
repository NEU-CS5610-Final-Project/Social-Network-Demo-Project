import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Signup() {
    const [credentials, setCredentials] = useState<any>({
        "email": "",
        "bio": "",
        "avatar": "default",
        "role": "USER",
        "privacy": {
            "email": 0,
            "bio": 0,
            "join_date": 0,
            "liked": 0,
            "following": 0,
            "review": 0
        }
    });
    const [signupError, setSignupError] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signup = async () => {
        try {
            const user = await client.signup(credentials);
            if (!user) return;
            dispatch(setCurrentUser(user));
            navigate(`/Account/profile/${user._id}`);
        } catch (error: any) {
            setSignupError(error.response.data.message || "Failed to sign up.");
        }
    };
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "calc(100vh - 120px)" }}>
            <Card style={{ width: "22rem" }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign Up</Card.Title>
                    {signupError && (
                        <div className="alert alert-danger" role="alert">
                            {signupError}
                        </div>
                    )}
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <Form.Control
                                defaultValue={credentials.username}
                                type="text"
                                id="username"
                                aria-describedby="usernameHelp"
                                onChange={(e) =>
                                    setCredentials({ ...credentials, username: e.target.value })
                                } />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Form.Control
                                defaultValue={credentials.password}
                                type="password"
                                id="password"
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                } />
                        </div>
                        <Button className="w-100" variant="primary" onClick={signup}>
                            Sign Up
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Already have an account?{" "}
                        <Link to="/Account/signin">Sign in</Link>
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
}