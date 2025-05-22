import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {

    const [loginStatus, setLoginStatus] = useState(() => {
        return sessionStorage.getItem('loggedIn') === 'true';
    });

    const navigate = useNavigate();

    // Persist loginStatus in sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('loggedIn', loginStatus);
    }, [loginStatus]);

    const handleLogout = () => {
        setLoginStatus(false);
        sessionStorage.removeItem('loggedIn');
        navigate("/logout");
    };

    return (
        <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
            <div>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
                            <img
                                alt="BadgerChat Logo"
                                src={crest}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            BadgerChat
                        </Navbar.Brand>
                        <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus ? (
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        )}
                            <NavDropdown title="Chatrooms">
                                {props.chatrooms.map((chatroom, index) => (
                                    <NavDropdown.Item
                                        key={index}
                                        as={Link}
                                        to={`chatrooms/${chatroom}`}
                                    >
                                        {chatroom}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    </Container>
                </Navbar>
                <div style={{ margin: "1rem" }}>
                    <Outlet />
                </div>
            </div>
        </BadgerLoginStatusContext.Provider>
    );
}

export default BadgerLayout;