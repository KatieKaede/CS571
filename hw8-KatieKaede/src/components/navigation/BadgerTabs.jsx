import { Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import BadgerNewsStack from './BadgerNewsStack'
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen'

const Tab = createBottomTabNavigator();

function BadgerTabs(props) {
    return <>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen 
                    name="NewsStack" 
                    component={BadgerNewsStack} 
                />
                <Tab.Screen 
                    name="Preferences" 
                    component={BadgerPreferencesScreen} 
                />
        </Tab.Navigator>
    </>
}

export default BadgerTabs;