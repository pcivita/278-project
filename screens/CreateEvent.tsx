import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { supabase } from "@/utils/supabase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./types"; // Adjust the path as needed
import { MonoText, MonoTextInput } from "@/components/StyledText";
import Colors from "@/constants/Colors";

const CreateEvent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [maxPeople, setMaxPeople] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventStartShow, setEventStartShow] = useState("");
  const [eventEndShow, setEventEndShow] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDateVisible, setIsEndDateVisible] = useState(false);

  function formatDateString(date: Date): string {
    const now: Date = new Date();
    const tomorrow: Date = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let dateString: string;

    if (isToday) {
      dateString = "Today";
    } else if (isTomorrow) {
      dateString = "Tomorrow";
    } else {
      const dateOptions: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
      };
      dateString = date.toLocaleDateString("en-US", dateOptions);
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const timeString: string = date
      .toLocaleTimeString("en-US", timeOptions)
      .replace(" ", "");

    return `${dateString} at ${timeString}`;
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showEndPicker = () => {
    setIsEndDateVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideEndPicker = () => {
    setIsEndDateVisible(false);
  };

  const handleConfirm = (date: any) => {
    // console.warn("A date has been picked: ", date);
    const dateString = formatDateString(date);
    setEventStart(date);
    setEventStartShow(dateString);
    hideDatePicker();
  };

  const handleEndConfirm = (date: any) => {
    // console.warn("A date has been picked: ", date);
    const dateString = formatDateString(date);
    setEventEnd(date);
    setEventEndShow(dateString);
    hideEndPicker();
  };

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data.user) {
        setCreatorId(data.user.id);
      }
    }
    fetchUser();
  }, []);

  const createEvent = async () => {

    if (!maxPeople || !eventName || !eventStart || !eventEnd || !location) {
      Alert.alert("Please fill in all fields");
      return;
    }

    console.log("Creating event");
    const { data, error } = await supabase.from("event").insert([
      {
        creator_id: creatorId,
        //group_id: "9bed5464-2dd3-4655-933c-eedfffb1a7dd",
        max_people: parseInt(maxPeople, 10),
        event_name: eventName,
        event_start: new Date(eventStart).toISOString(),
        event_end: new Date(eventEnd).toISOString(),
        location: location,
        description: description,
      },
    ]);
    if (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Error creating event");
    } else {
      console.log("Event created:", data);
      Alert.alert("Success", "Event created successfully", [
        {
          text: "OK",
          onPress: () => {
            // Reset form fields
            setMaxPeople("");
            setEventName("");
            setEventStart("");
            setEventEnd("");
            setEventStartShow("");
            setEventEndShow("");
            setLocation("");
            setDescription("");
            navigation.navigate("Feed"); // Navigate to Feed screen
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <MonoTextInput
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
      />
      <MonoTextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <MonoTextInput
        placeholder="Max People"
        value={maxPeople}
        onChangeText={setMaxPeople}
        keyboardType="numeric"
        style={styles.input}
      />
      <MonoTextInput
        placeholder="Notes"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity style={styles.date} onPress={showDatePicker}>
        <MonoText> Event Start </MonoText>
        <MonoText> {eventStartShow} </MonoText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.date} onPress={showEndPicker}>
        <MonoText> Event End </MonoText>
        <MonoText> {eventEndShow} </MonoText>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display="inline"
      />
      <DateTimePickerModal
        isVisible={isEndDateVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
        display="inline"
      />
      <TouchableOpacity onPress={createEvent} style={styles.button}>
        <MonoText useMedium={true} style={styles.buttonText}>Create Event</MonoText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  date: {
    width: "100%",
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: Colors.color2.dark,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateEvent;
