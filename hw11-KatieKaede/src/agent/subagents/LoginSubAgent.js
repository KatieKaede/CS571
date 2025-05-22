import { isLoggedIn, ofRandom } from "../Util"
import AIEmoteType from "../../components/chat/messages/AIEmoteType"
const createLoginSubAgent = (end) => {

    let stage;

    let username, password;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in, try logging out first",
                "You are already signed in, try signing out first"
            ]))
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                "Sure, what is your username?",
                "Alright, what is your username?"
            ])
        }
    }

    const handleReceive = async (prompt) => {
        console.log('Received prompt:', prompt); // Debugging line
    console.log('Stage:', stage);
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return {
            msg: ofRandom([
                "Great, and what is your password?",
                "Thanks, and what is your password?"
            ]),
            nextIsSensitive: true
        };
    };

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            },
            body: JSON.stringify({
                username: username,
                pin: password
            })
        })

        if (resp.status === 200) {
            return {
                msg: end(ofRandom([
                    "Successfully logged in!",
                    "Success! You have been logged in."
                ])),
                emote: AIEmoteType.SUCCESS
             };
        } else {
            return {
                msg: end(ofRandom([
                    "Sorry, that username and password is incorrect.",
                    "Your username or your password is wrong, login unsuccessful.",
                ])),
                emote: AIEmoteType.ERROR
            };
        }
    };

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;