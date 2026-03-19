import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";

type AlertType = "warning" | "error" | "info";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
}

const CONFIG: Record<AlertType, { icon: keyof typeof Ionicons.glyphMap; iconColor: string; bg: string; border: string }> = {
  warning: { icon: "warning", iconColor: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  error:   { icon: "close-circle", iconColor: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  info:    { icon: "information-circle", iconColor: "#6600CC", bg: "#F5F0FF", border: "#D8B4FE" },
};

export const CustomAlert = ({ visible, title, message, type = "warning", onClose }: Props) => {
  const { icon, iconColor, bg, border } = CONFIG[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor + "20" }]}>
            <Ionicons name={icon} size={32} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: iconColor }]} onPress={onClose}>
            <Text style={styles.btnText}>Entendi</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
