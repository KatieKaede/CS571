import React, { useEffect, useState } from "react"

export default function BadgerRegister() {
    const [username, setUsername] = useState(``);
    const [pin, setPin] = useState(``);
    const [repeatPin, setRepeatPin] = useState(``);


    const registration = (e) => {
        e.preventDefault();

        if (!username || !pin || !repeatPin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        if (pin !== repeatPin) {
            alert("Your pins do not match!");
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/register', {
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

            if (res.status === 409) {
                alert("That username has already been taken!"); 
            } else if (res.status === 200) {
                alert("Registration successful!")
            }
            return res.json();
        })
    };

    return ( 
        <>
            <h1>Register</h1>

            <div>
                <label htmlFor="username" style={{ marginBottom: '0.2em' }}>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <br></br>
 
            <div>
                <label htmlFor="pin" style={{ marginBottom: '0.2em' }}>Password</label>
                <input
                    type="password"
                    value={pin}
                    onChange={(e)=> setPin(e.target.value)}
                />
            </div>
            
            <br></br>
            
            <div>
                <label htmlFor="repeatPin" style={{ marginBottom: '0.2em' }}>Repeat Password</label>
                <input
                    type="password"
                    value={repeatPin}
                    onChange={(e)=> setRepeatPin(e.target.value)}
                />
            </div>

            <br ></br>

            <button onClick={registration}>Register</button>

        </>
    );
}