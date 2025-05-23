import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CreateEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const handleCreate = async () => {
    if (!title || !description || !location) {
      Alert.alert("Missing Info", "Please fill in all the fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const organizerId = await AsyncStorage.getItem("userId");

      const formattedDate = date.toISOString();

      const newEvent = {
        title,
        description,
        location,
        date: formattedDate,
        time:time.toTimeString().split(" ")[0],
         organizerId,
      };
      
      console.log("New Event Data:", newEvent);

      
        
        console.log('user id is:',organizerId);

      const res = await axios.post("http://localhost:5196/api/Event", newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        params:{Title:title,description:description,location:location,date:formattedDate,time:time,organizerId:organizerId}
      });

      
      if (res.status === 201) {
        Alert.alert("✅ Success", "Event created successfully!");
        navigation.goBack(); // Go back to dashboard
      }
    } catch (err) {
        
        console.error("Create event error:", err);
        
      Alert.alert("❌ Error", "Failed to create event.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Event title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Event description"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Event location"
      />

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

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>➕ Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 6,
    marginTop: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#00b894",
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
