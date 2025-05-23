import  react from "react";
import { View, Text, StyleSheet, Image, StatusBar, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import myImage from "../../../assets/images/event3.jpg";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />

      <View style={styles.cardContainer}>

        {/* Gradient border around image */}
        <LinearGradient colors={["#fff", "#6a11cb"]} style={styles.imageWrapper}>
          <Image source={myImage} style={styles.logo} />
        </LinearGradient>

        <Text style={styles.title}>🎉 Event Management App 🎉</Text>

        <Text style={styles.subtitle}>
          Organize, manage, and attend events effortlessly!
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.loginButton}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            style={styles.registerButton}
            labelStyle={styles.registerLabel}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

// ⬇️ Improved styles
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    width: width * 0.9,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  imageWrapper: {
    padding: 4,
    borderRadius: 100,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonLabel: {
    fontSize: 16,
    color: "#2575fc",
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: "#fff",
    borderWidth: 2,
  },
  registerLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
