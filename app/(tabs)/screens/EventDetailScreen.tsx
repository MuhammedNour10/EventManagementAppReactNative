import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Modal
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const EventDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params;

  const [userId, setUserId] = useState(null);
  const [hasAttended, setHasAttended] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('going');
  const [showModal, setShowModal] = useState(false);

  // Dropdown picker
  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: 'Going', value: 'going' },
    { label: 'Maybe', value: 'Maybe' },
    { label: 'Not Going', value: 'NotGoing' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        try {
          const res = await axios.get('http://localhost:5196/api/RSVP/userAttendeesEvent', {
            params: { userId: id, eventId: event.id },
            headers: { 'Content-Type': 'application/json' },
          });
          setHasAttended(res.data);
        } catch (error) {
          console.error("Error checking attendance:", error);
        }
      }
    };

    fetchData();
  }, [event.id]);

  const handleConfirmRSVP = async () => {
    try {
      await axios.post(
        `http://localhost:5196/api/RSVP/AttendedEvent/${userId}/${event.id}/${rsvpStatus}`,
        { userId, eventId: event.id, status: rsvpStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('🎉 Thank you for RSVPing!');
      setHasAttended(true);
      setShowModal(false);
    } catch (error) {
      console.error("RSVP error:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isOrganizer = userId === event.organizerId;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.header}>
        <Text style={styles.headerTitle}>{event.title}</Text>
        <Text style={styles.headerDate}>{formatDate(event.date)} | {event.time}</Text>
      </LinearGradient>

      {/* Image */}
      <Image
        source={require('../../../assets/images/event4.jpg')}
        style={styles.eventImage}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>About this Event</Text>
        <Text style={styles.sectionText}>{event.description}</Text>

        {/* Organizer */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Organizer</Text>
          <Text style={styles.cardText}>{event.organizer.fullName}</Text>
          <Text style={styles.cardSubText}>📧 {event.organizer.email}</Text>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.cardSubText}>📍 {event.location}</Text>
        </View>

        {/* RSVP or Attended Message */}
        {isOrganizer ? (
          <Text style={styles.organizerInfo}>You are organizing this event.</Text>
        ) : hasAttended ? (
          <Text style={styles.attendedInfo}>✅ You have already attended this event!</Text>
        ) : (
          <TouchableOpacity style={styles.rsvpButton} onPress={() => setShowModal(true)}>
            <Text style={styles.buttonText}>🎟️ RSVP Now</Text>
          </TouchableOpacity>
        )}

        {/* Organizer can view attendance */}
        {isOrganizer && (
          <TouchableOpacity
            style={styles.attendanceButton}
            onPress={() => navigation.navigate('AttendanceScreen', { event })}
          >
            <Text style={styles.buttonText}>📋 View Attendance</Text>
          </TouchableOpacity>
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅ Back to Events</Text>
        </TouchableOpacity>
      </View>

      {/* RSVP Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Your RSVP Status</Text>

            <DropDownPicker
              open={openDropdown}
              value={rsvpStatus}
              items={items}
              setOpen={setOpenDropdown}
              setValue={setRsvpStatus}
              setItems={setItems}
              style={{ borderColor: '#ccc', borderRadius: 10 }}
              dropDownContainerStyle={{ borderColor: '#ccc', borderRadius: 10 }}
              containerStyle={{ marginBottom: 20 }}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRSVP}>
              <Text style={styles.buttonText}>✅ Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: 'red' }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: { fontSize: 28, color: 'white', fontWeight: 'bold' },
  headerDate: { fontSize: 16, color: 'white', marginTop: 8 },
  eventImage: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 15,
    marginVertical: 20,
  },
  content: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    elevation: 3,
  },
  cardText: { fontSize: 18, fontWeight: '600', marginTop: 5 },
  cardSubText: { fontSize: 16, color: '#777', marginTop: 3 },
  organizerInfo: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#27ae60',
  },
  attendedInfo: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  rsvpButton: {
    backgroundColor: '#ff7e5f',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  attendanceButton: {
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  backButton: { marginTop: 30, alignSelf: 'center' },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
    borderRadius: 10,
    margin: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
});
