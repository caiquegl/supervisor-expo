import React from "react";
import { View, Text } from "react-native";
import {
  ActionsHeader,
  Container,
  ContainerBody,
  ContainerIcon,
  TextLogo,
} from "../../styles/style.home";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import { VStack } from "native-base";
import { Menu } from "../../components/Menu";
import { theme } from "@/theme";
import { useLocalSearchParams } from "expo-router";

type VisitParams = {
    id: string;
    status: string;
    promoter_name: string;
    pdv_name: string;
    pdv_address: string;
    dt_visit: string;
    created_at: string;
    check_in_date: string;
    check_out_date: string;
}

export default function VisitDetails() {
  const visit = useLocalSearchParams<VisitParams>();

  console.log(JSON.stringify(visit, null, 2));

  return (
    <View style={{ flex: 1 }}>
      <Container colors={theme.colors.primary}>
        <ActionsHeader>
          <ContainerIcon>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIcon>
        </ActionsHeader>
        <ContainerBody style={{ marginTop: 20, flex: 1 }}>
          <VStack space="19px" style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#333',
              textAlign: 'center'
            }}>
              Detalhes da visita {visit?.id}
            </Text>
          </VStack>
        </ContainerBody>
      </Container>
      <Menu routeActive="programmerVisits" />
    </View>
  );
}
