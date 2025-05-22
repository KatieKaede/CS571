import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import { Alert, Button, View, Text } from 'react-native';

const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const getChatrooms = async () => {
      const response = await fetch(
        "https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
          },
        }
      );
      const data = await response.json();
      setChatrooms(data);
    };
    getChatrooms();
  }, []);

  function handleLogin(username, pin) {
    if (!username || !pin) {
      Alert.alert("Incorrect login, please try again.");
      return;
    }

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
      },
      body: JSON.stringify({
        username: username,
        pin: pin
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Incorrect username or pin. Please try again.");
        }
        return res.json();
      })
      .then(data => {
        SecureStore.setItemAsync('jwt', data.token);
        SecureStore.setItemAsync('username', data.user.username);
        setIsLoggedIn(true);
        Alert.alert("Success", "You are now logged in!");
      })
      .catch(error => {
        // Handle login failure
        Alert.alert("Login Failed", error.message);
      });
  }

  function handleSignup(username, pin) {
    if (!username || !pin) {
      Alert.alert("Please enter both a username and a PIN");
      return;
    }

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
      },
      body: JSON.stringify({
        username: username,
        pin: pin
      })
    })
    .then(res => {
      if (res.status === 409) {
        throw new Error("Username is already taken.");
      }
      return res.json();
    })
    .then(data => {
      SecureStore.setItemAsync("jwt", data.token);
      setIsLoggedIn(true);
      Alert.alert("Success", "You are now registered and logged in!");
    })
    .catch(err => {
      Alert.alert("Registration Failed", err.message);
    });
  }

  const handleGuestLogin = async () => {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('username');
    setIsGuest(true);
    setIsLoggedIn(true);
    setCurrentUser(null);
  }

  const handleLogout = async () => {
      await SecureStore.deleteItemAsync('jwt');
      setIsLoggedIn(false);
      Alert.alert("You have been logged out.");
  };  

  const showLogoutScreen = () => {
    setShowLogoutConfirmation(true)
  };

  const confirmLogout = async () => {
    await handleLogout();
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
          {isGuest && (
            <ChatDrawer.Screen name="Registration" component={BadgerRegisterScreen} />
          )}
          {isGuest ? (
          <ChatDrawer.Screen name="Signup">
            {({ navigation }) => (
              <Button title="Signup" onPress={() => navigation.navigate('Registration')} />
            )}
          </ChatDrawer.Screen>
        ) : (
          <ChatDrawer.Screen name="Logout">
            {() => (
              <Button title="Logout" onPress={showLogoutScreen} />
            )}
          </ChatDrawer.Screen>
        )}
      </ChatDrawer.Navigator>

        {/* Show confirmation screen */}
        {showLogoutConfirmation && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text>Are you sure you want to logout?</Text>
            <Button title="Cancel" onPress={cancelLogout} />
            <Button title="Confirm Logout" onPress={confirmLogout} />
          </View>
        )}
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} handleGuestLogin={handleGuestLogin} setIsRegistering={setIsRegistering} />
  }
}