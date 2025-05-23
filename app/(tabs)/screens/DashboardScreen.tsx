import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const EventDashboardScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // Show loading indicator on refocus
          const storedUserId = await AsyncStorage.getItem("userId");
          const token = await AsyncStorage.getItem("userToken");
          if (!storedUserId || !token) {
            Alert.alert("Unauthorized", "Please log in again.");
            return;
          }

          const storedUsername = await AsyncStorage.getItem('fullname');
          
if (storedUsername) {
  
  setUserName(storedUsername);  // Use fullName instead of FullName if that's what you used in your backend
}
  
          setUserId(storedUserId);

          console.log("user name is:",username);
  
          const res = await axios.get("http://localhost:5196/api/Event", {
            headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}` },
            
          });
  
          setEvents(res.data);
        } catch (err) {
          console.error("Error loading events:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [])
  );
  

  const handleDelete = async (eventId) => {
    const token = await AsyncStorage.getItem("userToken");

    Alert.alert("Confirm Delete", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`http://localhost:5196/api/Event/${eventId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
          } catch (err) {
            console.error("Delete failed:", err);
            Alert.alert("Error", "Failed to delete event.");
          }
        },
      },
    ]);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const renderEvent = ({ item }) => {
    const isOwner = item.organizerId === userId;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2980b9" }]}
            onPress={() =>
              navigation.navigate("EventDetailScreen", { event: item })
            }
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          {isOwner && (
            <>
         

              <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#27ae60" }]}
                 onPress={() => navigation.navigate("EventEditScreen", { event: item })}
                 >
                <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>


              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#c0392b" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
     <Text style={styles.header}>
      Event Dashboard  { `- ${username}` }
      </Text>
      

      {events.length === 0 ? (
        <Text style={styles.noEvents}>No events available.</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(e) => e.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate("CreateEventScreen")}
      >
        <Text style={styles.createBtnText}>+ Create New Event</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#2c3e50",
  },
  noEvents: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#34495e",
  },
  date: {
    fontSize: 16,
    color: "#7f8c8d",
    marginVertical: 4,
  },
  location: {
    fontSize: 14,
    color: "#95a5a6",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createBtn: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
  },
  createBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
