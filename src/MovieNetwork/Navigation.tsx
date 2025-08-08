import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AccountNavigation() {
    return (
        <ListGroup>
            <ListGroup.Item action as={Link} to="/Account/signin" className="btn btn-secondary">Signin</ListGroup.Item>
            <ListGroup.Item action as={Link} to="/Account/signup" className="btn btn-secondary">Signup</ListGroup.Item>
        </ListGroup>
    )
}
