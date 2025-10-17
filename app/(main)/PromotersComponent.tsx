import React, { useEffect, useMemo, useCallback } from "react";
import { ScrollView, TouchableOpacity, View, Modal, Platform, Button as RNButton } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActionsHeader,
  Container,
  ContainerBody,
  ContainerIcon,
  ContainerIconCenter,
  ContainerInput,
  ContainerSearch,
  ContainerText,
  Input,
  TextLogo,
  TextName,
  TextNameSmall,
} from "../../styles/style.promotercomponent";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import SearchPrimary from "../../assets/icon/search-primary.svg";
import { useState } from "react";
import { Flex,Text, theme, VStack } from "native-base";
import { CardPromoterChart } from "../../components/CardPromoterChart";
import { IPropsListPromoter } from "../../context/types";
import { apolloContext } from "../../context/apolloContext";
import { Menu } from "../../components/Menu";
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { userContext } from '../../context/userContext';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import moment from "moment";

export default function PromotersComponent() {
  const { listPromoter, promoterOptionsData, loadPromoterOptionsVoid } = apolloContext();
  const { setFilter, filter } = userContext();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState<number | undefined>(filter?.user_id);

  // Carregar opções de promotores quando o componente montar
  useEffect(() => {
    loadPromoterOptionsVoid();
  }, []);

  // Sincronizar valor do filtro global para o campo de busca
  const valueSearch = filter?.name || '';
  const selectedDate = filter?.dt_visit
    ? (() => {
        if (typeof filter.dt_visit === 'string') {
          const [year, month, day] = filter.dt_visit.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        return undefined;
      })()
    : undefined;

  const selectedUserId = filter?.user_id;

  // Contar filtros ativos globais
  const filterCount = [filter?.dt_visit, filter?.name, filter?.user_id].filter(Boolean).length;

  // Atualizar filtro global ao digitar
  const handleSearchChange = (text: string) => {
    setFilter({ ...filter, name: text });
  };

  // Otimização: useMemo para filtrar dados apenas quando necessário
  const dataDash = useMemo(() => {
    let filteredData = listPromoter;
    
    // Filtro por nome
    if (filter?.name?.trim()) {
      filteredData = filteredData.filter((el) =>
        el.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
    
    // Filtro por promotor (se implementado no backend)
    if (filter?.user_id) {
      // Aqui você pode implementar a lógica de filtro por promotor
      // Por enquanto, apenas retornamos os dados filtrados por nome
    }
    
    return filteredData;
  }, [listPromoter, filter.name, filter.user_id]);

  // Função unificada para aplicar filtros
  const handleApplyFilters = (filters: { date: any | undefined; userId: number | undefined }) => {
    // Atualiza o filtro global com todos os valores de uma vez
    const newFilter = {
      ...filter,
      dt_visit: filters.date,
      user_id: filters.userId
    };
    
    console.log('Aplicando filtros:', filters);
    console.log('Novo filtro completo:', newFilter);
    
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
      dt_visit: moment().format('YYYY-MM-DD')
    };
    
    console.log('Limpando filtros:', clearedFilter);
    setFilter(clearedFilter);
    setDrawerVisible(false);
  };

  // Atualizar filtro de data
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFilter({ ...filter, dt_visit: moment(date).format('YYYY-MM-DD') });
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
    <View style={{flex: 1}}>
      <Container colors={theme.colors.primary}>
        <ActionsHeader>
          <ContainerIcon>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIcon>
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
          selectedPromoter={selectedPromoter}
          promoterOptions={promoterOptionsData}
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setDrawerVisible(false)}
        />
        <ContainerIconCenter>
          <ContainerText>
            <TextName>Promotores</TextName>
            <TextNameSmall>Gestão de equipe</TextNameSmall>
          </ContainerText>
        </ContainerIconCenter>
        {/* <ContainerSearch>
          <ContainerInput>
            <Input
              value={valueSearch}
              onChangeText={handleSearchChange}
              placeholder="procure pelo nome"
            />
            <SearchPrimary width={20} height={20} />
          </ContainerInput>
        </ContainerSearch> */}
        <ContainerBody>
          <VStack space="19px">
            <Flex
              justifyContent="space-between"
              pl="21px"
              pr="21px"
              direction="row"
            >
              <Text fontSize="18px" fontWeight="bold" color="#2E2F34">
                VISÃO GERAL ({filter.dt_visit ? moment(filter.dt_visit, 'YYYY-MM-DD').format('DD/MM/YYYY') :  moment().format('DD/MM/YYYY')})
              </Text>
            </Flex>
            <CardPromoterChart />
          </VStack>
        </ContainerBody>
      </Container>
      <Menu routeActive="PromotersComponent" />
    </View>
  );
};
