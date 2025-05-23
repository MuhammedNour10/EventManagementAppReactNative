import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EventEditScreen = ({ route, navigation }) => {
  const { event } = route.params;

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(new Date(event.date));
  const [time, setTime] = useState(new Date(`1970-01-01T${event.time}`));

  const handleUpdate = async () => {
    if (!title || !description || !location) {
      return Alert.alert("⚠️ Validation", "Please fill in all fields.");
    }

    Alert.alert("Confirm", "Are you sure you want to update the event?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            const organizerId = await AsyncStorage.getItem("userId");

            const updatedEvent = {
              ...event,
              title,
              description,
              location,
              date,
              time: time.toTimeString().slice(0, 8),
              organizerId,
            };

            const response = await axios.put(
              `http://localhost:5196/api/Event/${event.id}`,
              updatedEvent,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 204) {
                Alert.alert("✅ Success", "Event updated successfully!");
                console.log(response.status)
              navigation.goBack();
            }
          } catch (error) {
            console.error("Update error:", error);
            Alert.alert("❌ Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Edit Your Event</Text>

        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          height={100}
        />
        <Input label="Location" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Date</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => selectedDate && setDate(selectedDate)}
        />

        <Text style={styles.label}>Time</Text>
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(e, selectedTime) => selectedTime && setTime(selectedTime)}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Reusable Input component
const Input = ({ label, value, onChangeText, multiline, height }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: height || 100 }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label.toLowerCase()}`}
      multiline={multiline}
    />
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f4f9ff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#0077cc",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#0077cc",
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    alignItems: "center",
    shadowColor: "#0077cc",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default EventEditScreen;
