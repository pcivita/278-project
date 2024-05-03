// NotificationItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NotificationItem = ({ type, message, time }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={require('../assets/icons/inactive/home_inactive.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      {type === 'friend_request' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  textContainer: {
    marginLeft: 10
  },
  message: {
    fontSize: 16
  },
  time: {
    fontSize: 12,
    color: 'gray'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonAccept: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    marginRight: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 12
  },
  buttonReject: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5
  }
});

export default NotificationItem;
