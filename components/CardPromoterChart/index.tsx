import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import { Box, Center, Divider, Flex, HStack, Spinner, Text, VStack } from "native-base";
import Eye from '../../assets/icon/eye.svg'
import Check from '../../assets/icon/check-circle.svg'
import Icon from 'react-native-vector-icons/Feather'
import IconFa from 'react-native-vector-icons/FontAwesome'
import Phone from '../../assets/icon/phone-gray.svg'
import { TouchableOpacity, ScrollView } from 'react-native'
import { CardOnOff } from "../CardOnOff";
import { userContext } from "../../context/userContext";
import { useQuery } from "@apollo/client";
import { LIST_PROMOTER_QUERY } from "../../context/querys";
import { DonutChart } from "../DonutChart";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <TouchableOpacity onPress={onPress}>
      <Box mt="15px" mb="15px">
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
        >
          <Center
            borderRadius="full"
            bg="#6600CC"
            w="35px"
            h="35px"
            alignItems="center"
            justifyContent="center"
            mr="10px"
          >
            <Text
              fontSize="20px"
              color="#fff"
            >
              {item?.name ? item?.name.charAt(0) : ''}
            </Text>
          </Center>
          <Box>
            <Text
              fontSize="16px"
              fontWeight="bold"
              color="#2E2F34"
            >
              {item?.name ? (
                item.name.length < 20 ? item.name : `${item.name.slice(0, 20)}...`
              ) : ''}
            </Text>
          </Box>
          <Eye width={25} height={25} />
        </Flex>

        <Flex
          direction="row"
          alignItems="center"
          mt="10px"
        >
          <Text
            fontSize="13px"
            fontWeight="bold"
            color="#4C4C4C"
            mr="5px"
          >
            Última Visita:
          </Text>
          <Text
            fontSize="13px"
            color="#4C4C4C"
            mr="5px"
          >
            {item?.last_visit || '-'}
          </Text>
          <Check width={20} height={20} />
        </Flex>
        <Flex
          direction="row"
          alignItems="center"
          mt="7px"
        >
          <Icon
            name="wifi"
            size={20}
            style={{ color: '#2E2F34' }}
          />
          <Text
            ml="7px"
            fontSize="13px"
            color="#4C4C4C"
          >
            {item?.sync_last_change || '-'}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" direction="row">
          <Flex
            direction="row"
            alignItems="center"
            mt="7px"
          >
            <Text
              fontSize="13px"
              fontWeight="bold"
              color="#4C4C4C"
              mr="5px"
            >
              Entrada:
            </Text>
            <Text
              ml="7px"
              fontSize="13px"
              color="#4C4C4C"
            >
              {item?.lunch_check_in || '-'}
            </Text>
          </Flex>

          <Flex
            direction="row"
            alignItems="center"
            mt="7px"
          >
            <Text
              fontSize="13px"
              fontWeight="bold"
              color="#4C4C4C"
              mr="5px"
            >
              Saída:
            </Text>
            <Text
              ml="7px"
              fontSize="13px"
              color="#4C4C4C"
            >
              {item?.lunch_check_out || '-'}
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction="row"
          alignItems="center"
          mt="7px"
        >
          <Text
            fontSize="13px"
            fontWeight="bold"
            color="#4C4C4C"
            mr="5px"
          >
            Intervalo total:
          </Text>
          <Text
            ml="7px"
            fontSize="13px"
            color="#4C4C4C"
          >
            {item?.time_in_lunch || '-'}
          </Text>
        </Flex>
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mt="20px"
        >
          <Text
            fontSize="13px"
            color="#303030"
            fontWeight="bold"
          >
            Visitas
          </Text>
          <Text
            fontSize="10px"
            color="#6600CC"
          >
            {item?.visits_complete || 0}/{totalVisits}
          </Text>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Box>
            <DonutChart
              name={item.name}
              data={chartData}
              width={150}
              height={150}
              innerRadius={50}
              colorScale={["#00C49F", "#FFBB28", "#0088FE", "#FF8042"]}
              style={{
                labels: {
                  fill: 'white', fontSize: 0
                },
              }}
            />
          </Box>
          <VStack space="10px" ml="-50px">
            <HStack space="10px" alignItems="center">
              <Box borderRadius="full" w="9px" h="9px" bg="#00C49F" />
              <Box>
                <Text fontSize="12px" color="#2E2F34" fontWeight="bold">
                  Concluídas
                </Text>
                <Text fontSize="12px" color="#2E2F34" >
                  {item?.visits_complete || 0}
                </Text>
              </Box>
            </HStack>
            <HStack space="10px" alignItems="center">
              <Box borderRadius="full" w="9px" h="9px" bg="#FFBB28" />
              <Box>
                <Text fontSize="12px" color="#2E2F34" fontWeight="bold">
                  Em Andamento
                </Text>
                <Text fontSize="12px" color="#2E2F34" >
                  {item?.visits_in_progress || 0}
                </Text>
              </Box>
            </HStack>
            <HStack space="10px" alignItems="center">
              <Box borderRadius="full" w="9px" h="9px" bg="#0088FE" />
              <Box>
                <Text fontSize="12px" color="#2E2F34" fontWeight="bold">
                  Pendente
                </Text>
                <Text fontSize="12px" color="#2E2F34" >
                  {item?.visits_pendent || 0}
                </Text>
              </Box>
            </HStack>
            <HStack space="10px" alignItems="center">
              <Box borderRadius="full" w="9px" h="9px" bg="#FF8042" />
              <Box>
                <Text fontSize="12px" color="#2E2F34" fontWeight="bold">
                  Justificado
                </Text>
                <Text fontSize="12px" color="#2E2F34" >
                  {item?.visits_justify || 0}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Flex>

        <HStack space="15px">
          <Center
            borderRadius="12px"
            bg="#F1F1F1"
            w="35px"
            h="35"
          >
            <Phone width={20} height={20} />
          </Center>
          <Center
            borderRadius="12px"
            bg="#C7FDE2"
            w="35px"
            h="35"
          >
            <IconFa name="whatsapp" size={20}
              style={{ color: '#00B259' }} />
          </Center>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
});

const PromoterItemComponent = () => {
  const { filter, setSelectedPromoter } = userContext();
  const [skip, setSkip] = useState(0);
  const [promoters, setPromoters] = useState<any[]>([]);


  const { data, loading, fetchMore, error } = useQuery(LIST_PROMOTER_QUERY, {
    variables: {
      filter: {
        ...filter,
        dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
      },
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all"
    
  });
  


  useEffect(() => {
    if (data?.listPromoters) {
      setPromoters(prev => {
        const ids = new Set(prev.map(v => v.id));
        const newPromoters = data.listPromoters.filter((v: any) => !ids.has(v.id));
        return [...prev, ...newPromoters];
      });
    }
  }, [data]);

  
  
  
  

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
        filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10), offset: newSkip },
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

  return (
    <Box>
      {data?.listPromoters && uniquePromoters.length > 0 && uniquePromoters?.map((item: any, key: any) => (
        <PromoterItem
          key={`${item.id}-${key}`}
          item={item}
          onPress={() => handlePromoterPress(item)}
        />
      ))}

      {loading ? (
        <Spinner color="indigo.500" />
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

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <ScrollView nestedScrollEnabled>
        <VStack space="20px" divider={<Divider />} >
          <CardOnOff />
          <Text fontSize="18px" fontWeight="bold" mb="21px" mt="21px">
            EQUIPE DISPONÍVEL
          </Text>
        </VStack>

        <PromoterItemComponent />


      </ScrollView>
    </Box>
  );
});
