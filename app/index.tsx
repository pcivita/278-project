import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const onSignInPress = async () => {};

  const onSignUpPress = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>278 Woohoo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    padding: 20,
    backgroundColor: "purple",
  },
  header: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },
});

export default Page;
