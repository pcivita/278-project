import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MonoText } from "./StyledText";
import Colors from "@/constants/Colors";

interface AlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  useMono?: boolean;
  useUltra?: boolean;
  useMedium?: boolean;
}

const Alert: React.FC<AlertProps> = ({ visible, message, onClose, useUltra, useMedium }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <MonoText style={styles.alertText} useUltra={useUltra} useMedium={useMedium}>
            {message}
          </MonoText>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  alertBox: {
    marginTop: 120,
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 10,
    backgroundColor: Colors.color2.dark,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Alert;
