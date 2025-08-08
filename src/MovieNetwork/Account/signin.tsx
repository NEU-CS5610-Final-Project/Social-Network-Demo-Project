import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";
import { useNavigate } from "react-router-dom";


export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signin = async () => {
        const user = await client.signin(credentials);
        if (!user) return;
        dispatch(setCurrentUser(user));
        navigate(`/Account/profile/${user._id}`);
    };
    return (
        <div>
            <h2>Signin</h2>
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
                <Button className="btn btn-primary" onClick={signin}>Submit</Button>
            </form>
        </div>
    )
}