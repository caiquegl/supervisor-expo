import React, { useCallback, useState, memo } from "react";
import { ScrollView, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import { CirculeUser } from "../../components/CirculeUser";
import { userContext } from "../../context/userContext";
import { CardVisits } from "../../components/CardVisits";
import { CardColaboradores } from "../../components/CardColaboradores";
import { CardStore } from "../../components/CardStore";
import { Menu } from "../../components/Menu";
import { theme } from "@/theme";

// Memoizar componentes para evitar re-renders desnecessários
const MemoizedCardColaboradores = memo(CardColaboradores);
const MemoizedCardStore = memo(CardStore);
const MemoizedCardVisits = memo(CardVisits);

export default function Home() {
  let userContextData;
  try {
    userContextData = userContext();
  } catch (error) {
    // Se o contexto não está disponível (ex: após logout), não renderize nada
    return null;
  }
  
  const { user } = userContextData;

  // Verificar se o usuário está logado
  if (!user || !user.id || !user.name) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Usuário não autenticado</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Container colors={theme.colors.gradient_home}>
        <ActionsHeader>
          <ContainerIcon>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIcon>
        </ActionsHeader>
        <ContainerIconCenter>
          <CirculeUser name={user.name[0]} />
          <ContainerText>
            <TextName>Olá {user.name}</TextName>
            <TextNameSmall>Seja bem-vindo (a)</TextNameSmall>
          </ContainerText>
        </ContainerIconCenter>
        <ContainerBody>
          <ScrollView>
            <View style={{gap: 19, }} >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 21,
                  paddingRight: 21,
                  marginBottom: 19
                }}
        
              >
                <TitlePage>DASHBOARD</TitlePage>
              </View>
              <MemoizedCardColaboradores />
              <MemoizedCardStore />
              <MemoizedCardVisits />
              {/* <CardForms /> */}
            </View>
          </ScrollView>
        </ContainerBody>
      </Container>
      <Menu routeActive="HomeButton"  />
    </View>
  );
};