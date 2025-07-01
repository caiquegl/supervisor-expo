import React, { useCallback } from "react";
import { ContainerCard, ContainerCardStatus, ContainerIconCard, TextTitleCard } from "./style";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import Arrow from "../../assets/icon/arrow-growth.svg";
import { useQuery } from "@apollo/client";
import { VISITS_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const CardVisits = () => {
  const { filter } = userContext();
  const { data, loading } = useQuery(VISITS_QUERY, {
    variables: {
      filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10) },
    },
    fetchPolicy: 'network-only',
  });

  const visits = data?.countVisitsDash || {};

  return (
    <ContainerCard>
      <ContainerIconCard>
        <TextTitleCard>Visitas</TextTitleCard>
        <ElippseGray width={20} height={20} />
      </ContainerIconCard>
      {loading ? <ActivityIndicator size="large" /> :
        <ContainerCardStatus>
          <ScrollView horizontal={true} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
            <View
              style={{
                flexDirection: 'row', // Equivalente ao HStack
                gap: 20, // Equivalente ao space="20px"
                height: 100, // Equivalente ao h="100px"
              }}
            >
              <View
                style={{
                  justifyContent: 'center', // Equivalente ao Center
                  alignItems: 'center', // Equivalente ao Center
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FF6100',
                  paddingHorizontal: 10, // Equivalente ao paddingX="10px"
                  paddingVertical: 9, // Equivalente ao paddingY="9px"
                  height: 78, // Equivalente ao h="78px"
                  backgroundColor: '#FFF8F4',
                }}
              >
                <Text style={{
                  fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: "#FF6100"
                }}
                >
                  {visits.count_visits_in_progress ? visits.count_visits_in_progress : '0'}
                </Text>
                <Text
                  style={{
                    color: "#FF6100",
                    fontSize: 11,
                    textAlign: "center"
                  }}
                >
                  Em andamento
                </Text>
                <View
                  style={{
                    flexDirection: 'row', // Equivalente ao direction="row"
                    backgroundColor: '#FF6100',
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    padding: 3,
                    bottom: -11,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11 }}>
                    {visits.count_visits_in_progress && visits.count_visits_total ? (visits.count_visits_in_progress * 100 / visits.count_visits_total).toFixed(2).toString() : '0'}
                  </Text>
                  <Arrow width={10} height={6} />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FF0001',
                  paddingHorizontal: 10, // Equivalente ao paddingX
                  paddingVertical: 9, // Equivalente ao paddingY
                  height: 78,
                  backgroundColor: '#FFF2F2',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#FF0001",
                  }}
                >
                  {visits.count_visits_pendent ? visits.count_visits_pendent : '0'}
                </Text>
                <Text
                  style={{
                    color: "#FF0001",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Não concluídas
                </Text>
                <View
                  style={{
                    flexDirection: 'row', // Equivalente ao direction="row"
                    backgroundColor: '#FF0001',
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    padding: 3,
                    bottom: -11,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11 }}>
                    {visits.count_visits_pendent && visits.count_visits_total ? (visits.count_visits_pendent * 100 / visits.count_visits_total).toFixed(2).toString() : '0'}
                  </Text>
                  <Arrow width={10} height={6} />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#0AB200',
                  paddingHorizontal: 10, // Equivalente ao paddingX
                  paddingVertical: 9, // Equivalente ao paddingY
                  height: 78,
                  backgroundColor: '#F6FFF5',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#0AB200",
                  }}
                >
                  {visits.count_visits_complete ? visits.count_visits_complete : '0'}
                </Text>
                <Text
                  style={{
                    color: "#0AB200",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Concluído
                </Text>
                <View
                  style={{
                    flexDirection: 'row', // Equivalente ao direction="row"
                    backgroundColor: '#0AB200',
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    padding: 3,
                    bottom: -11,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11 }}>
                    {visits.count_visits_complete && visits.count_visits_total ? (visits.count_visits_complete * 100 / visits.count_visits_total).toFixed(2).toString() : '0'}
                  </Text>
                  <Arrow width={10} height={6} />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FFB300',
                  paddingHorizontal: 10, // Equivalente ao paddingX
                  paddingVertical: 9, // Equivalente ao paddingY
                  height: 78,
                  backgroundColor: '#FFF8F4',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#FFB300",
                  }}
                >
                  {visits.count_visits_pendent ? visits.count_visits_pendent : '0'}
                </Text>
                <Text
                  style={{
                    color: "#FFB300",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Pendente
                </Text>
                <View
                  style={{
                    flexDirection: 'row', // Equivalente ao direction="row"
                    backgroundColor: '#FFB300',
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    padding: 3,
                    bottom: -11,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11 }}>
                    {visits.count_visits_pendent && visits.count_visits_total ? (visits.count_visits_pendent * 100 / visits.count_visits_total).toFixed(2).toString() : '0'}
                  </Text>
                  <Arrow width={10} height={6} />
                </View>
              </View>
            </View>
          </ScrollView>
        </ContainerCardStatus>
      }
    </ContainerCard>
  );
};
