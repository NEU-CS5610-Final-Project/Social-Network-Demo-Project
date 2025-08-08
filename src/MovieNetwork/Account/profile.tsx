import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as client from "./client"

export default function Profile() {
    const { uid } = useParams();
    const [profile, setProfile] = useState<any>({});
    const fetchProfile = async () => {
        const profile = await client.findProfile(uid as string);
        setProfile(profile);
    };
    useEffect(() => {
        fetchProfile();
    }, [uid]);
    return (
        <div>
            <h2>Profile</h2>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
    )
}