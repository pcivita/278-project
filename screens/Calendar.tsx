import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import FriendRequestButton from "@/components/FriendRequestButton";

const Calendar = () => {
  const [data, setData] = useState("hello");

 

  return (
    <View style={styles.container}>

      <Text>Calendar 123 Screen</Text>

      <FriendRequestButton
        userOneId="f207cd61-2d7f-4ccb-9130-de3aed61b921"
        userTwoId="fc720675-a19e-477f-8780-328b154a278a"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Calendar;
