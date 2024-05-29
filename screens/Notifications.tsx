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

const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(date);
  if (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  ) {
    return "Today";
  } else if (
    inputDate.getFullYear() === yesterday.getFullYear() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getDate() === yesterday.getDate()
  ) {
    return "Yesterday";
  } else {
    return inputDate.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
    });
  }
};

const NotificationsScreen = () => {
  const { userId } = useUser();
  const [friendRequestsByDate, setFriendRequestsByDate] = useState<{
    [key: string]: FriendRequest[];
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchFriendRequests = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select(
          `
          *,
          users: user_requested ( name )
        `
        )
        .eq("user_accepted", userId);

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        const groupedRequests = data.reduce((acc, request) => {
          const date = formatDate(new Date(request.created_at));
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(request);
          return acc;
        }, {});
        setFriendRequestsByDate(groupedRequests);
      }
      setLoading(false);
    };

    fetchFriendRequests();

    // Set up subscription
    const subscription = supabase
      .channel("friends")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user_accepted === userId) {
            const date = formatDate(new Date(payload.new.created_at));
            setFriendRequestsByDate((prevRequests) => {
              const updatedRequests = { ...prevRequests };
              if (!updatedRequests[date]) {
                updatedRequests[date] = [];
              }
              updatedRequests[date].push(payload.new);
              return updatedRequests;
            });
          }
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View>
        {Object.keys(friendRequestsByDate).map((date) => (
          <View key={date}>
            <Text style={{ fontSize: 24, marginTop: 20 }}>{date}</Text>
            {friendRequestsByDate[date].map((request) => (
              <NotificationItem
                type={"friend_request"}
                message={request.users.name + " wants to be your friend."}
                requestId={request.id}
                key={request.id}
              />
            ))}
          </View>
        ))}
      </View>

      {/* <View style={styles.section}>
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
      </View> */}
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
