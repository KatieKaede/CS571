import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [repeatPin, setRepeatPin] = useState("");

    const registerPress = () => {
        if (!pin || !repeatPin) {
            Alert.alert("Please enter a pin")
            return;
        }

        if (pin !== repeatPin) {
            Alert.alert("pins do not match")
            return;
        }

        if (pin.length !== 7) {
            Alert.alert("a pin must be 7 digits")
            return;
        }

        if (!username) {
            Alert.alert("Please enter a username");
            return;
        }

        props.handleSignup(username, pin);
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
        <TextInput
            style={styles.type}
            placeholder="Confirm Pin"
            keyboardType="number-pad"
            maxLength={7}
            secureTextEntry={true}
            value={repeatPin}
            onChangeText={setRepeatPin}
        />
            
        <Button color="crimson" title="Signup" onPress={registerPress} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;