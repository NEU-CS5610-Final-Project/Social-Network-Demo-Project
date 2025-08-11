import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import * as client from "./client"
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaShieldAlt, FaHeart, FaUsers, FaCommentDots } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Form } from "react-bootstrap";

export default function Profile() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [page, setPage] = useState("info");
    const [editable, setEditable] = useState(false);
    const { uid } = useParams();
    const [profile, setProfile] = useState<any>({});
    const [isFollowed, setFollowed] = useState(false);
    const [editProfile, setEditProfile] = useState<any>({});
    const formatReviewDate = (dateString: string) => {
        if (!dateString) return 'Recent';

        const reviewDate = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - reviewDate.getTime();

        // convert to minutes and hours
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            // on or before yesterday
            return reviewDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };
    const fetchProfile = async () => {
        const profile = await client.findProfile(uid as string);
        if (profile.reviews && profile.reviews.length > 0) {
            // get unique movie_id
            const uniqueMovieIds = [...new Set(profile.reviews.map((review: any) => review.movie_id))];

            // get movie titles
            const titleMap = new Map();
            await Promise.all(uniqueMovieIds.map(async (movieId) => {
                const title = await client.getMovieTitleById(movieId as string);
                titleMap.set(movieId, title);
            }));

            // add titles to each review
            profile.reviews = profile.reviews.map((review: any) => ({
                ...review,
                title: titleMap.get(review.movie_id) || 'Unknown Movie'
            }));
        }
        setProfile(profile);
        setEditProfile({ _id: uid, privacy: { ...profile.privacy } });
        if (profile.followers && currentUser) {
            setFollowed(profile.followers.some((user: any) => user._id === currentUser._id));
        }
    };
    const saveProfile = async () => {
        await client.updateProfile(editProfile);
        fetchProfile();
        setEditable(false);
    };
    const discardChanges = () => {
        setEditProfile({ _id: uid, privacy: { ...profile.privacy } });
        setEditable(false);
    };
    const followUser = async () => {
        await client.followUser(uid as string);
        fetchProfile();
    };
    const unfollowUser = async (userid: string) => {
        await client.unfollowUser(userid);
        fetchProfile();
    };
    useEffect(() => {
        fetchProfile();
        setPage("info");
    }, [uid]);
    const isSelf = currentUser?._id === uid;
    return (
        <div className="bg-gray-50">
            <div>
                <div className="d-flex align-items-center justify-content-between bg-white shadow-sm" style={{ height: "60px", zIndex: 10 }}>
                    <div className="ms-5 d-flex align-items-center justify-content-between w-100">
                        {isSelf ? <h2>My Profile</h2> : (
                            <>
                                <h2>{profile.username}'s Profile</h2>
                                {isFollowed ? (
                                    <Button className="me-2" variant="warning" onClick={() => unfollowUser(profile._id)}>Unfollow</Button>
                                ) : (
                                    <Button className="me-2" variant="success" onClick={() => followUser()}>Follow</Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <br />
                    <Card className="bg-white ms-5 shadow-sm me-5">
                        <Card.Body>
                            <div className="text-center mb-3">
                                <Link to={`/Account/profile/${profile._id}`}>
                                    <img
                                        src={`/avatar/${profile.avatar}.png` || "/avatar/default.png"}
                                        alt="User Avatar"
                                        className="rounded-circle border"
                                        width="120"
                                        height="120"
                                        style={{ cursor: "pointer" }} />
                                </Link>
                            </div>
                            <div className="text-center">
                                <h2 className="mb-2">{profile.username}</h2>
                                <p className="text-muted mb-1">{profile.email}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <br />
            <Container fluid>
                <Row>
                    <Col xs="auto" className="ms-5 border-end" style={{ width: '220px', minWidth: '220px' }}>
                        <div onClick={() => setPage("info")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <BsFillInfoSquareFill className="fs-5 me-2" />
                                Basic Information
                            </div>
                        </div>
                        {(profile.liked || isSelf) && <div onClick={() => setPage("liked")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <FaHeart className="fs-5 me-2" />
                                Liked Movie
                            </div>
                        </div>}
                        {(profile.following || isSelf) && <div onClick={() => setPage("following")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <FaUserCheck className="fs-5 me-2" />
                                Following
                            </div>
                        </div>}
                        {(profile.followers || isSelf) && <div onClick={() => setPage("follower")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <FaUsers className="fs-5 me-2" />
                                Follower
                            </div>
                        </div>}
                        {(profile.reviews || isSelf) && <div onClick={() => setPage("review")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <FaCommentDots className="fs-5 me-2" />
                                Reviews
                            </div>
                        </div>}
                        {isSelf && <div onClick={() => setPage("privacy")} className="mb-2" style={{ cursor: "pointer" }}>
                            <div className="d-flex align-items-center p-2 rounded" style={{
                                transition: 'background-color 0.2s ease',
                            }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}>
                                <FaShieldAlt className="fs-5 me-2" />
                                Privacy Settings
                            </div>
                        </div>}
                    </Col>
                    <Col>
                        {page === "info" && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3>Basic Information</h3>
                                    {isSelf ? (editable ? (
                                        <div>
                                            <Button variant="success" onClick={saveProfile} className="me-2">Save</Button>
                                            <Button variant="secondary" onClick={discardChanges}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <Button variant="primary" onClick={() => setEditable(true)}>Edit</Button>
                                    )) : (null)}
                                </div>
                                <br />
                                <div className="d-flex mb-2">
                                    <label className="col-2">Username</label>
                                    <Form.Control
                                        type="text"
                                        value={editProfile.username || profile.username}
                                        readOnly={!editable}
                                        className={editable ? "" : "bg-light"}
                                        onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })} />
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Email</label>
                                    <Form.Control
                                        type="email"
                                        value={editProfile.email || profile.email || ""}
                                        readOnly={!editable}
                                        className={editable ? "" : "bg-light"}
                                        onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Bio</label>
                                    <Form.Control
                                        as="textarea"
                                        value={editProfile.bio || profile.bio || ""}
                                        readOnly={!editable}
                                        className={editable ? "" : "bg-light"}
                                        onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} />
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Join Date</label>
                                    <Form.Control
                                        type="date"
                                        value={profile.join_date || ""}
                                        readOnly
                                        className="bg-light" />
                                </div>
                            </div>
                        )}
                        {page === "liked" && (
                            <div>
                                <h3>Liked Movies</h3>
                                {profile.liked.length > 0 ? (
                                    <>
                                        {/* TODO: Display liked movies */}
                                    </>
                                ) : (
                                    <p>No liked movies found.</p>
                                )}
                            </div>
                        )}
                        {page === "following" && (
                            <div>
                                <h3>Following</h3>
                                <Table hover>
                                    <tbody>
                                        {profile.following && (profile.following.length > 0 ? (
                                            profile.following.map((user: any) => (
                                                <tr key={user._id}>
                                                    <td className="align-middle" style={{ width: '80px' }}>
                                                        <Link to={`/Account/profile/${user._id}`}>
                                                            <img
                                                                src={`/avatar/${user.avatar}.png` || "/avatar/default.png"}
                                                                alt="User Avatar"
                                                                className="rounded-circle"
                                                                width="50"
                                                                height="50"
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td className="align-middle">
                                                        <div>
                                                            <h6 className="mb-1">{user.username}</h6>
                                                        </div>
                                                    </td>
                                                    {isSelf && <td className="align-middle text-end">
                                                        <Button variant="outline-secondary" size="sm" onClick={() => unfollowUser(user._id)}>
                                                            Unfollow
                                                        </Button>
                                                    </td>}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">
                                                    <div>
                                                        <i className="bi bi-people fs-1 mb-2"></i>
                                                        <p className="mb-0">No following users found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                        {page === "follower" && (
                            <div>
                                <h3>Follower</h3>
                                <Table hover>
                                    <tbody>
                                        {profile.followers.length > 0 ? (
                                            profile.followers.map((user: any) => (
                                                <tr key={user._id}>
                                                    <td className="align-middle" style={{ width: '80px' }}>
                                                        <Link to={`/Account/profile/${user._id}`}>
                                                            <img
                                                                src={`/avatar/${user.avatar}.png` || "/avatar/default.png"}
                                                                alt="User Avatar"
                                                                className="rounded-circle"
                                                                width="50"
                                                                height="50"
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td className="align-middle">
                                                        <div>
                                                            <h6 className="mb-1">{user.username}</h6>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">
                                                    <div>
                                                        <i className="bi bi-people fs-1 mb-2"></i>
                                                        <p className="mb-0">No followers found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                        {page === "review" && (
                            <div>
                                <h3>Reviews</h3>
                                {profile.reviews.length > 0 ? (
                                    <div>
                                        {profile.reviews.map((review: any) => (
                                            <div key={review._id} className="col-md-6 col-lg-4 mb-3">
                                                <div className="card h-100 shadow-sm border-0">
                                                    <div className="card-header bg-light border-0">
                                                        <h6 className="mb-0 text-primary fw-bold">
                                                            {review.title}
                                                        </h6>
                                                    </div>

                                                    <div className="card-body">
                                                        <blockquote className="blockquote mb-0">
                                                            <p className="mb-0" style={{
                                                                fontSize: '0.9rem',
                                                                lineHeight: '1.4',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}>
                                                                "{review.content}"
                                                            </p>
                                                        </blockquote>
                                                    </div>

                                                    <div className="card-footer bg-transparent border-0 pt-0">
                                                        <small className="text-muted">
                                                            <i className="bi bi-clock me-1"></i>
                                                            {formatReviewDate(review.review_date)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No reviews found.</p>
                                )}
                            </div>
                        )}
                        {page === "privacy" && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3>Privacy Settings</h3>
                                    <Button variant="outline-success" onClick={saveProfile}>Save Changes</Button>
                                </div>
                                <br />
                                <div className="d-flex mb-2">
                                    <label className="col-2">Email</label>
                                    <select
                                        value={editProfile.privacy?.email || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Bio</label>
                                    <select
                                        value={editProfile.privacy?.bio || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Following List</label>
                                    <select
                                        value={editProfile.privacy?.following || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Join Date</label>
                                    <select
                                        value={editProfile.privacy?.join_date || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Liked</label>
                                    <select
                                        value={editProfile.privacy?.liked || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                                <div className="d-flex mb-2">
                                    <label className="col-2">Review</label>
                                    <select
                                        value={editProfile.privacy?.review || 0}
                                        className="form-select"
                                        onChange={(e) => setEditProfile({
                                            ...editProfile,
                                            privacy: {
                                                ...editProfile.privacy,
                                                email: parseInt(e.target.value)
                                            }
                                        })}>
                                        <option value={0}>Public</option>
                                        <option value={1}>Users Followed by Me</option>
                                        <option value={2}>Only Me</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
            {<div>
                <pre className="text-muted mt-3 ms-5 me-5">
                    {JSON.stringify(profile, null, 2)}
                </pre>
                <pre className="text-muted mt-3 ms-5 me-5">
                    {JSON.stringify(editProfile, null, 2)}
                </pre></div>}
        </div >
    )
}