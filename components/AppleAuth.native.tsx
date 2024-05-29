import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/utils/supabase";
import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export function Auth({ navigation, signup = false }) {
  if (Platform.OS === "ios")
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={signup ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={20}
        style={styles.appleButton}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            console.log("credential", credential);
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              console.log(JSON.stringify({ error, user }, null, 2));
              if (!error) {
                // User is signed in.
                console.log(
                  "Checked and User is Already Signed in - .native.tsx"
                );
                navigation.replace("Main");
              }
            } else {
              throw new Error("No identityToken.");
            }
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    );
  return <>{/* Implement Android Auth options. */}</>;
}


const styles = StyleSheet.create({
  appleButton: {
    width: windowWidth * 0.8,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#9AA899",
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
  },
});