import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import {
  ActionsHeader,
  Container,
  ContainerBody,
  ContainerIcon,
  ContainerIconCenter,
  ContainerText,
  TextLogo,
  TextName,
  TextNameSmall,
  TitlePage,
} from "../../styles/style.home";
import { useTheme } from "styled-components";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import { Flex, VStack } from "native-base";

import { CardVisitsProgrammer } from "../../components/CardVisitsProgrammer";
import { Menu } from "../../components/Menu";
import { theme } from "@/theme";
import { apolloContext } from "../../context/apolloContext";
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { userContext } from '../../context/userContext';


export default function HomeProgramer() {
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
          return new Date(year, month - 1, day);
        }
        return undefined;
      })()
    : undefined;

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

  // Memoizar o componente CardVisitsProgrammer para evitar re-renders desnecessários
  const memoizedCardVisitsProgrammer = useMemo(() => {
    return <CardVisitsProgrammer />;
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
        <ContainerBody style={{ marginTop: 20, flex: 1 }}>
          <VStack space="19px" style={{ flex: 1 }}>
            {memoizedCardVisitsProgrammer}
          </VStack>
        </ContainerBody>
      </Container>
      <Menu routeActive="programmerVisits"  />
    </View>
  );
};
