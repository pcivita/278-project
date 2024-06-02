import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "./Feed";
import EventDetails from "./EventDetails";
import EditEvent from "./EditEvent";
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
// import Friends from "./Friends";

type FeedStackParamsList = {
  Feed: undefined;
  EventDetails: {
    eventName: string;
    eventTime: string;
    location: string;
    host: string;
    signups: string;
    colorScheme: string;
    isUserHost: boolean;
    eventId: string;
  };
  EditEvent: undefined;
}

const Stack = createNativeStackNavigator<FeedStackParamsList>();

export type FeedProps = NativeStackScreenProps<FeedStackParamsList, "Feed">; 
export type EventDetailsProps = NativeStackScreenProps<FeedStackParamsList, "EventDetails">; 
export type EditEventProps = NativeStackScreenProps<FeedStackParamsList, "EditEvent">; 

function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "black"
      }}
    >
      <Stack.Screen 
        name="Feed" 
        component={Feed} 
        options={{ 
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Feed</MonoText>
        }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetails}
        options={{ 
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Event Details</MonoText>
        }}
      />
      <Stack.Screen 
        name="EditEvent" 
        component={EditEvent}
        options={{ 
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Edit Event</MonoText>
        }}
      />
    </Stack.Navigator>
  );
}

export default FeedStack;
