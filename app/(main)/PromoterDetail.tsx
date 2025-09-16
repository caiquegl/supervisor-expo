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
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

export default function PromoterDetail() {
  const { setFilter, filter } = userContext();
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  // Sincronizar valor do filtro global para o drawer
  const selectedDate = filter?.dt_visit
    ? (() => {
        if (typeof filter.dt_visit === 'string') {
          const [year, month, day] = filter.dt_visit.split('-').map(Number);
          const simpleDate = new Date(year, month - 1, day);
          console.log('selectedDate calculado simples:', simpleDate);
          console.log('filter.dt_visit:', filter.dt_visit);
          console.log('year, month, day:', year, month, day);
          return simpleDate;
        }
        return undefined;
      })()
    : undefined;

  const selectedUserId = filter?.user_id;

  console.log('PromoterDetail renderizado:');
  console.log('filter:', filter);
  console.log('selectedDate final:', selectedDate);
  console.log('selectedUserId:', selectedUserId);

  // Contar filtros ativos globais
  const filterCount = [filter?.dt_visit, filter?.user_id].filter(Boolean).length;

  // Aplicar filtro
  const handleApplyFilter = () => {
    setDrawerVisible(false);
  };

  // Limpar filtro
  const handleClearFilter = () => {
    setFilter({
      dt_visit: moment().format('YYYY-MM-DD')
    });
    setDrawerVisible(false);
  };

  // Atualizar filtro de data
  const handleDateChange = (date: any) => {
    console.log('handleDateChange chamado com:', date);
    console.log('Tipo da data:', typeof date);
    
    if (date) {
      // Usar moment para garantir consistência de timezone
      const formattedDate = moment(date).format('YYYY-MM-DD');
      console.log('Data formatada:', formattedDate);
      setFilter({ ...filter, dt_visit: formattedDate });
    } else {
      console.log('Data é null/undefined, removendo dt_visit do filtro');
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
          <ContainerIconPrimary>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIconPrimary>
          {/* Botão de filtro com badge */}
          <View style={{ position: 'relative', marginLeft: 'auto', marginRight: 12 }}>
            <TouchableOpacity onPress={() => setDrawerVisible(true)}>
              <Icon name="filter-list" size={28} color="#fff" />
              {filterCount > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#CC0066', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{filterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ActionsHeader>
        <FilterDrawer
          visible={drawerVisible}
          selectedDate={selectedDate}
          onChangeDate={handleDateChange}
          selectedUserId={selectedUserId}
          onChangeUserId={handleUserIdChange}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          onClose={() => setDrawerVisible(false)}
        />
        <ActionsHeader>
          <TouchableOpacity onPress={() => router.push("/(main)/PromotersComponent")}>
            <Text style={{ color: '#fff', fontSize: 16 }}>Voltar</Text>
          </TouchableOpacity>

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
