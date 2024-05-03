// NotificationsScreen.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import NotificationItem from '../components/NotificationItem';

const NotificationsScreen = () => {
  const notifications = [
    { id: 1, type: 'friend_request', message: 'Defne wants to be your friend.', time: '1h ago' },
    { id: 2, type: 'event_join', message: 'Defne joined your event Dish Hike.', time: '1h ago' },
    { id: 3, type: 'event_join', message: 'Defne and Annie joined your event Dish Hike.', time: '1h ago' },
    // More hardcoded notifications...
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} type={notification.type} message={notification.message} time={notification.time} />
        ))}
      </View>
      {/* You can add more sections for different days similarly */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  section: {
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5
  }
});

export default NotificationsScreen;
