import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  FlatList,
} from "react-native";
import NotificationItem from "../components/NotificationItem";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { FriendRequest } from "@/utils/interfaces";
import { useUser } from "@/UserContext";

const NotificationsScreen = () => {
  const { userId } = useUser();
  const notificationsToday = [
    {
      id: 1,
      type: "friend_request",
      message: "Defne wants to be your friend.",
      time: "1h ago",
    },
    {
      id: 2,
      type: "event_join",
      message: "Defne joined your event Dish Hike.",
      time: "1h ago",
    },
    {
      id: 3,
      type: "event_join",
      message: "Defne and Annie joined your event Dish Hike.",
      time: "1h ago",
    },
  ];

  const notificationsYesterday = [
    {
      id: 4,
      type: "friend_request",
      message: "Defne accepted your friend request.",
      time: "1d ago",
    },
    {
      id: 5,
      type: "event_join",
      message: "Defne joined your event Dish Hike.",
      time: "1d ago",
    },
    {
      id: 6,
      type: "event_join",
      message: "Defne and Annie joined your event Dish Hike.",
      time: "1d ago",
    },
  ];

  const notificationsMay12 = [
    {
      id: 7,
      type: "friend_request",
      message: "Defne accepted your friend request.",
      time: "2d ago",
    },
    {
      id: 8,
      type: "event_join",
      message: "Defne joined your event Dish Hike.",
      time: "2d ago",
    },
    {
      id: 9,
      type: "event_join",
      message: "Defne and Annie joined your event Dish Hike.",
      time: "2d ago",
    },
  ];

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Fetch initial data
    const fetchFriendRequests = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("user_accepted", userId);

      if (error) {
        console.error(error);
      } else {
        setFriendRequests(data || []);
      }
    };

    fetchFriendRequests();

    // Set up subscription
    const subscription = supabase
      .channel("friends")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        (payload) => {
          console.log(
            "New friend request payload:",
            payload,
            "Crrent: ",
            userId
          );

          if (payload.new.user_accepted === userId) {
            console.log("RECEIVED");
            setFriendRequests((prevRequests) => [
              ...prevRequests,
              payload.new as FriendRequest,
            ]);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const renderItem: ListRenderItem<FriendRequest> = ({ item }) => (
    <View>
      <Text>Friend Request from: {item.user_requested}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        {notificationsToday.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            message={notification.message}
            time={notification.time}
          />
        ))}
      </View>
      <View>
        <Text>Requests (This Will Be Styled I promise) </Text>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YESTERDAY</Text>
        {notificationsYesterday.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            message={notification.message}
            time={notification.time}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MAY 12th</Text>
        {notificationsMay12.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            message={notification.message}
            time={notification.time}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add some padding at the bottom if needed
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default NotificationsScreen;
