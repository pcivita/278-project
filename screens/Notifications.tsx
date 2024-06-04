import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
              .select("name")
              .eq("id", request.user_requested)
              .single();

            if (userError) {
              console.error(userError);
              return { ...request, userName: "Unknown" };
            }

            return { ...request, userName: userData.name };
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

    const handleInsert = (payload) => {
      if (payload.new.user_accepted === userId) {
        const fetchUserName = async () => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name")
            .eq("id", payload.new.user_requested)
            .single();

          const userName = userError ? "Unknown" : userData.name;

          const date = formatDate(new Date(payload.new.created_at));
          setFriendRequestsByDate((prevRequests) => {
            const updatedRequests = { ...prevRequests };
            if (!updatedRequests[date]) {
              updatedRequests[date] = [];
            }
            updatedRequests[date].push({
              ...payload.new,
              userName,
            });
            return updatedRequests;
          });
        };

        fetchUserName();
      }
    };

    const handleDelete = (payload) => {
      console.log("I deleted");
      setFriendRequestsByDate((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        console.log(payload);

        Object.keys(updatedRequests).forEach((date) => {
          updatedRequests[date] = updatedRequests[date].filter(
            (req) => req.id !== payload.old.id
          );
          if (updatedRequests[date].length === 0) {
            delete updatedRequests[date];
          }
        });

        return updatedRequests;
      });
    };
    const handleUpdate = (payload) => {
      console.log("I updated");
      setFriendRequestsByDate((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        console.log(payload);

        // Check if the updated request has a status of "Accepted"
        if (payload.new.status === "Friends") {
          Object.keys(updatedRequests).forEach((date) => {
            updatedRequests[date] = updatedRequests[date].filter(
              (req) => req.id !== payload.new.id
            );
            if (updatedRequests[date].length === 0) {
              delete updatedRequests[date];
            }
          });
        } else {
          // Update the request if needed
          Object.keys(updatedRequests).forEach((date) => {
            updatedRequests[date] = updatedRequests[date].map((req) => {
              if (req.id === payload.new.id) {
                return { ...req, ...payload.new };
              }
              return req;
            });
          });
        }

        return updatedRequests;
      });
    };
    const subscription = supabase
      .channel("friends")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        handleInsert
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "friends" },
        handleDelete
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "friends" },
        handleUpdate
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
          <View style={styles.noNotificationsContainer}>
            <Text style={styles.noNotificationsText}>No Notifications</Text>
            <TouchableOpacity
              style={styles.addFriendsButton}
              onPress={() => navigation.navigate("Friends")}
            >
              <Text style={styles.addFriendsButtonText}>Add Friends</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
  },
  container: {},
  dateHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "0%",
  },
  noNotificationsText: {
    color: "grey",
    fontSize: 16,
  },
  addFriendsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#9AA899",
    borderRadius: 5,
  },
  addFriendsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationsScreen;
