import React, { Fragment, useCallback, useEffect, useState, useMemo } from "react";
import { ContainerCard, ContainerIconCard, TextTitleCard } from "./style";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { Box, Flex, HStack, Divider, Text, VStack, Spinner, Center } from "native-base";
import Store from "../../assets/icon/store.svg";
import Pendent from '../../assets/icon/clock-pendent.svg'
import Complete from '../../assets/icon/check-circle.svg'
import Inprogress from '../../assets/icon/check-circle-progress.svg'
import { TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native'
import { useQuery } from "@apollo/client";
import { VISITS_PROGRAMER_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { Button } from "@/styles/style.sigin";
import { router } from "expo-router";

export const CardVisitsProgrammer = () => {
  const { filter } = userContext();
  const [skip, setSkip] = useState(0);
  const [visitsProgrammer, setVisitsProgrammer] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data, loading, fetchMore, error } = useQuery(VISITS_PROGRAMER_QUERY, {
    variables: {
      filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10), offset: skip },
    },
        fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  // Atualiza a lista acumulando os dados (evita duplicados)
  useEffect(() => {
    if (error) {
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err: any) => {
        });
      }
      if (error.networkError) {
      }
    }
    if (data?.visitsPromoters) {
      setVisitsProgrammer(prev => {
        const ids = new Set(prev.map(v => v.id));
        const newVisits = data.visitsPromoters.filter((v: any) => !ids.has(v.id));
        return [...prev, ...newVisits];
      });
    }
  }, [data, error]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isInitialLoad && visitsProgrammer.length === 0 && !loading) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, visitsProgrammer.length, loading]);

  // Função para carregar mais visitas
  const handleLoadMore = useCallback(() => {
    const newSkip = skip + 9;
    setSkip(newSkip);
    fetchMore({
      variables: {
        filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10), offset: newSkip },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const prevIds = new Set((prev?.visitsPromoters || []).map((v: any) => v.id));
        const merged = [
          ...(prev?.visitsPromoters || []),
          ...(fetchMoreResult.visitsPromoters.filter((v: any) => !prevIds.has((v as any).id)))
        ];
        setVisitsProgrammer(merged);
        return { ...prev, visitsPromoters: merged };
      },
    });
  }, [fetchMore, filter, skip]);

  // Remover dados duplicados baseado no ID
  const uniqueVisits = useMemo(() => {
    const seen = new Set();
    return visitsProgrammer.filter((visit: any) => {
      const duplicate = seen.has(visit.id);
      seen.add(visit.id);
      return !duplicate;
    });
  }, [visitsProgrammer]);

  const renderVisitItem = useCallback(({ item: visit, index }: { item: any, index: number }) => {
    const truncateText = (text: string, maxLength: number = 40) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'PENDENT':
          return <Pendent width="20px" height="20px" />;
        case 'IN_PROGRESS':
          return <Inprogress width="20px" height="20px" />;
        case 'COMPLETE':
          return <Complete width="20px" height="20px" />;
        default:
          return null;
      }
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Flex
              flexDirection="row"
              justifyContent="flex-start"
              flexWrap='wrap'
              flex={1}
            >
              <Store width={25} />
              <Text
                fontSize="15px"
                fontWeight="bold"
                ml="6px"
                mr="6px"
                flex={1}
              >
                {visit.promoter_name}
              </Text>
              {getStatusIcon(visit.status)}
            </Flex>
          </View>

          <HStack space="7px" mt="15px" h="18px">
            <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
              Loja:
            </Text>
            <Text fontSize="13px" color="#4C4C4C" flex={1}>
              {truncateText(visit.pdv_name)}
            </Text>
          </HStack>
          
          <HStack space="7px" mt="15px" h="18px">
            <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
              Endereço:
            </Text>
            <Text fontSize="13px" color="#4C4C4C" flex={1}>
              {truncateText(visit.pdv_address)}
            </Text>
          </HStack>
          
          <HStack space="7px" mt="15px" h="18px">
            <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
              Data da visita:
            </Text>
            <Text fontSize="13px" color="#4C4C4C">
              {visit.dt_visit}
            </Text>
          </HStack>
          
          <View style={{ flexDirection: 'row' }}>
            <HStack space="7px" mt="15px" h="18px">
              <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                Check-in:
              </Text>
              <Text fontSize="13px" color="#4C4C4C">
                {visit.check_in_date || 'Não realizado'}
              </Text>
            </HStack>

            <HStack space="7px" mt="15px" h="18px" ml="8px">
              <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                Check-out:
              </Text>
              <Text fontSize="13px" color="#4C4C4C">
                {visit.check_out_date || 'Não realizado'}
              </Text>
            </HStack>
          </View>
          
          {visit.status !== 'PENDENT' && (
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", marginTop: 10 }}>
              <Button 
                style={{ marginTop: 0, height: 30, width: '100%' }}
                onPress={() => router.push({pathname: './pictures', params: visit })}
              >
                <Text style={{ color: '#000', fontSize: 13, fontWeight: 'bold' }}>Ver fotos</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  const renderSeparator = useCallback(() => <Divider />, []);

  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <Center py="20px">
          <ActivityIndicator size="small" color="#6600CC" />
        </Center>
      );
    }
    
    return (
      <TouchableOpacity 
        onPress={handleLoadMore}
        style={{ paddingVertical: 20 }}
      >
        <Center>
          <Text fontSize="16px" color="#9933ff" fontWeight="bold">Carregar Mais</Text>
        </Center>
      </TouchableOpacity>
    );
  }, [loading, handleLoadMore]);

  const renderEmpty = useCallback(() => {
    if (loading && uniqueVisits.length === 0) {
      return (
        <Center py="40px">
          <ActivityIndicator size="large" color="#6600CC" />
          <Text mt="10px" fontSize="14px" color="#666">Carregando visitas...</Text>
        </Center>
      );
    }
    
    return (
      <Center py="40px">
        <Text fontSize="16px" color="#666">Nenhuma visita programada encontrada</Text>
      </Center>
    );
  }, [loading, uniqueVisits.length]);

  return (
    <ContainerCard>
      <ContainerIconCard>
        <TextTitleCard>VISITAS PROGRAMADAS</TextTitleCard>
        <ElippseGray width={20} height={20} />
      </ContainerIconCard>
      
      <FlatList
        data={uniqueVisits}
        renderItem={renderVisitItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200, // altura estimada de cada item
          offset: 200 * index,
          index,
        })}
        contentContainerStyle={{ 
          paddingTop: 30,
          paddingBottom: 20,
          minHeight: 400
        }}
      />
    </ContainerCard>
  );
};
