import React from "react";
import { Image, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./screens/Feed";
import Profile from "./screens/ProfileScreen/Profile";
import ProfileStack from "./screens/ProfileScreen/ProfileStack";
import Calendar from "./screens/Calendar";
import Notifications from "./screens/Notifications";
import CreateEvent from "./screens/CreateEvent";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconStyle = { width: 30, height: 30 }; // Default icon size
          if (route.name === "Create Event") {
            iconStyle = { width: 100, height: 100 }; // Larger icon for Create Event
          }
          switch (route.name) {
            case "Feed":
              iconName = focused
                ? require("./assets/icons/active/home_active.png")
                : require("./assets/icons/inactive/home_inactive.png");
              break;
            case "Profile":
              iconName = focused
                ? require("./assets/icons/active/profile_active.png")
                : require("./assets/icons/inactive/profile_inactive.png");
              break;
            case "Calendar":
              iconName = focused
                ? require("./assets/icons/active/calendar_active.png")
                : require("./assets/icons/inactive/calendar_inactive.png");
              break;
            case "Notifications":
              iconName = focused
                ? require("./assets/icons/active/notif_active.png")
                : require("./assets/icons/inactive/notif_inactive.png");
              break;
            case "Create Event":
              iconName = require("./assets/icons/plus_icon.png");
              break;
          }
          return (
            <View
              style={{ marginTop: route.name === "Create Event" ? -15 : 0 }}
            >
              <Image source={iconName} style={iconStyle} resizeMode="contain" />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          return route.name === "Create Event" ? null : (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "green" : "gray",
                marginBottom: 10, // Increased space between text and icon
              }}
            >
              {route.name}
            </Text>
          );
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          padding: 10,
          height: 90, // Increased height
          backgroundColor: "#fff", // White background
          borderTopRightRadius: 20, // Rounded top corners
          borderTopLeftRadius: 20,
          position: "absolute",
          bottom: 0, // Position above the bottom
          left: 10,
          right: 10, // Padding from the sides
          elevation: 20, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{ tabBarLabel: "Calendar" }}
      />
      <Tab.Screen
        name="Create Event"
        component={CreateEvent}
        options={{ tabBarLabel: "" }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{ tabBarLabel: "Notifications" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: "Profile", headerShown: false }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
