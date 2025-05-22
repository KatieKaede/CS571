import React, { useEffect, useState, useContext } from "react"
import { Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
    
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loginStatus] = useContext(BadgerLoginStatusContext);
    const [currentUsername, setCurrentUsername] = useState("");

    const loadMessages = ( page = 1 ) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    useEffect(() => {
        loadMessages(currentPage);
        const usernameFromStorage = sessionStorage.getItem("username");
        console.log("Retrieved username:", usernameFromStorage); // Log the retrieved username
        if (usernameFromStorage) {
            setCurrentUsername(usernameFromStorage);
        } else {
            console.warn("No username found in sessionStorage.");
        }
    }, [currentPage, props.name]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Ensure both fields have values
        if (!postTitle || !postContent) {
            alert("You must provide both a title and content!");
            return;
        }
    
        const chatroomName = props.name.trim();
        console.log(chatroomName);
    
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${chatroomName}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include",
            body: JSON.stringify({
                title: postTitle,
                content: postContent,
            })
        })
        .then(res => {
            console.log("Response status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("Response data:", data);
            if (data.msg === "Successfully posted message!") {
                alert("Successfully posted!");
                loadMessages(currentPage);
                setPostTitle("");
                setPostContent("");
            } else {
                alert("Failed to post the message. Error: " + data.msg);
            }
        })
    };

    function handleDelete(messageId) {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${messageId}`, {
            method: "DELETE",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                alert("Successfully deleted the post!");
                loadMessages();
            } else {
                console.error("Delete failed:", response.status, response.statusText);
                alert("Failed to delete the post. Please try again.");
            }
        });
    }

    return ( 
        <>
            <h1>{props.name} Chatroom</h1>

            {loginStatus ? (
                <Form onSubmit={handleSubmit} className="mb-3">
                    <Form.Group controlId="postTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={postTitle} 
                            onChange={(e) => setPostTitle(e.target.value)} 
                            placeholder="Enter post title" 
                        />
                    </Form.Group>
                    <Form.Group controlId="postContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={postContent} 
                            onChange={(e) => setPostContent(e.target.value)} 
                            placeholder="Enter post content" 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Post
                    </Button>
                </Form>
            ) : (
                <p>You must be logged in to post!</p>
            )}

            <hr/>
            {messages.length > 0 ? (
                <Row>
                    {messages.map((message, index) => (
                        <Col key={index} xs={12} sm={6} md={4} lg={3}>
                            <BadgerMessage
                                key={message.id}
                                id={message.id}
                                title={message.title}
                                poster={message.poster}
                                content={message.content}
                                created={message.created}
                                owner={message.poster === currentUsername}
                                delete={handleDelete}
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                    <p>There are no messages on this page yet!</p>
            )}

            <Pagination>
                {[1, 2, 3, 4].map((page) => ( 
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}
            </Pagination>
        </>
    );
}
