import React, { Fragment, useCallback, useEffect, useState, useMemo } from "react";
import { ContainerCard, ContainerIconCard, TextTitleCard } from "./style";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { Box, Flex, HStack, Divider, Text, VStack, Spinner, Center } from "native-base";
import Store from "../../assets/icon/store.svg";
import Pendent from '../../assets/icon/clock-pendent.svg'
import Complete from '../../assets/icon/check-circle.svg'
import Inprogress from '../../assets/icon/check-circle-progress.svg'
import { TouchableOpacity, View, FlatList, ActivityIndicator, Image } from 'react-native'
import { useQuery, useLazyQuery } from "@apollo/client";
import { VISITS_PROGRAMER_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { Button } from "@/styles/style.sigin";
import { router } from "expo-router";
import moment from "moment";
import Lightbox from "react-native-lightbox-v2";

export const CardVisitsProgrammer = () => {
  const { filter } = userContext();
  const [skip, setSkip] = useState(0);
  const [visitsProgrammer, setVisitsProgrammer] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true); // Novo estado para controlar se há mais dados

  // Resetar paginação e lista ao mudar o filtro global
  useEffect(() => {
    setSkip(0);
    setVisitsProgrammer([]);
    setIsInitialLoad(true);
    setHasMoreData(true); // Reset do estado de mais dados
  }, [filter]);

  const { data, loading, error } = useQuery(VISITS_PROGRAMER_QUERY, {
    variables: {
      filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10), offset: 0 },
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  // Query lazy para carregar mais dados
  const [loadMore, { loading: loadingMore }] = useLazyQuery(VISITS_PROGRAMER_QUERY, {
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  // Atualiza a lista apenas na primeira carga ou quando o filtro muda
  useEffect(() => {
    if (error) {
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err: any) => {
          console.error('GraphQL Error:', err);
        });
      }
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
    }

    if (data?.visitsPromoters && isInitialLoad) {
      setVisitsProgrammer(data.visitsPromoters);
      setIsInitialLoad(false);
    }
  }, [data, error, isInitialLoad]);

  // Função para carregar mais visitas
  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore) return; // Evita múltiplas chamadas simultâneas

    const newSkip = skip + 9;
    setSkip(newSkip);

    try {
      const result = await loadMore({
        variables: {
          filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10), offset: newSkip },
        },
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      });

      if (result.data?.visitsPromoters) {
        // Se não há mais dados (resposta vazia), marca como não há mais dados
        if (result.data.visitsPromoters.length === 0) {
          setHasMoreData(false);
          return;
        }

        // Atualiza o estado local com os novos dados
        setVisitsProgrammer(prevVisits => {
          const currentIds = new Set(prevVisits.map(v => v.id));
          const newVisits = result.data.visitsPromoters.filter((v: any) => !currentIds.has(v.id));
          return [...prevVisits, ...newVisits];
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mais dados:', error);
    }
  }, [loadMore, filter, skip, loading, loadingMore]);

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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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

          {visit.status != 'JUSTIFIED_ABSENCE' &&
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
          }

          {visit.status == 'JUSTIFIED_ABSENCE' &&
            <>
              <View style={{
                backgroundColor: '#FFEDD5',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                alignSelf: 'flex-start',
                marginTop: 15,
                marginBottom: 10
              }}>
                <Text style={{
                  color: '#ea580c',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Justificado
                </Text>
              </View>

              {/* Informações da justificativa */}
              {visit.option_justify && (
                <HStack space="7px" mt="10px" h="18px">
                  <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                    Motivo:
                  </Text>
                  <Text fontSize="13px" color="#4C4C4C" style={{ flexWrap: 'wrap', flex: 1 }}>
                    {visit.option_justify}
                  </Text>
                </HStack>
              )}

              {visit.obs_justify && (
                <HStack space="7px" mt="10px" h="auto">
                  <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                    Observação:
                  </Text>
                  <Text fontSize="13px" color="#4C4C4C" style={{ flexWrap: 'wrap', flex: 1 }}>
                    {visit.obs_justify}
                  </Text>
                </HStack>
              )}

              {/* Foto da justificativa */}
              {visit.picture_justify && (
                <View style={{ marginTop: 15 }}>
                  <Text fontSize="13px" color="#4C4C4C" fontWeight="bold" mb="10px">
                    Foto da justificativa:
                  </Text>
                  <View style={{ width: 91, height: 91 }}>
                    <Lightbox navigator={Navigator}>
                      <Image
                        source={{ uri: data.picture_justify }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Lightbox>
                  </View>
                </View>
              )}
            </>
          }

          {visit.status !== 'PENDENT' && visit.status != 'JUSTIFIED_ABSENCE' && (
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", marginTop: 10 }}>
              <Button
                style={{ marginTop: 0, height: 30, width: '100%' }}
                onPress={() => router.push({ pathname: './pictures', params: visit })}
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
    if (loading || loadingMore) {
      return (
        <Center py="20px">
          <ActivityIndicator size="small" color="#6600CC" />
        </Center>
      );
    }

    // Se não há mais dados, não mostra o botão
    if (!hasMoreData) {
      return (
        <Center py="20px">
          <Text fontSize="14px" color="#666">Não há mais visitas para carregar</Text>
        </Center>
      );
    }

    // Só mostra o botão se há dados e não está carregando
    if (uniqueVisits.length > 0) {
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
    }

    return null;
  }, [loading, loadingMore, handleLoadMore, hasMoreData, uniqueVisits.length]);

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
        <TextTitleCard>VISITAS PROGRAMADAS ({filter.dt_visit ? moment(filter.dt_visit, 'YYYY-MM-DD').format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')})</TextTitleCard>
      </ContainerIconCard>
      <FlatList
        data={uniqueVisits}
        renderItem={renderVisitItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        //ListEmptyComponent={renderEmpty}
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
