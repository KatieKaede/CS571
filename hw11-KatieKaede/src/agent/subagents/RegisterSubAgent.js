import { isLoggedIn, ofRandom} from "../Util"
import AIEmoteType from "../../components/chat/messages/AIEmoteType"

const createRegisterSubAgent = (end) => {

    let stage;
    let username, pin, confirmPin;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in. Please log out before registering.",
                "You are currently signed in. Log out before creating a new account."
            ]));
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                "Got it! What username would you like to use?",
                "Sure, let's create your account. What do you want your username to be?",
                "Alright, to register, I'll need your username. What will it be?"
            ]);
        }
    };

    const handleReceive = async (prompt) => {
        switch (stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PIN": return await handleFollowupPin(prompt);
            case "CONFIRM_PIN": return await handleConfirmPin(prompt);
        }
    };

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PIN";
        return {
            msg: ofRandom([
                "Thank you, what pin would you like to use? This must be 7 digits.",
                "Thanks! What do you want your 7-digit pin to be?"
            ]),
            nextIsSensitive: true
        }
    };

    const handleFollowupPin = async (prompt) => {
        pin = prompt;
        if (pin.length !== 7 || isNaN(pin)) {
            return end(ofRandom([
                "Your pin must be exactly 7 digits. Cancelling Registration",
                "The pin provided is invalid it has to be 7 digits. Registration Cancelled."
            ]));
        }
        stage = "CONFIRM_PIN";
        return {
            msg: ofRandom([
                "Finally, please confirm your pin.",
                "Please re-enter your pin to confirm."
            ]),
            nextIsSensitive: true
        }
    };

    const handleConfirmPin = async (prompt) => {
        confirmPin = prompt;
        if (pin !== confirmPin) {
            return end(ofRandom([
                "The pin you entered does not match. Cancelling registration",
                "Your pins do not match! Registration canceled."
            ]));
        }
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        });

        if (resp.status === 200) {
            return {
                    msg: end(ofRandom([
                    `Logged in! Welcome ${username}`,
                    `Success! You're logged in, ${username}`
                ])),
                emote: AIEmoteType.SUCCESS
            };
        } else if (resp.status === 409) {
            return {
                msg: end(ofRandom([
                    `The username "${username}" is already taken. Please choose a different name.`,
                    "That username is unavailable. Please pick a different name"
                ])),
                emote: AIEmoteType.ERROR
            };
        } else {
            return end(ofRandom([
                "An error occurred during registration. Please try again later.",
                "Registration failed. Try again in a moment"
            ]));
        }
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createRegisterSubAgent;