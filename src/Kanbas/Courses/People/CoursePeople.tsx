import { useParams } from "react-router";
import * as courseClient from "../client";
import { useEffect, useState } from "react";
import PeopleTable from "./Table";

export default function Users() {
    const { cid, uid } = useParams(); // 确认cid已正确获取
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("");

    const fetchUsers = async () => {
        try {
            if (cid) {
                const users = await courseClient.findUsersForCourse(cid);
                console.log("Fetched users:", users); // 添加日志
                setUsers(users);
            } else {
                console.log("cid is undefined"); // 添加日志
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]); // 确保监听cid的变化

    return (
        <div>
            <PeopleTable users={users} />
        </div>
    );
}