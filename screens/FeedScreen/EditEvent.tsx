import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EditEventProps } from './FeedStack';

const EditEvent = ({ route }: EditEventProps) => {
  const navigation = useNavigation();

  const deleteEvent = async () => {
    try {
      // Your delete event logic here
      Alert.alert("Event deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    console.log("done")
  );
};

export default EditEvent;
