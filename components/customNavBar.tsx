// I checked and this file doesn't do anything -Defne
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Define an interface for your component's props
interface CustomNavigationBarProps extends BottomTabBarProps {
  activeTab: string;  // Additional props can be defined here
}

const CustomNavigationBar: React.FC<CustomNavigationBarProps> = ({ navigation, activeTab }) => {
  const homeActive = require('../icons/active/home_active.png');
  const homeInactive = require('../icons/inactive/home_inactive.png');
  const calendarActive = require('../icons/active/calendar_active.png');
  const calendarInactive = require('../icons/inactive/calendar_inactive.png');
  const notificationsActive = require('../icons/active/notifications_active.png');
  const notificationsInactive = require('../icons/inactive/notifications_inactive.png');
  const profileActive = require('../icons/active/profile_active.png');
  const profileInactive = require('../icons/inactive/profile_inactive.png');
  const plusIcon = require('../assets/icons/plus_icon.png');

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={activeTab === 'Home' ? homeActive : homeInactive} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
        <Image source={activeTab === 'Calendar' ? calendarActive : calendarInactive} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Add')}>
        <Image source={plusIcon} style={styles.iconBig} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Image source={activeTab === 'Notifications' ? notificationsActive : notificationsInactive} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={activeTab === 'Profile' ? profileActive : profileInactive} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  icon: {
    width: 25,
    height: 25
  },
  iconBig: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
});

export default CustomNavigationBar;
