import React, { memo } from "react";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { Box, Flex, Spinner, Text } from "native-base";
import UserCheck from '../../assets/icon/user-check.svg'
import UserTime from '../../assets/icon/user-times-red.svg'
import { useQuery } from "@apollo/client";
import { ON_OFF_QUERY } from "../../context/querys";
import { View } from "react-native";

export const CardOnOff = memo(({data, loading, error}: any) => {
 
  const onOff = data?.countPromoterDash || {};
  const isLoading = loading || !onOff || Object.keys(onOff).length === 0;
  
  const total = (onOff?.count_with_check_in || 0) + (onOff?.count_without_check_in || 0);
  const availablePercentage = total > 0 ? ((onOff?.count_with_check_in || 0) / total) * 100 : 0;
  const unavailablePercentage = total > 0 ? ((onOff?.count_without_check_in || 0) / total) * 100 : 0;

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingY="19px"
    >
      <Flex alignItems="center" justifyContent="space-between" direction="row">
        <Text color="#2e2f34" fontSize="18px" textTransform="uppercase" fontWeight="700">Status da Equipe</Text>
      </Flex>
      
      {isLoading ? (
        /* Loading do Status da Equipe */
        <Flex direction="column" alignItems="center" mt="20px" mb="20px">
          <Spinner color="indigo.500" size="sm" mb="10px" />
          <Text color="gray.500" fontSize="14px">
            Carregando informações...
          </Text>
        </Flex>
      ) : error ? (
        /* Erro do Status da Equipe */
        <Flex direction="column" alignItems="center" mt="20px" mb="20px">
          <Text color="red.500" fontSize="14px" textAlign="center">
            Erro ao carregar status da equipe
          </Text>
        </Flex>
      ) : (
        <>
          {/* Indicadores acima da barra */}
          <Flex direction="row" justifyContent="space-between" mt="20px" mb="10px">
            <Flex direction="row" alignItems="center">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#22C55E',
                  marginRight: 6,
                }}
              />
              <Text color="#2E2F34" fontSize="12px" fontWeight="500">
                Disponíveis: {onOff?.count_with_check_in || 0}
              </Text>
            </Flex>
            
            <Flex direction="row" alignItems="center">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#EF4444',
                  marginRight: 6,
                }}
              />
              <Text color="#2E2F34" fontSize="12px" fontWeight="500">
                Indisponíveis: {onOff?.count_without_check_in || 0}
              </Text>
            </Flex>
          </Flex>

          {/* Barra de Progresso Horizontal */}
          <Box mb="20px">
            <View
              style={{
                height: 10,
                backgroundColor: '#E5E7EB',
                borderRadius: 10,
                overflow: 'hidden',
                flexDirection: 'row',
              }}
            >
              {/* Parte Verde - Disponíveis */}
              <View
                style={{
                  width: `${availablePercentage}%`,
                  backgroundColor: '#22C55E',
                  height: '100%',
                }}
              />
              {/* Parte Vermelha - Indisponíveis */}
              <View
                style={{
                  width: `${unavailablePercentage}%`,
                  backgroundColor: '#EF4444',
                  height: '100%',
                }}
              />
            </View>
          </Box>
        </>
      )}
    </Box>
  );
});
