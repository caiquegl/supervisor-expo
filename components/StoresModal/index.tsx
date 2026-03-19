import React from "react";
import { Modal as RNModal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Box, Divider, Flex, Spinner, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { IPropsPdvWithCheckIn } from "../../context/types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface StoresModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  color: string;
  icon: React.ReactNode;
  stores: IPropsPdvWithCheckIn[];
  loading: boolean;
  showTimes?: boolean;
  emptyMessage?: string;
  onPressItem?: (store: IPropsPdvWithCheckIn) => void;
}

export const StoresModal = ({
  visible,
  onClose,
  title,
  color,
  icon,
  stores,
  loading,
  showTimes = true,
  emptyMessage = "Nenhuma loja encontrada.",
  onPressItem,
}: StoresModalProps) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <Flex direction="row" alignItems="center" justifyContent="space-between" mb="16px">
            <Flex direction="row" alignItems="center" flex={1}>
              {icon}
              <Text ml="8px" fontWeight="700" fontSize="16px" color={color} numberOfLines={1} flex={1}>
                {title}
              </Text>
            </Flex>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text fontSize="24px" color="gray.400" lineHeight="28px">×</Text>
            </TouchableOpacity>
          </Flex>
          <Divider mb="8px" />
          {loading ? (
            <Flex flex={1} alignItems="center" justifyContent="center">
              <Spinner color="indigo.500" size="lg" />
            </Flex>
          ) : stores.length === 0 ? (
            <Flex flex={1} alignItems="center" justifyContent="center">
              <Text textAlign="center" color="gray.500">
                {emptyMessage}
              </Text>
            </Flex>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {stores.map((store, index) => (
                <Box key={store.id}>
                  <TouchableOpacity
                    activeOpacity={onPressItem ? 0.6 : 1}
                    onPress={() => onPressItem?.(store)}
                  >
                    <Flex direction="row" justifyContent="space-between" alignItems="center" py="10px">
                      <Flex direction="row" alignItems="center" flex={1} mr="8px">
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{getInitials(store.name)}</Text>
                        </View>
                        <Box flex={1} ml="10px">
                          <Text fontWeight="700" fontSize="14px" color="#2E2F34">
                            {store.name}
                          </Text>
                          {store.address ? (
                            <Text fontSize="12px" color="gray.500" numberOfLines={1}>
                              {store.address}
                            </Text>
                          ) : null}
                        </Box>
                      </Flex>
                      <Flex direction="row" alignItems="center">
                        {showTimes && (
                          <Box alignItems="flex-end" mr={onPressItem ? "10px" : "0px"}>
                            {store.first_check_in ? (
                              <Text fontSize="12px" color={color} fontWeight="600">
                                Entrada: {store.first_check_in}
                              </Text>
                            ) : null}
                            {store.last_check_out ? (
                              <Text fontSize="12px" color="gray.500">
                                Saída: {store.last_check_out}
                              </Text>
                            ) : null}
                          </Box>
                        )}
                        {onPressItem && (
                          <Ionicons name="eye" size={20} color={color} />
                        )}
                      </Flex>
                    </Flex>
                  </TouchableOpacity>
                  {index < stores.length - 1 && <Divider />}
                </Box>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    height: "60%",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8E0FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B21A8",
  },
});
