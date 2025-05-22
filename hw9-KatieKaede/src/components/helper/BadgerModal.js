import React, { useState } from 'react';
import {Alert, Modal, StyleSheet, TextInput, Text, Button, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const BadgerModal = ({ isVisible, onClose, onCreatePost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const buttonDisabled = !title || !content;

    const handleCreatePost = () => {
        if (title && content) {
            onCreatePost(title, content);
            setTitle('');
            setContent('');
            onClose('');
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 300, padding: 20, borderWidth: 1 }}>
                    <Text>Create a Post</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                        placeholder="Post Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                        placeholder="Post Content"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />
                    <Button title="Cancel" onPress={onClose} />
                    <Button
                        title="Create Post"
                        onPress={handleCreatePost}
                        disabled={buttonDisabled}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default BadgerModal;