import { useEffect, useState } from "react";
import * as client from "./client"
import { Button, Card, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiReset, BiSearch, BiSortDown } from "react-icons/bi";

export default function UserManager() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [searchName, setSearchName] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [originalResults, setOriginalResults] = useState<any[]>([]);
    const [sorting, setSorting] = useState({ field: "default", order: "ASC" });

    const startSearch = async () => {
        const results = await client.searchUsers(searchName);
        setSearchResults(results);
        setOriginalResults(results);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const username = searchResults.find(user => user._id === userId)?.username;
        if (window.confirm(`Switch ${username}'s role to ${newRole}?`)) {
            await client.updateUser(userId, { role: newRole });
            setSearchResults((prevResults) =>
                prevResults.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );
        }
    };

    const handleSortingChange = (typeString: string) => {
        const newField = typeString.split(" ")[0];
        const newOrder = typeString.split(" ")[1] || "ASC";
        const newSortingType = { field: newField, order: newOrder };
        setSorting(newSortingType);
        if (newField === "default") {
            setSearchResults(originalResults);
        }
        else {
            sortResults(newSortingType);
        }
    };

    const sortResults = (newSortingType: any) => {
        const { field, order } = newSortingType;
        const sortedResults = [...searchResults].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return order === "ASC" ? -1 : 1;
            if (aValue > bValue) return order === "ASC" ? 1 : -1;
            return 0;
        });
        setSearchResults(sortedResults);
    };

    const handleDeleteUser = async (userId: string) => {
        const username = searchResults.find(user => user._id === userId)?.username;
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            await client.deleteUser(userId);
            setSearchResults((prevResults) =>
                prevResults.filter((user) => user._id !== userId)
            );
        }
    };

    const resetSearch = () => {
        setSearchName("");
        setSorting({ field: "default", order: "ASC" });
    };

    useEffect(() => {
        startSearch();
    }, [searchName]);
    return (
        <div>
            <h2 className="mt-3 text-center">User Management</h2>
            <br />
            <Card className="mb-4 ms-3 me-3 shadow-sm bg-light">
                <Card.Body>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label htmlFor="userManager-search-input" className="form-label fw-semibold">
                                <BiSearch className="me-1" />
                                Search for Username:
                            </label>
                            <div className="input-group">
                                <Form.Control
                                    id="userManager-search-input"
                                    type="text"
                                    placeholder="Input username..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Form.Label className="fw-semibold" htmlFor="userManager-sort-select">
                                <BiSortDown className="me-1" />
                                Sorting By:
                            </Form.Label>
                            <Form.Select
                                value={`${sorting.field} ${sorting.order}`}
                                onChange={(e) => handleSortingChange(e.target.value)}
                                id="userManager-sort-select"
                            >
                                <option value="default ASC">Default</option>
                                <option value="username ASC">Username (A-Z)</option>
                                <option value="username DESC">Username (Z-A)</option>
                                <option value="join_date ASC">Join Date (Earliest first)</option>
                                <option value="join_date DESC">Join Date (Latest first)</option>
                            </Form.Select>
                        </div>
                        <div className="col-md-2">
                            <Button className="w-100" variant="outline-secondary" type="button" onClick={resetSearch}>
                                <BiReset className="me-1" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <Card className="shadow-sm ms-3 me-3 mt-3">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover>
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-center">
                                        User
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-center">
                                        Join Date
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-center">
                                        Role
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((user: any) => (
                                    <tr key={user._id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-placeholder bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{ width: "35px", height: "35px" }}>
                                                    <Link to={`/Account/profile/${user._id}`}>
                                                        <img
                                                            src={`/avatar/${user.avatar}.png` || "/avatar/default.png"}
                                                            alt="User Avatar"
                                                            className="rounded-circle"
                                                            width="35"
                                                            height="35"
                                                            style={{ cursor: "pointer" }} />
                                                    </Link>
                                                </div>
                                                <strong>{user.username}</strong>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {new Date(user.join_date).toLocaleDateString('en-CA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td valign="middle">
                                            {user._id !== currentUser._id ? (<Form.Select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </Form.Select>) : (
                                                <div className="text-muted text-center">{user.role}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center" valign="middle">
                                            {user._id !== currentUser._id ? (
                                                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                                                    Delete
                                                </Button>
                                            ) : (
                                                <span className="text-muted">Can't delete your own account.</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
