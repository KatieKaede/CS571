import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from'react';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");

    const loginPress = () => {
        if (!username || !pin) {
            Alert.alert("Incorrect login, please try again.");
            return;
        }
        props.handleLogin(username, pin)
    };

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <TextInput
            style={styles.type}
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            style={styles.type}
            placeholder="PIN"
            keyboardType="number-pad"
            maxLength={7}
            secureTextEntry={true}
            value={pin}
            onChangeText={setPin}
        />
        <Button color="crimson" title="Login" onPress={loginPress}/>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button title="Continue as Guest" onPress={props.handleGuestLogin} />
    
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    type: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        width: '80%',
        paddingHorizontal: 10,
    },
});

export default BadgerLoginScreen;