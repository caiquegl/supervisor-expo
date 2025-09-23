import React from 'react'
import {
  ActionsHeader,
  ButtonBack,
  Container,
  ContainerBody,
  ContainerIconPrimary,
  TextLogo,
  TextName,
} from "../../styles/style.promoterdetail";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import Left from "../../assets/icon/angle-left.svg";
import { Flex, Text, VStack, ScrollView } from 'native-base';
import { CardVisitByPromoter } from '../../components/CardVisitByPromoter';
import { TouchableOpacity, View } from 'react-native'
import { Menu } from '../../components/Menu';
import { router } from 'expo-router';
import { theme } from '@/theme';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { userContext } from '../../context/userContext';
import { apolloContext } from '../../context/apolloContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect } from 'react';

export default function PromoterDetail() {
  const { setFilter, filter } = userContext();
  const { promoterOptionsData, loadPromoterOptionsVoid } = apolloContext();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [selectedPromoter, setSelectedPromoter] = React.useState<number | undefined>(filter?.user_id);

  // Carregar opções de promotores quando o componente montar
  useEffect(() => {
    loadPromoterOptionsVoid();
  }, []);

  // Sincronizar valor do filtro global para o drawer
  const selectedDate = filter?.dt_visit
    ? (() => {
        if (typeof filter.dt_visit === 'string') {
          const [year, month, day] = filter.dt_visit.split('-').map(Number);
          const simpleDate = new Date(year, month - 1, day);
          
          
          
          return simpleDate;
        }
        return undefined;
      })()
    : undefined;

  const selectedUserId = filter?.user_id;

  
  
  
  

  // Contar filtros ativos globais
  const filterCount = [filter?.dt_visit, filter?.user_id].filter(Boolean).length;

   // Função unificada para aplicar filtros
  const handleApplyFilters = (filters: { date: any | undefined; userId: number | undefined }) => {
    // Atualiza o filtro global com todos os valores de uma vez
    const newFilter = {
      ...filter,
      dt_visit: filters.date,
      user_id: filters.userId
    };
    
    setFilter(newFilter);
    setSelectedPromoter(filters.userId);
    setDrawerVisible(false);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setSelectedPromoter(undefined);
    const clearedFilter = {
      ...filter,
      user_id: undefined,
      dt_visit: undefined
    };
    
    setFilter(clearedFilter);
    setDrawerVisible(false);
  };

  // Atualizar filtro de data
  const handleDateChange = (date: any) => {
    
    
    
    if (date) {
      // Usar moment para garantir consistência de timezone
      const formattedDate = moment(date).format('YYYY-MM-DD');
      
      setFilter({ ...filter, dt_visit: formattedDate });
    } else {
      
      const { dt_visit, ...restFilter } = filter;
      setFilter(restFilter);
    }
  };

  // Atualizar filtro de usuário
  const handleUserIdChange = (userId: number | undefined) => {
    if (userId) {
      setFilter({ ...filter, user_id: userId });
    } else {
      const { user_id, ...restFilter } = filter;
      setFilter(restFilter);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Container colors={theme.colors.primary}>

        <ActionsHeader>

            <ButtonBack 
            onPress={() => router.push("/(main)/PromotersComponent")}
            >
              <Left width={35} height={35} />
            </ButtonBack>

        </ActionsHeader>
        <ScrollView
          _contentContainerStyle={{
            flexGrow: 1
          }}
        >
          <ContainerBody>
            <VStack space="19px">
              <Flex
                justifyContent="space-between"
                pl="21px"
                pr="21px"
                marginBottom="19px"
                direction='row'
              >
                <Text
                  fontSize="18px"
                  fontWeight="bold"
                  color="#2E2F34"
                >
                  VISÃO GERAL
                </Text>
              </Flex>
              <CardVisitByPromoter/>
            </VStack>
          </ContainerBody>
        </ScrollView>

      </Container>
      <Menu routeActive="PromoterDetail" />
    </View>
  );
};
