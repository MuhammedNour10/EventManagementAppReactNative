import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./(tabs)/screens/LoginScreen";
import RegisterScreen from "./(tabs)/screens/RegisterScreen";
import DashboardScreen from "./(tabs)/screens/DashboardScreen";
import EventDetailScreen from "./(tabs)/screens/EventDetailScreen";
import HomeScreen from "./(tabs)/screens/HomeScreen";
import EventEditScreen from "./(tabs)/screens/EditEventScreen";
import CreateEventScreen from "./(tabs)/screens/CreateEventScreen";
import AttendanceScreen from "./(tabs)/screens/AttendanceScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="EventEditScreen" component={EventEditScreen} />
      <Stack.Screen name="CreateEventScreen" component={CreateEventScreen}/>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    
   
      <AppNavigator />
    
  );
}
