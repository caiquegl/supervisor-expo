import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import { Box, Center, Divider, Flex, HStack, Spinner, Text, VStack } from "native-base";
import Icon from 'react-native-vector-icons/Feather'
import IconFa from 'react-native-vector-icons/FontAwesome'
import Phone from '../../assets/icon/phone-gray.svg'
import { TouchableOpacity, ScrollView, View, Linking } from 'react-native'
import { CardOnOff } from "../CardOnOff";
import { userContext } from "../../context/userContext";
import { useQuery } from "@apollo/client";
import { LIST_PROMOTER_QUERY, ON_OFF_QUERY } from "../../context/querys";
import { DonutChart } from "../DonutChart";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import Eye from '../../assets/icon/eye.svg'
// Componente de item individual memoizado para evitar re-renderizações desnecessárias
const PromoterItem = memo(({ item, onPress }: { item: any; onPress: () => void }) => {
  const chartData = [
    { x: "Concluídas", y: item?.visits_complete || 0 },
    { x: "Em Andamento", y: item?.visits_in_progress || 0 },
    { x: "Pendente", y: item?.visits_pendent || 0 },
    { x: "Justificado", y: item?.visits_justify || 0 }
  ];

  const totalVisits = (item?.visits_complete || 0) + (item?.visits_pendent || 0) +
    (item?.visits_in_progress || 0) + (item?.visits_justify || 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        bg="#fff"
        borderRadius="16px"
        padding="20px"
        marginBottom="16px"
        shadow={2}
        borderWidth="1px"
        borderColor="#E5E7EB"
        position="relative"
      >
        {/* Header com nome e status */}
        <Flex direction="row" alignItems="center" justifyContent="space-between" mb="16px">
          <Flex direction="row" alignItems="center" flex={1}>
            <Center
              borderRadius="full"
              bg="#6600CC"
              w="40px"
              h="40px"
              alignItems="center"
              justifyContent="center"
              mr="12px"
            >
              <HStack alignItems="center" justifyContent="space-between" direction="row">

                <Text fontSize="18px" color="#fff" fontWeight="bold">
                  {item?.name ? item?.name.charAt(0).toUpperCase() : ''}
                </Text>

              </HStack>
            </Center>
            <Box flex={1}>
              <HStack alignItems="center" justifyContent="space-between" direction="row">
                <Text
                  fontSize="16px"
                  fontWeight="bold"
                  color="#2E2F34"
                  numberOfLines={1}
                >
                  {item?.name ? (
                    item.name.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
                  ) : ''}
                </Text>
                {/* <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    position: 'absolute',
                    right: 25,
                    backgroundColor: (item?.visits_complete > 0 || item?.visits_in_progress > 0) ? '#22C55E' : '#EF4444',
                  }}
                /> */}
              </HStack>
              <Text fontSize="12px" color="#666" mt="2px">
                {item?.team_name || 'Sem equipe'}
              </Text>
            </Box>

          </Flex>

          {/* <View style={{ position: 'absolute', right: -10, top: -15 }}>

            <Eye width={20} height={20} />
          </View> */}
        </Flex>

        {/* Informações de horário */}
        <Flex direction="row" justifyContent="space-between" mb="16px">
          <Box alignItems="center">
            <Text fontSize="10px" color="#666" mb="2px">Prim. Entrada</Text>
            <Text fontSize="12px" color="#2E2F34" fontWeight="500">
              {item?.first_check_in || '-'}
            </Text>
          </Box>

          {item?.time_in_lunch && (
            <Box alignItems="center">
              <Text fontSize="10px" color="#666" mb="2px">Intervalo</Text>
              <Text fontSize="12px" color="#2E2F34" fontWeight="500">
                {item?.time_in_lunch}
              </Text>
            </Box>
          )}

          <Box alignItems="center">
            <Text fontSize="10px" color="#666" mb="2px">Últ. Saída</Text>
            <Text fontSize="12px" color="#2E2F34" fontWeight="500">
              {item?.last_check_in || '-'}
            </Text>
          </Box>
        </Flex>

        {/* Gráfico de Donut e Legenda */}
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          {/* Gráfico Donut */}
          <Box>
            <DonutChart
              name={item.name}
              data={chartData}
              width={120}
              height={120}
              innerRadius={40}
              colorScale={["#00C49F", "#FFBB28", "#0088FE", "#FF8042"]}
              style={{
                labels: {
                  fill: 'white',
                  fontSize: 0
                },
              }}
            />
          </Box>

          {/* Legenda */}
          <VStack space="8px" flex={1} ml="20px">
            <HStack space="8px" alignItems="center">
              <Box borderRadius="full" w="8px" h="8px" bg="#00C49F" />
              <Text fontSize="11px" color="#2E2F34" fontWeight="500">
                {item?.visits_complete || 0} Concluídas
              </Text>
            </HStack>
            <HStack space="8px" alignItems="center">
              <Box borderRadius="full" w="8px" h="8px" bg="#FFBB28" />
              <Text fontSize="11px" color="#2E2F34" fontWeight="500">
                {item?.visits_in_progress || 0} Em Andamento
              </Text>
            </HStack>
            <HStack space="8px" alignItems="center">
              <Box borderRadius="full" w="8px" h="8px" bg="#0088FE" />
              <Text fontSize="11px" color="#2E2F34" fontWeight="500">
                {item?.visits_pendent || 0} Pendente
              </Text>
            </HStack>
            <HStack space="8px" alignItems="center">
              <Box borderRadius="full" w="8px" h="8px" bg="#FF8042" />
              <Text fontSize="11px" color="#2E2F34" fontWeight="500">
                {item?.visits_justify || 0} Justificado
              </Text>
            </HStack>
          </VStack>
        </Flex>

        {/* Botões de ação */}
        <HStack mt="16px" space="12px" justifyContent="center">
          <Center
            borderRadius="12px"
            bg="#F1F1F1"
            w="40px"
            h="40px"
          >
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
              <Phone width={20} height={20} />
            </TouchableOpacity>
          </Center>
          <Center
            borderRadius="12px"
            bg="#C7FDE2"
            w="40px"
            h="40px"
          >
            <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${item.phone.replace(/\D/g, '')}`)}>
              <IconFa name="whatsapp" size={20} style={{ color: '#00B259' }} />
            </TouchableOpacity>
          </Center>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
});

const PromoterItemComponent = ({ loadingOnOff }: { loadingOnOff: boolean }) => {
  const { filter, setSelectedPromoter } = userContext();
  const [skip, setSkip] = useState(0);
  const [promoters, setPromoters] = useState<any[]>([]);

  // Query com filtros atualizados incluindo promotor
  const { data, loading, fetchMore, error, refetch } = useQuery(LIST_PROMOTER_QUERY, {
    variables: {
      filter: {
        ...filter,
        dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
        promoter_id: filter?.promoter_id || undefined, // Adiciona filtro de promotor
      },
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  // Efeito para limpar dados quando filtros mudarem
  useEffect(() => {
    if (data?.listPromoters) {
      setPromoters(prev => {
        const ids = new Set(prev.map(v => v.id));
        const newPromoters = data.listPromoters.filter((v: any) => !ids.has(v.id));
        return [...prev, ...newPromoters];
      });
    }
  }, [data]);

  // Efeito para refazer a requisição quando filtros mudarem
  useEffect(() => {
    // Reseta o estado local quando filtros mudarem
    setSkip(0);
    setPromoters([]);

    // Refaz a requisição com os novos filtros
    if (refetch) {
      refetch({
        filter: {
          ...filter,
          dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
          user_id: filter?.user_id || undefined,
        },
      });
    }
  }, [filter?.dt_visit, filter?.user_id, refetch]); // Dependências específicas dos filtros

  useFocusEffect(
    useCallback(() => {
      setSkip(0);
      setPromoters([]);
    }, [filter])
  );

  const handleLoadMore = useCallback(() => {
    const newSkip = skip + 9;
    setSkip(newSkip);
    fetchMore({
      variables: {
        filter: {
          ...filter,
          dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
          user_id: filter?.user_id || undefined, // Corrigido para user_id
          offset: newSkip
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.listPromoters) return prev;
        const prevIds = new Set((prev?.listPromoters || []).map((v: any) => v.id));
        const merged = [
          ...(prev?.listPromoters || []),
          ...(fetchMoreResult.listPromoters.filter((v: any) => !prevIds.has(v.id)))
        ];
        setPromoters(merged);
        return { ...prev, listPromoters: merged };
      }
    });
  }, [fetchMore, filter, skip]);

  const handlePromoterPress = useCallback((item: any) => {
    setSelectedPromoter(item);
    router.push("/(main)/PromoterDetail");
  }, [setSelectedPromoter]);

  const uniquePromoters = useMemo(() => {
    const seen = new Set();
    return promoters.filter((promoter: any) => {
      const duplicate = seen.has(promoter.id);
      seen.add(promoter.id);
      return !duplicate;
    });
  }, [promoters]);

  // Separar promotores em online e offline
  const { onlinePromoters, offlinePromoters } = useMemo(() => {
    const online = uniquePromoters.filter((promoter: any) =>
      (promoter?.visits_complete > 0 || promoter?.visits_in_progress > 0)
    );
    const offline = uniquePromoters.filter((promoter: any) =>
      !(promoter?.visits_complete > 0 || promoter?.visits_in_progress > 0)
    );
    return { onlinePromoters: online, offlinePromoters: offline };
  }, [uniquePromoters]);

  return (
    <Box>
      {/* Seção de Promotores Online */}
      {onlinePromoters.length > 0 && (
        <>
          <Text fontSize="18px" fontWeight="bold" mb="15px" mt="15px" color="#2E2F34">
            Equipe disponível (Online)
          </Text>
          {onlinePromoters.map((item: any, key: any) => (
            <PromoterItem
              key={`online-${item.id}-${key}`}
              item={item}
              onPress={() => handlePromoterPress(item)}
            />
          ))}
        </>
      )}

      {/* Seção de Promotores Offline */}
      {offlinePromoters.length > 0 && (
        <>
          <Text fontSize="18px" fontWeight="bold" mb="30px" mt="30px" color="#2E2F34">
            Equipe indisponível (Offline)
          </Text>
          {offlinePromoters.map((item: any, key: any) => (
            <PromoterItem
              key={`offline-${item.id}-${key}`}
              item={item}
              onPress={() => handlePromoterPress(item)}
            />
          ))}
        </>
      )}

      {loadingOnOff ? (
        <></>
      ) : (
        <TouchableOpacity onPress={handleLoadMore}>
          <Center mb="100px">
            <Text fontSize="16px" color="#9933ff" fontWeight="bold">Carregar Mais</Text>
          </Center>
        </TouchableOpacity>
      )}
    </Box>
  )
}

// Componente principal memoizado
export const CardPromoterChart = memo(() => {

  const { data, loading, error } = useQuery(ON_OFF_QUERY, {
    variables: {
      filter: {
        dt_visit: new Date().toISOString().split('T')[0]
      }
    },
    fetchPolicy: 'network-only',
  });

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <ScrollView nestedScrollEnabled>
        <VStack space="20px" divider={<Divider />} >
          <CardOnOff data={data} loading={loading} error={error} />
        </VStack>

        <PromoterItemComponent loadingOnOff={loading} />
      </ScrollView>
    </Box>
  );
});