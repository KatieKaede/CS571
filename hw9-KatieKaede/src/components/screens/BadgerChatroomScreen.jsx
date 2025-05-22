import { StyleSheet, View, Button, Alert, FlatList } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import BadgerModal from "../helper/BadgerModal";

function BadgerChatroomScreen(props) {
    const { name } = props; // Extract `name` directly from props
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [currentUser, setCurrentUser] = useState(null);

    const getCurrentUser = async () => {
        const username = await SecureStore.getItemAsync('username');
        if (username) {
            setCurrentUser(username);
        } else {
            setCurrentUser(null);
        }
    };

    const getMessages = async () => {
        try {
          const jwt = await SecureStore.getItemAsync("jwt");
          const response = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${name}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3",
              "Content-Type": "application/json"
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            setMessages(data.messages || []);
          } else {
            console.error(`Failed to fetch messages: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
    };

    const screenRefresh = async () => {
        setRefreshing(true);
        await getMessages();
        setRefreshing(false);
    }

    const createPost = async(title, content) => {
        if (currentUser == null) {
            Alert.alert('You must be logged in to create a post.');
            return; // Exit the function if the user is a guest
        }

        const jwt = await SecureStore.getItemAsync('jwt');
        const response = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${name}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatroom: name,
                title: title,
                content: content
            }),
        });

        if (response.ok) {
            Alert.alert('Your post was created!');
            setTitle('');
            setContent('')
            setIsModalVisible(false);
            getMessages();
        }
    };

    const deletePost = async (postId) => {
        const jwt = await SecureStore.getItemAsync('jwt');
        const response = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwt}`,
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3",
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            Alert.alert("Your post was deleted!");
            getMessages();
        }
    }
    useEffect(() => {
        getCurrentUser();
        getMessages();
    }, []);

    useEffect(() => {
        if (currentUser) {
            getMessages();
        }
    }, [currentUser]);

    return ( 
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <BadgerChatMessage 
                        {...item} 
                        owner={currentUser}
                        onDelete={deletePost}
                    />
                )}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                onRefresh={screenRefresh}
                refreshing={refreshing}
            />
            <Button title="Create Post" onPress={() => setIsModalVisible(true)}/>
            <BadgerModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreatePost={createPost}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerChatroomScreen;