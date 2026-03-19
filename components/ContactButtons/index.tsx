import React, { useState } from "react";
import { TouchableOpacity, Linking } from "react-native";
import { Center, HStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { CustomAlert } from "../CustomAlert";

type PhoneStatus = "valid" | "empty" | "incomplete";

function getPhoneStatus(phone: string | null | undefined): PhoneStatus {
  if (!phone || phone.trim() === "") return "empty";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) return "empty";
  if (digits.length === 10 || digits.length === 11) return "valid";
  return "incomplete";
}

const ALERT_MESSAGES: Record<Exclude<PhoneStatus, "valid">, string> = {
  empty: "Número não cadastrado no Backoffice",
  incomplete: "Número incompleto no Backoffice",
};

interface Props {
  phone: string | null | undefined;
  compact?: boolean;
}

export const ContactButtons = ({ phone, compact = false }: Props) => {
  const status = getPhoneStatus(phone);
  const isValid = status === "valid";
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => setAlertVisible(true);

  const handleCall = () => {
    if (!isValid) { showAlert(); return; }
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    if (!isValid) { showAlert(); return; }
    Linking.openURL(`https://wa.me/${phone!.replace(/\D/g, "")}`);
  };

  const size = compact ? "32px" : "40px";
  const iconSize = compact ? 16 : 20;
  const topMargin = compact ? "0px" : "16px";

  return (
    <>
      <HStack mt={topMargin} space={compact ? "8px" : "12px"} justifyContent={compact ? "flex-start" : "center"}>
        <Center borderRadius="10px" bg={isValid ? "#EBF5FF" : "#F1F1F1"} w={size} h={size}>
          <TouchableOpacity onPress={handleCall}>
            <Ionicons name="call" size={iconSize} color={isValid ? "#0077CC" : "#AAAAAA"} />
          </TouchableOpacity>
        </Center>
        <Center borderRadius="10px" bg={isValid ? "#C7FDE2" : "#F1F1F1"} w={size} h={size}>
          <TouchableOpacity onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={iconSize} color={isValid ? "#00B259" : "#AAAAAA"} />
          </TouchableOpacity>
        </Center>
      </HStack>

      <CustomAlert
        visible={alertVisible}
        title="Atenção"
        message={ALERT_MESSAGES[status as Exclude<PhoneStatus, "valid">]}
        type="warning"
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
};
