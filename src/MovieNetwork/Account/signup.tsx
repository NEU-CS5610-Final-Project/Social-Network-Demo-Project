import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signup = async () => {
        const user = await client.signup(credentials);
        if (!user) return;
        dispatch(setCurrentUser(user));
        navigate(`/Account/profile/${user._id}`);
    };
    return (
        <div>
            <h2>Signup</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <Form.Control defaultValue={credentials.username} type="text" id="username" aria-describedby="usernameHelp"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Form.Control defaultValue={credentials.password} type="password" id="password"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                </div>
                <Button className="btn btn-primary" onClick={signup}>Submit</Button>
            </form>
        </div>
    );
}