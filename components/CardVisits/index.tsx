import React, { useCallback } from "react";
import { ContainerCard, ContainerCardStatus, ContainerIconCard, TextTitleCard } from "./style";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { useQuery } from "@apollo/client";
import { VISITS_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { DonutChart } from "../DonutChart";
import { Box, Flex, HStack, VStack, Text } from "native-base";

export const CardVisits = () => {
  const { filter } = userContext();
  const { data, loading } = useQuery(VISITS_QUERY, {
    variables: {
      filter: { 
        ...filter, 
        dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
        user_id: filter?.user_id || undefined,
      },
    },
    fetchPolicy: 'network-only',
  });

  const visits = data?.countVisitsDash || {};

  // Dados para o gráfico de donuts
  const chartData = [
    { x: "Em Progresso", y: visits.count_visits_in_progress || 0 },
    { x: "Pendentes", y: visits.count_visits_pendent || 0 },
    { x: "Concluídas", y: visits.count_visits_complete || 0 },
    { x: "Justificadas", y: visits.count_visits_justify || 0 }
  ];

  return (
    <ContainerCard>
      <ContainerIconCard>
        <TextTitleCard>Status das Visitas</TextTitleCard>
      </ContainerIconCard>
      
      {loading ? (
        <ContainerCardStatus>
          <ActivityIndicator size="large" />
        </ContainerCardStatus>
      ) : (
        <ContainerCardStatus>
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            {/* Gráfico de Donut */}
            <Box>
              <DonutChart
                name="Visitas"
                data={chartData}
                width={150}
                height={150}
                innerRadius={50}
                colorScale={["#FFBB28", "#0088FE", "#00C49F", "#FF8042"]}
                style={{
                  labels: {
                    fill: 'white', 
                    fontSize: 0
                  },
                }}
              />
            </Box>

            {/* Legenda */}
            <VStack space="12px" flex={1} ml="20px">
              <HStack space="10px" alignItems="center">
                <Box borderRadius="full" w="10px" h="10px" bg="#FFBB28" />
                <Text fontSize="12px" color="#2E2F34" fontWeight="500">
                  {visits.count_visits_in_progress || 0} Em Progresso
                </Text>
              </HStack>
              <HStack space="10px" alignItems="center">
                <Box borderRadius="full" w="10px" h="10px" bg="#0088FE" />
                <Text fontSize="12px" color="#2E2F34" fontWeight="500">
                  {visits.count_visits_pendent || 0} Pendentes
                </Text>
              </HStack>
              <HStack space="10px" alignItems="center">
                <Box borderRadius="full" w="10px" h="10px" bg="#00C49F" />
                <Text fontSize="12px" color="#2E2F34" fontWeight="500">
                  {visits.count_visits_complete || 0} Concluídas
                </Text>
              </HStack>
              <HStack space="10px" alignItems="center">
                <Box borderRadius="full" w="10px" h="10px" bg="#FF8042" />
                <Text fontSize="12px" color="#2E2F34" fontWeight="500">
                  {visits.count_visits_justify || 0} Justificadas
                </Text>
              </HStack>
            </VStack>
          </Flex>
        </ContainerCardStatus>
      )}
    </ContainerCard>
  );
};
