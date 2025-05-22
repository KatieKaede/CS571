import React, {useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {

    const refUsername = useRef(null);
    const refPin = useRef(null);

    const [_, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();

        const username = refUsername.current.value;
        const pin = refPin.current.value;

        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin is a 7-digit number!");
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId(),
            },
            body: JSON.stringify({
                username: username,
                pin: pin,
            }),
            credentials: "include",
        })
        .then((res) => {
            console.log("Status code:", res.status);
            if (res.status === 401) {
                alert("Incorrect username or pin!"); 
            } else if (res.status === 200) {
                alert("Login Successful!")

                setLoginStatus(true);
                sessionStorage.setItem('loggedIn', true);
                sessionStorage.setItem("username", username);

                navigate("/");
            }
            return res.json();
        })
    };

    return (
        <>
            <h1>Login</h1>

            <div>
                <p htmlFor="username" style={{ marginBottom: '0.2em' }}>Username</p>
                <input
                    type="text"
                    ref={refUsername}
                />
            </div>

            <br></br>
    
            <div>
                <p htmlFor="pin" style={{ marginBottom: '0.2em' }}>Password</p>
                <input
                    type="password"
                    id="pin"
                    ref={refPin}
                />
            </div>

            <br></br>

            <button onClick={login}>Login</button>
        </>
    )
}
