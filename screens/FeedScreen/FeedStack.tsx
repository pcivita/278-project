import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "./Feed";
import EventDetails from "./EventDetails";
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
  };
}

const Stack = createNativeStackNavigator<FeedStackParamsList>();

export type FeedProps = NativeStackScreenProps<FeedStackParamsList, "Feed">; 
export type EventDetailsProps = NativeStackScreenProps<FeedStackParamsList, "EventDetails">; 

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
