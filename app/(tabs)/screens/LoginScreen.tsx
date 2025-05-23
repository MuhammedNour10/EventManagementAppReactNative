import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, ImageBackground, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator 
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Store user data securely
  const saveUserData = async (userData) => {
    try {
      await SecureStore.setItemAsync('userToken', userData.token);
      await AsyncStorage.setItem('userId', userData.user.id.toString());
      await AsyncStorage.setItem('fullname', userData.user.fullName.toString());
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Error", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5196/api/auth/login', 
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        await saveUserData({ token, user });

        Alert.alert("✅ Success", `Welcome, ${user.fullName}!`);
        navigation.replace('Dashboard', { user });
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert("❌ Error", error.response?.data?.message || "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#8e44ad', '#3498db']}
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
          <Text style={styles.title}>Event Management Login</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
              autoCapitalize="none"
              placeholderTextColor="#fff"
              onFocus={() => setEmail('')}
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#fff"
              onFocus={() => setPassword('')}
            />
          </View>

          <Button 
            mode="contained" 
            style={styles.button} 
            onPress={handleLogin} 
            disabled={loading}
            contentStyle={styles.buttonContent}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : "Login"}
          </Button>

          <Button 
            mode="text" 
            style={styles.registerButton} 
            onPress={() => navigation.navigate("Register")}
            labelStyle={styles.registerButtonLabel}
          >
            Don't have an account? Register
          </Button>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%",
  },
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%", 
    paddingHorizontal: 30 
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 40, 
    textAlign: "center" 
  },
  inputContainer: { 
    width: "100%", 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: "rgba(255, 255, 255, 0.3)", 
    width: "100%", 
    marginBottom: 15, 
    borderRadius: 30, 
    paddingHorizontal: 15, 
    height: 50, 
    fontSize: 16, 
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    paddingLeft: 15
  },
  button: { 
    width: "100%", 
    height: 50, 
    borderRadius: 30, 
    backgroundColor: "#3498db", 
    marginBottom: 15, 
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonContent: { 
    height: 50, 
    justifyContent: "center",
  },
  registerButton: { 
    width: "100%", 
    marginTop: 10, 
    borderRadius: 30,
    backgroundColor: 'transparent'
  },
  registerButtonLabel: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});

export default LoginScreen;
