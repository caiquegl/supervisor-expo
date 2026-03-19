import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { ADD_INDUSTRY_MUTATION } from "../../context/querys";
import apiBackoffice from "../../service/apiBackoffice";

interface Industry {
  id: string | number;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  visitId: string;
  visitStatus: string;
  existingIndustries: Industry[];
  user: { token: string; slug: string; workspace_id: number };
  onIndustryAdded: (industry: Industry) => void;
}

export function AddIndustryModal({
  visible,
  onClose,
  visitId,
  visitStatus,
  existingIndustries,
  user,
  onIndustryAdded,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [addIndustryMutation, { loading: adding }] = useMutation(ADD_INDUSTRY_MUTATION);

  const handleClose = useCallback(() => {
    setSearchText("");
    setList([]);
    setSelectedIndustry(null);
    setShowConfirmation(false);
    onClose();
  }, [onClose]);

  const searchIndustries = useCallback(async (value: string) => {
    setSearchText(value);
    setLoadingSearch(true);
    try {
      apiBackoffice.defaults.headers.authorization = `Bearer ${user.token}`;
      apiBackoffice.defaults.headers.workspace = user.slug;
      apiBackoffice.defaults.headers.workspaceId = user.workspace_id;
      const { data } = await apiBackoffice.get(`/search/sub-workspaces?search=${value}`);
      setList(data);
    } catch {
      Alert.alert("Erro", "Erro ao buscar indústrias. Tente novamente.");
    } finally {
      setLoadingSearch(false);
    }
  }, [user]);

  const handleConfirm = useCallback(async () => {
    if (!selectedIndustry) return;
    try {
      const { data } = await addIndustryMutation({
        variables: {
          input: {
            visit_id: parseInt(visitId),
            sub_workspace_id: parseInt(selectedIndustry.value),
          },
        },
      });

      if (data?.addIndustry?.id) {
        onIndustryAdded({ id: selectedIndustry.value, name: selectedIndustry.label });
        Alert.alert(
          "Sucesso!",
          `Indústria "${selectedIndustry.label}" está sendo processada, em breve será adicionada à visita.`,
          [{ text: "OK", onPress: handleClose }]
        );
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao adicionar indústria. Tente novamente.");
    }
  }, [selectedIndustry, addIndustryMutation, visitId, onIndustryAdded, handleClose]);

  const isDisabled = visitStatus === "COMPLETE" || visitStatus === "JUSTIFIED";

  return (
    <>
      {/* Search Modal */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Adicionar Indústria</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {isDisabled ? (
              <View style={styles.disabledBox}>
                <Ionicons name="lock-closed" size={32} color="#ccc" />
                <Text style={styles.disabledText}>
                  Não é possível adicionar indústria pois a visita já está finalizada.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.label}>Pesquisar Indústria</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={searchText}
                    onChangeText={searchIndustries}
                    placeholder="Digite o nome da indústria..."
                    style={styles.input}
                  />
                </View>

                {loadingSearch && (
                  <View style={styles.center}>
                    <ActivityIndicator size="large" color="#6600CC" />
                    <Text style={styles.loadingText}>Buscando indústrias...</Text>
                  </View>
                )}

                {list.length > 0 && (
                  <View style={styles.list}>
                    <FlatList
                      data={list}
                      keyExtractor={(item) => item.value.toString()}
                      nestedScrollEnabled
                      style={{ flexGrow: 0 }}
                      renderItem={({ item }) => {
                        const alreadyAdded = existingIndustries.some((i) => i.id == item.value);
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (!alreadyAdded && !adding) {
                                setSelectedIndustry(item);
                                setShowConfirmation(true);
                              }
                            }}
                            disabled={alreadyAdded || adding}
                            style={[styles.listItem, alreadyAdded && styles.listItemDisabled]}
                          >
                            <View style={[styles.listBullet, alreadyAdded && styles.listBulletDisabled]}>
                              <Ionicons name={alreadyAdded ? "checkmark" : "business"} size={12} color="#fff" />
                            </View>
                            <Text style={[styles.listItemText, alreadyAdded && styles.listItemTextDisabled]}>
                              {item.label}
                            </Text>
                            {alreadyAdded && <Text style={styles.alreadyAdded}>Já adicionada</Text>}
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}

                {searchText.length > 0 && list.length === 0 && !loadingSearch && (
                  <View style={styles.center}>
                    <Ionicons name="search" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>
                      Nenhuma indústria encontrada para "{searchText}"
                    </Text>
                  </View>
                )}
              </>
            )}

            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmation} transparent animationType="fade" onRequestClose={() => setShowConfirmation(false)}>
        <View style={styles.overlay}>
          <View style={[styles.container, { maxHeight: undefined }]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Confirmar Adição</Text>
              <TouchableOpacity onPress={() => setShowConfirmation(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.confirmText}>
              Deseja adicionar a indústria{" "}
              <Text style={styles.confirmBold}>"{selectedIndustry?.label}"</Text>
              {" "}à esta visita?
            </Text>

            {adding && (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#6600CC" />
                <Text style={styles.loadingText}>Adicionando indústria...</Text>
              </View>
            )}

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setShowConfirmation(false)}
                disabled={adding}
                style={[styles.btnOutline, adding && styles.btnDisabled]}
              >
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={adding}
                style={[styles.btnPrimary, adding && styles.btnDisabled]}
              >
                <Text style={styles.btnPrimaryText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
  container: { backgroundColor: "#fff", borderRadius: 20, padding: 20, width: "95%", maxHeight: "80%", elevation: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2E2F34", flex: 1 },
  closeBtn: { padding: 5 },
  label: { fontSize: 16, fontWeight: "bold", color: "#2E2F34", marginBottom: 10 },
  inputWrapper: { borderWidth: 2, borderColor: "#8f8f8f", borderRadius: 10 },
  input: { padding: 12, color: "#2E2F34", fontSize: 16 },
  center: { alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, color: "#666" },
  emptyText: { marginTop: 10, color: "#666", textAlign: "center" },
  list: { maxHeight: 300, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", marginTop: 12 },
  listItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", flexDirection: "row", alignItems: "center" },
  listItemDisabled: { opacity: 0.5, backgroundColor: "#f5f5f5" },
  listBullet: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#6600CC", marginRight: 12, justifyContent: "center", alignItems: "center" },
  listBulletDisabled: { backgroundColor: "#ccc" },
  listItemText: { flex: 1, fontSize: 16, color: "#2E2F34" },
  listItemTextDisabled: { color: "#999" },
  alreadyAdded: { fontSize: 12, color: "#999", fontStyle: "italic" },
  cancelBtn: { marginTop: 20, height: 50, borderRadius: 18, borderWidth: 1, borderColor: "#6600CC", justifyContent: "center", alignItems: "center" },
  cancelText: { color: "#6600CC", fontSize: 16, fontWeight: "bold" },
  confirmText: { fontSize: 16, color: "#666", lineHeight: 24, textAlign: "center", marginBottom: 24 },
  confirmBold: { fontWeight: "bold", color: "#2E2F34" },
  row: { flexDirection: "row", gap: 12 },
  btnOutline: { flex: 1, height: 50, borderRadius: 18, borderWidth: 1, borderColor: "#ccc", justifyContent: "center", alignItems: "center" },
  btnOutlineText: { color: "#666", fontSize: 16, fontWeight: "bold" },
  btnPrimary: { flex: 1, height: 50, borderRadius: 18, backgroundColor: "#6600CC", justifyContent: "center", alignItems: "center" },
  btnPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnDisabled: { opacity: 0.5 },
  disabledBox: { alignItems: "center", padding: 24, gap: 12 },
  disabledText: { color: "#888", textAlign: "center", fontSize: 14, fontStyle: "italic" },
});
