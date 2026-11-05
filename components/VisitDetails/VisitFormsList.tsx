import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { HStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { VISIT_INDUSTRY_TASK_QUERY } from "../../context/querys";

type VisitForm = {
  complete: boolean;
  form_name: string;
};

type Props = {
  visitId: number;
  /** Indústria da visita. Omita em ambiente exclusivo (sem indústrias). */
  subWorkspaceId?: number;
  title?: string;
};

export function VisitFormsList({ visitId, subWorkspaceId, title = "Formulários" }: Props) {
  const { data, loading, error, refetch } = useQuery<{ visitIndustryTask: VisitForm[] }>(
    VISIT_INDUSTRY_TASK_QUERY,
    {
      variables: {
        input: {
          visit_id: visitId,
          ...(subWorkspaceId != null && { sub_workspace_id: subWorkspaceId }),
        },
      },
      skip: !Number.isFinite(visitId),
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const forms = data?.visitIndustryTask ?? [];
  const showLoading = loading && forms.length === 0;

  return (
    <View style={{ backgroundColor: "#f8f9fa", padding: 10, borderRadius: 6, marginBottom: 4 }}>
      <HStack alignItems="center" space="8px" mb="8px">
        <Ionicons name="list" size={20} color="#6600CC" />
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>{title}</Text>
      </HStack>

      {showLoading && (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <ActivityIndicator size="large" color="#6600CC" />
          <Text style={{ marginTop: 10, color: "#666", fontSize: 14 }}>Carregando formulários...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Ionicons name="alert-circle" size={24} color="#dc3545" />
          <Text style={{ marginTop: 10, color: "#dc3545", fontSize: 14, textAlign: "center" }}>
            Erro ao carregar formulários
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{ marginTop: 10, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#6600CC", borderRadius: 6 }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showLoading && !error && forms.length === 0 && (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Ionicons name="document-text" size={24} color="#999" />
          <Text style={{ marginTop: 10, color: "#999", fontSize: 14, textAlign: "center" }}>
            Nenhum formulário encontrado
          </Text>
        </View>
      )}

      {!error &&
        forms.map((form, index) => (
          <View
            key={`${form.form_name}-${index}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#e0e0e0",
              backgroundColor: "#fff",
              borderRadius: 6,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: form.complete ? "#28a745" : "#007bff",
                marginRight: 12,
              }}
            />
            <Text style={{ flex: 1, fontSize: 15, color: "#333", fontWeight: form.complete ? "600" : "400" }}>
              {form.form_name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: form.complete ? "#28a745" : "#007bff",
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              {form.complete ? "Concluído" : "Pendente"}
            </Text>
          </View>
        ))}
    </View>
  );
}
