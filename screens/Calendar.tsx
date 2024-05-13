import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import FriendRequestButton from "@/components/FriendRequestButton";

const Calendar = () => {
  const [data, setData] = useState("hello");

  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  // const fetchEvents = async () => {
  //   try {
  //     const { data } = await supabase.auth.getUser();
  //     const userId = data.user?.id;

  //     // Fetch museum IDs the user follows
  //     const { data: museums, error: museumsError } = await supabase
  //       .from("user_follows_museums")
  //       .select("museum_id")
  //       .eq("user_id", userId);

  //     if (museumsError) throw new Error(museumsError.message);

  //     // Fetch exhibitions from these museums, including museum details
  //     const museumIds = museums.map((museum) => museum.museum_id);
  //     const { data: exhibitions, error: exhibitionsError } = await supabase
  //       .from("exhibitions")
  //       .select(
  //         `
  //         id,
  //         title,
  //         cover_photo_url,
  //         museum: museum_id (
  //           id,
  //           username,
  //           profilePhotoUrl
  //         )
  //       `
  //       )
  //       .in("museum_id", museumIds);

  //     if (exhibitionsError) throw new Error(exhibitionsError.message);

  //     setExhibitions(exhibitions);
  //     setLoading(false);
  //   } catch (err: any) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text>Click Me </Text>
      </TouchableOpacity>
      <Text>{data}</Text>
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
