import React, { useCallback } from "react";
import { ContainerCard, ContainerCardStatus, ContainerIconCard, TextTitleCard } from "./style";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { useQuery } from "@apollo/client";
import { VISITS_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const CardVisits = () => {
  const { filter } = userContext();
  const { data, loading } = useQuery(VISITS_QUERY, {
    variables: {
      filter: { 
        ...filter, 
        dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
        user_id: filter?.user_id || undefined, // Corrigido para user_id
      },
    },
    fetchPolicy: 'network-only',
  });

  const visits = data?.countVisitsDash || {};

  console.log(visits, 'visits')
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
                  borderColor: 'rgb(255, 187, 40)',
                  paddingHorizontal: 10, // Equivalente ao paddingX="10px"
                  paddingVertical: 9, // Equivalente ao paddingY="9px"
                  height: 78, // Equivalente ao h="78px"
                  backgroundColor: '#FFF8F4',
                }}
              >
                <Text style={{
                  fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: "rgb(255, 187, 40)"
                }}
                >
                  {visits.count_visits_in_progress ? visits.count_visits_in_progress : '0'}
                </Text>
                <Text
                  style={{
                    color: "rgb(255, 187, 40)",
                    fontSize: 11,
                    textAlign: "center"
                  }}
                >
                  Em progresso
                </Text>
               
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgb(0, 136, 254)',
                  paddingHorizontal: 10, // Equivalente ao paddingX
                  paddingVertical: 9, // Equivalente ao paddingY
                  height: 78,
                  backgroundColor: '#f2f6ffff',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "rgb(0, 136, 254)",
                  }}
                >
                  {visits.count_visits_pendent ? visits.count_visits_pendent : '0'}
                </Text>
                <Text
                  style={{
                    color: "rgb(0, 136, 254)",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Pendentes
                </Text>
                
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgb(0, 196, 159)',
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
                    color: "rgb(0, 196, 159)",
                  }}
                >
                  {visits.count_visits_complete ? visits.count_visits_complete : '0'}
                </Text>
                <Text
                  style={{
                    color: "rgb(0, 196, 159)",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Concluídas
                </Text>
               
              </View>
              <View
                style={{
                  justifyContent: 'center', // Centraliza verticalmente
                  alignItems: 'center', // Centraliza horizontalmente
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgb(255, 128, 66)',
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
                    color: "rgb(255, 128, 66)",
                  }}
                >
                  {visits.count_visits_justify ? visits.count_visits_justify : '0'}
                </Text>
                <Text
                  style={{
                    color: "rgb(255, 128, 66)",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Justificadas
                </Text>
              
              </View>
            </View>
          </ScrollView>
        </ContainerCardStatus>
      }
    </ContainerCard>
  );
};
