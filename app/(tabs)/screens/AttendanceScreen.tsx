import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AttendanceScreen = () => {
  const route = useRoute();
  const { event } = route.params;
  const [userId, setUserId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id || !event?.id) return;

        setUserId(id);

        const response = await axios.get(
          `http://localhost:5196/api/RSVP/EventAttendees`,
          {
            headers: { 'Content-Type': 'application/json' },
            params: { eventId: event.id },
          }
        );

        const formattedAttendees = response.data.rsvPs.map((rsvp) => ({
          id: rsvp.user.id,
          fullName: rsvp.user.fullName,
          email: rsvp.user.email,
          status: rsvp.status,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rsvp.user.fullName)}&background=0D8ABC&color=fff`,
        }));

        setAttendees(formattedAttendees);
      } catch (error) {
        console.error('Error fetching attendance:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [event.id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Going':
        return { backgroundColor: '#2ecc71' };
      case 'Maybe':
        return { backgroundColor: '#f1c40f' };
      case 'NotGoing':
      default:
        return { backgroundColor: '#e74c3c' };
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.fullName || item.email}</Text>
          <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
            {item.status === 'Going'
              ? '✅ Going'
              : item.status === 'Maybe'
              ? '🤔 Maybe'
              : '❌ Not Going'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text style={styles.loadingText}>Loading attendees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Attendees for "{event.title}"</Text>
      {attendees.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png',
            }}
            style={styles.emptyImage}
          />
          <Text style={styles.noAttendees}>
            No attendees yet. Be the first to RSVP! 🎉
          </Text>
        </View>
      ) : (
        <FlatList
          data={attendees}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'flex-start',
    fontSize: 13,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.7,
  },
  noAttendees: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default AttendanceScreen;
