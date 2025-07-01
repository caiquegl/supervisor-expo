import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
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


export default function HomeProgramer() {

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
          <ContainerIcon>
          </ContainerIcon>
        </ActionsHeader>
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
