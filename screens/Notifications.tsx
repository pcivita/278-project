import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import NotificationItem from "../components/NotificationItem";
import { supabase } from "@/utils/supabase";
import { FriendRequest } from "@/utils/interfaces";
import { useUser } from "@/UserContext";

const formatDate = (date) => {
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
  const [friendRequestsByDate, setFriendRequestsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("user_accepted", userId);

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      const fetchUserNames = async (requests) => {
        const updatedRequests = await Promise.all(
          requests.map(async (request) => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name, photo") // Include photo URL
              .eq("id", request.user_requested)
              .single();

            if (userError) {
              console.error(userError);
              return {
                ...request,
                userName: "Unknown",
                profilePictureUrl: null,
              };
            }

            return {
              ...request,
              userName: userData.name,
              profilePictureUrl: userData.photo,
            };
          })
        );

        const groupedRequests = updatedRequests.reduce((acc, request) => {
          const date = formatDate(new Date(request.created_at));
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(request);
          return acc;
        }, {});

        setFriendRequestsByDate(groupedRequests);
        setLoading(false);
      };

      fetchUserNames(data);
    };

    fetchFriendRequests();

    const subscription = supabase
      .channel("friends")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user_accepted === userId) {
            const fetchUserName = async () => {
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("name, photo") // Include photo URL
                .eq("id", payload.new.user_requested)
                .single();

              const userName = userError ? "Unknown" : userData.name;
              const profilePictureUrl = userError ? null : userData.photo;

              const date = formatDate(new Date(payload.new.created_at));
              setFriendRequestsByDate((prevRequests) => {
                const updatedRequests = { ...prevRequests };
                if (!updatedRequests[date]) {
                  updatedRequests[date] = [];
                }
                updatedRequests[date].push({
                  ...payload.new,
                  userName,
                  profilePictureUrl,
                });
                return updatedRequests;
              });
            };

            fetchUserName();
          }
        }
      )
      .subscribe();

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

  const isEmpty = Object.keys(friendRequestsByDate).length === 0;

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        {isEmpty ? (
          <Text>No Notifications</Text>
        ) : (
          Object.keys(friendRequestsByDate).map((date) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {friendRequestsByDate[date].map((request) => (
                <NotificationItem
                  type={"friend_request"}
                  message={request.userName + " wants to be your friend."}
                  requestId={request.id}
                  key={request.id}
                  profilePictureUrl={request.profilePictureUrl} // Pass profile picture URL
                  time={request.created_at}
                />
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
  },
  container: {},
  dateHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default NotificationsScreen;
