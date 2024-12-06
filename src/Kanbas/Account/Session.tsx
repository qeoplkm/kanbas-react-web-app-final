import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import axiosWithCredentials from "./client";

export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
        const fetchProfile = async () => {
        try {
            const currentUser = await axiosWithCredentials.post('/api/users/profile');
            dispatch(setCurrentUser(currentUser.data));
        } catch (err: any) {
            console.error(err);
        }
        setPending(false);
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (!pending) {
        return children;
    }
}
