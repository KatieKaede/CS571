
import React, { useEffect, useContext } from 'react';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { useNavigate } from "react-router-dom";

export default function BadgerLogout() {
    const [, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Logging out...");
        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                alert("You have been successfully logged out.");
                setLoginStatus(false);
                navigate("/");
            }
        });
    }, [setLoginStatus, navigate]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
