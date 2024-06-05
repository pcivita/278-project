import React from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedStack from './screens/FeedScreen/FeedStack';
import ProfileStack from './screens/ProfileScreen/ProfileStack';
import Calendar from './screens/Calendar';
import NotificationsScreen from './screens/Notifications';
import CreateEvent from './screens/CreateEvent';
import { MonoText } from './components/StyledText';
import Colors from './constants/Colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconStyle = { width: 30, height: 30 }; // Default icon size
          if (route.name === 'Create Event') {
            iconStyle = { width: 100, height: 100 }; // Larger icon for Create Event
          }
          switch (route.name) {
            case 'FeedTab':
              iconName = focused
                ? require('./assets/icons/active/home_active.png')
                : require('./assets/icons/inactive/home_inactive.png');
              break;
            case 'ProfileTab':
              iconName = focused
                ? require('./assets/icons/active/profile_active.png')
                : require('./assets/icons/inactive/profile_inactive.png');
              break;
            case 'Calendar':
              iconName = focused
                ? require('./assets/icons/active/calendar_active.png')
                : require('./assets/icons/inactive/calendar_inactive.png');
              break;
            case 'Notifications':
              iconName = focused
                ? require('./assets/icons/active/notif_active.png')
                : require('./assets/icons/inactive/notif_inactive.png');
              break;
            case 'Create Event':
              iconName = require('./assets/icons/plus_icon.png');
              break;
          }
          return (
            <View style={{ marginTop: route.name === 'Create Event' ? -15 : 0 }}>
              <Image source={iconName} style={iconStyle} resizeMode="contain" />
            </View>
          );
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: {
          padding: 10,
          height: 90, // Increased height
          backgroundColor: '#fff', // White background
          borderTopRightRadius: 20, // Rounded top corners
          borderTopLeftRadius: 20,
          position: 'absolute',
          bottom: 0, // Position above the bottom
          left: 10,
          right: 10, // Padding from the sides
          elevation: 20, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      })}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{ 
          tabBarLabel: ({ focused }) => (
            <MonoText useUltra={focused} style={{ fontSize: 14,  color: "black" }}>
              Home
            </MonoText>
          ),
          headerShown: false 
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarLabel: ({ focused }) => (
            <MonoText useUltra={focused} style={{ fontSize: 14,  color: "black" }}>
              Calendar
            </MonoText>
          ),
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              Calendar
            </MonoText>
          ),
        }}
      />
      <Tab.Screen
        name="Create Event"
        component={CreateEvent}
        options={{ 
          tabBarLabel: '',
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              Create Event
            </MonoText>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <MonoText useUltra={focused} style={{ fontSize: 14,  color: "black" }}>
              Notifs
            </MonoText>
          ),
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              Notifications
            </MonoText>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <MonoText useUltra={focused} style={{ fontSize: 14,  color: "black" }}>
              Profile
            </MonoText>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
