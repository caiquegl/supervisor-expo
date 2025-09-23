import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Box, Text, Flex, Center, VStack, Spinner } from 'native-base';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LIST_PROMOTER_QUERY } from '../../context/querys';
import { userContext } from '../../context/userContext';

// Componente do item do promotor
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
    <View>
      <Box mt="15px" mb="15px">
        <TouchableOpacity onPress={onPress}>
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
          <Box flex={1}>
            <Flex direction="row" alignItems="center">
              <Text
                fontSize="16px"
                fontWeight="bold"
                color="#2E2F34"
              >
                {item?.name ? (
                  item.name.length < 20 ? item.name : `${item.name.slice(0, 20)}...`
                ) : ''}
              </Text>
              {/* Indicador de status online/offline */}
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: (item?.visits_complete > 0 || item?.visits_in_progress > 0) ? '#10B981' : '#EF4444',
                  marginLeft: 8
                }}
              />
            </Flex>
            <Text fontSize="12px" color="#666" mt="2px">
              {item?.team_name || 'Sem equipe'}
            </Text>
          </Box>
          <Box alignItems="flex-end">
            <Text fontSize="14px" fontWeight="bold" color="#2E2F34">
              {totalVisits} visitas
            </Text>
            <Text fontSize="10px" color="#666">
              {item?.visits_complete || 0} concluídas
            </Text>
          </Box>
        </Flex>
        </TouchableOpacity>
      </Box>
    </View>
  );
});

// Componente principal da equipe disponível
const TeamAvailable = memo(() => {
  const router = useRouter();
  const { setSelectedPromoter } = userContext();
  const [page, setPage] = useState(1);
  const [allPromoters, setAllPromoters] = useState<any[]>([]);

  // Query Apollo independente
  const { data, loading, error, refetch, fetchMore } = useQuery(LIST_PROMOTER_QUERY, {
    variables: {
      filter: {
        page: page,
        limit: 10,
        date: new Date().toISOString().split('T')[0]
      }
    },
    onCompleted: (data) => {
      if (data?.listPromoters?.data) {
        if (page === 1) {
          setAllPromoters(data.listPromoters.data);
        } else {
          setAllPromoters(prev => [...prev, ...data.listPromoters.data]);
        }
      }
    },
    onError: (error) => {
      console.error('Erro ao carregar promotores:', error);
    }
  });

  // Remover duplicatas
  const uniquePromoters = useMemo(() => {
    const seen = new Set();
    return allPromoters.filter((promoter: any) => {
      const duplicate = seen.has(promoter.id);
      seen.add(promoter.id);
      return !duplicate;
    });
  }, [allPromoters]);

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

  const handlePromoterPress = useCallback((item: any) => {
    setSelectedPromoter(item);
    router.push("/(main)/PromoterDetail");
  }, [setSelectedPromoter, router]);

  const handleLoadMore = useCallback(() => {
    if (!loading) {
      setPage(prev => prev + 1);
    }
  }, [loading]);

  return (
    <Box>
      {/* Loading da equipe disponível */}
      {loading && page === 1 && (
        <Center py="40px">
          <VStack space="15px" alignItems="center">
            <Spinner color="indigo.500" size="lg" />
            <Text color="gray.500" fontSize="16px" fontWeight="bold">
              Carregando equipe...
            </Text>
            <Text color="gray.400" fontSize="14px" textAlign="center">
              Aguarde enquanto buscamos os dados dos promotores
            </Text>
          </VStack>
        </Center>
      )}

      {/* Erro da equipe disponível */}
      {error && !loading && (
        <Center py="40px">
          <VStack space="15px" alignItems="center">
            <Icon name="alert-circle" size={48} color="#EF4444" />
            <Text color="red.500" fontSize="16px" fontWeight="bold" textAlign="center">
              Erro ao carregar equipe
            </Text>
            <Text color="gray.500" fontSize="14px" textAlign="center">
              Não foi possível carregar os dados dos promotores
            </Text>
            <TouchableOpacity 
              onPress={() => refetch()}
              style={{
                backgroundColor: '#6600CC',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                marginTop: 10
              }}
            >
              <Text color="white" fontSize="14px" fontWeight="bold">
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </VStack>
        </Center>
      )}

      {/* Conteúdo da equipe disponível */}
      {!loading && !error && (
        <>
          {/* Seção de Promotores Online */}
          {onlinePromoters.length > 0 && (
            <>
              <Text fontSize="18px" fontWeight="bold" mb="15px" mt="15px" color="#2E2F34">
                EQUIPE DISPONÍVEL (ONLINE)
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
                EQUIPE INDISPONÍVEL (OFFLINE)
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

          {/* Mensagem quando não há promotores */}
          {onlinePromoters.length === 0 && offlinePromoters.length === 0 && (
            <Center py="40px">
              <VStack space="15px" alignItems="center">
                <Icon name="users" size={48} color="#9CA3AF" />
                <Text color="gray.500" fontSize="16px" fontWeight="bold" textAlign="center">
                  Nenhum promotor encontrado
                </Text>
                <Text color="gray.400" fontSize="14px" textAlign="center">
                  Tente ajustar os filtros ou verificar a data selecionada
                </Text>
              </VStack>
            </Center>
          )}

          {/* Botão Carregar Mais */}
          <TouchableOpacity onPress={handleLoadMore}>
            <Center mb="100px">
              <Text fontSize="16px" color="#9933ff" fontWeight="bold">Carregar Mais</Text>
            </Center>
          </TouchableOpacity>
        </>
      )}
    </Box>
  );
});

TeamAvailable.displayName = 'TeamAvailable';

export default TeamAvailable;
