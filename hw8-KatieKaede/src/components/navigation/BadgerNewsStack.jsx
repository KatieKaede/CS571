import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import BadgerNewsArticleScreen from '../screens/BadgerNewsArticleScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BadgerNewsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="News" 
                component={BadgerNewsScreen} 
            />
            <Stack.Screen 
                name="BadgerNewsArticleScreen" 
                component={BadgerNewsArticleScreen} 
                options={{ headerTitle: 'Article' }} 
            />
        </Stack.Navigator>
    );
}

export default BadgerNewsStack;