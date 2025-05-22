import { isLoggedIn, ofRandom } from "../Util";
import AIEmoteType from "../../components/chat/messages/AIEmoteType"

const createPostSubAgent = (end) => {

    const CS571_WITAI_ACCESS_TOKEN = "YKF2RVWP5PFDTAZZNXKZGG3YLWZBC5CH";
    let stage;
    let chatroom, title, content, confirm;


    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            if (promptData.entities["chatroom_type:chatroom_type"]) {
                chatroom = promptData.entities["chatroom_type:chatroom_type"][0].value;
                stage = "FOLLOWUP_TITLE";
                return ofRandom([
                    "Great! What should be the title of your post?",
                    "Alright, how would you like to title your post?"
                ]);
            } else {
                return end(ofRandom([
                    "You have to specify a chatroom to create a post.",
                    "Please provide a chatroom to put your post in."
                ]))
            }
        } else {
            return end(ofRandom([
                "You must be signed in to create a post.",
                "Please sign in before creating a post."
            ]));
        }
    };

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONTENT": return await handleFollowupContent(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    };

    const handleFollowupTitle = async (prompt) => {
        title = prompt;
        stage = "FOLLOWUP_CONTENT"
        return ofRandom([
            "Alright, and what should be the content of your post?",
            "Ok! What would you likle the content of the post to be?"
        ]);
    };

    const handleFollowupContent = async (prompt) => {
        content = prompt;
        stage = "FOLLOWUP_CONFIRM"
        return ofRandom([
            `Excellent! To confirm, you want to create this post titled "${title}" in "${chatroom}"?`,
            `Here's what I got, you want your post to be titled "${title}" in "${chatroom}"?`
        ]);
    };

    const handleFollowupConfirm = async (prompt) => {
        confirm = prompt;
        
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
            }
        });
        
        const data = await resp.json();

        if (data.intents.length > 0 && data.intents[0].name === 'wit$confirmation') {
            await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroom}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });
            return {
                msg: end(ofRandom([
                    "Your post has been successfully created!",
                    "Congrats! Your post is live!"
                ])),
                emote: AIEmoteType.SUCCESS
            };
        } else {
            return {
                msg: end(ofRandom([
                    "The post creation has been cancelled.",
                    "Your post was not successfully created."
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

export default createPostSubAgent;