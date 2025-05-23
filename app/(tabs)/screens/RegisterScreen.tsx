import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator 
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';



const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);




  // Handle register
  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("⚠️ Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5196/api/auth/register', 
        { firstName, lastName, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        

        Alert.alert("✅ Success signup", `Welcome, ${user.fullName}!`);
        navigation.replace('Login');
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      Alert.alert("❌ Error", error.response?.data?.message || "Server error occurred.");
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
          <Text style={styles.title}>Event Management Register</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#fff"
              onFocus={() => setFirstName('')}
            />

            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#fff"
              onFocus={() => setLastName('')}
            />

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
            onPress={handleRegister} 
            disabled={loading}
            contentStyle={styles.buttonContent}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : "Register"}
          </Button>

          <Button 
            mode="text" 
            style={styles.registerButton} 
            onPress={() => navigation.navigate("Login")}
            labelStyle={styles.registerButtonLabel}
          >
            Already have an account? Login
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

export default RegisterScreen;
