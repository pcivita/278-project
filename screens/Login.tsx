// LoginScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => navigation.replace("Main")} />
    </View>
  );
};

export default Login;
