// LoginScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { Auth } from "@/components/AppleAuth.native";

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Auth navigation={navigation} />
      </View>
    </View>
  );
};

export default Login;
