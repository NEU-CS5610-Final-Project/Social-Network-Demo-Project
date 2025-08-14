import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const [signinError, setSigninError] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signin = async () => {
        try {
            const user = await client.signin(credentials);
            if (!user) {
                return;
            }
            dispatch(setCurrentUser(user));
            navigate(`/Account/profile/${user._id}`);
        }
        catch (error: any) {
            setSigninError(error.response.data.message || "Failed to sign in.");
        }
    };
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "calc(100vh - 120px)" }}>
            <Card style={{ width: "22rem" }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign In</Card.Title>
                    {signinError && (
                        <div className="alert alert-danger" role="alert">
                            {signinError}
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
                        <Button className="w-100" variant="primary" onClick={signin}>
                            Sign In
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Don't have an account? <Link to="/Account/signup">Sign up</Link>
                    </p>
                </Card.Body>
            </Card>
        </div>
    )
}