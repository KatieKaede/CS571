import createChatDelegator from "./ChatDelegator";
import { ofRandom, isLoggedIn, getLoggedInUsername, logout } from "./Util";

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "YKF2RVWP5PFDTAZZNXKZGG3YLWZBC5CH";

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleGetHelp = async () => {
        const responses = [
            "Try asking 'tell me the latest 3 messages', or ask for more help!",
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "Ask about all the 'available chatrooms' as a start!",
            "Ask about how to 'register for an account' as a start!"
        ];
        return ofRandom(responses);
    }

    const handleGetChatrooms = async () => {
        return `There are ${chatrooms.length} chatrooms: ${chatrooms.join(', ')}`;
    }

    const handleGetMessages = async (data) => {
        const specifiedNumber = data.entities["wit$number:number"] ? true : false;
        const numComments = specifiedNumber ? data.entities["wit$number:number"][0].value : 1;

        const specifiedChatroom = data.entities["chatroom_type:chatroom_type"] &&
        data.entities["chatroom_type:chatroom_type"].length > 0;

        const chatroom = specifiedChatroom ? data.entities["chatroom_type:chatroom_type"][0].value : null;
    
        let url = `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages`;
        if (chatroom) {
            url += `?chatroom=${encodeURIComponent(chatroom)}`;
            if (numComments) {
                url += `&num=${numComments}`;
            }
        } else if (numComments) {
            url += `?num=${numComments}`;
        }

        const response = await fetch(url, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            }
        });

        const msg_data = await response.json();
        const messages = msg_data.messages
        return messages.map((msg) =>
            `In ${msg.chatroom}, ${msg.poster} created a post titled "${msg.title}" saying "${msg.content}"`);
    };

    const handleLogin = async (promptData) => {
        return await delegator.beginDelegation("LOGIN", promptData);
    }

    const handleRegister = async (promptData) => {
        return await delegator.beginDelegation("REGISTER", promptData);
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE", data);
    }

    const handleLogout = async () => {
        const logStatus = await isLoggedIn();
        if (logStatus) {
            await logout();
            return "You have been logged out";
        } else {
            return "You need to be logged in before logging out";
        }
    };

    const handleWhoAmI = async () => {
        const username = await getLoggedInUsername();
        if (username) {
            return `You are currently logged in as ${username}.`;
        }
        else {
            return "You are not currently logged in."
        }
    };

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;