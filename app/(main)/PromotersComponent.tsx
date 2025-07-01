import React, { useEffect, useMemo, useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
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

export default function PromotersComponent() {
  const { listPromoter } = apolloContext();
  const [valueSearch, setValueSearch] = useState("");

  // Otimização: useMemo para filtrar dados apenas quando necessário
  const dataDash = useMemo(() => {
    if (!valueSearch.trim()) {
      return listPromoter;
    }
    
    return listPromoter.filter((el) =>
      el.name.toLowerCase().includes(valueSearch.toLowerCase())
    );
  }, [listPromoter, valueSearch]);


  return (
    <View style={{flex: 1}}>
      <Container colors={theme.colors.primary}>
        <ActionsHeader>
          <ContainerIcon>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIcon>
    
        </ActionsHeader>
        <ContainerIconCenter>
          <ContainerText>
            <TextName>Promotores</TextName>
            <TextNameSmall>Gestão de equipe</TextNameSmall>
          </ContainerText>
        </ContainerIconCenter>
        <ContainerSearch>
          <ContainerInput>
            <Input
              value={valueSearch}
              onChangeText={setValueSearch}
              placeholder="procure pelo nome"
            />
            <SearchPrimary width={20} height={20} />
          </ContainerInput>
        </ContainerSearch>
        <ContainerBody>
          <VStack space="19px">
            <Flex
              justifyContent="space-between"
              pl="21px"
              pr="21px"
              direction="row"
            >
              <Text fontSize="18px" fontWeight="bold" color="#2E2F34">
                VISÃO GERAL
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
