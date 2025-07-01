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

export default function PromoterDetail() {

  return (
    <View style={{ flex: 1 }}>
      <Container colors={theme.colors.primary}>
        <ActionsHeader>
          <ContainerIconPrimary>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIconPrimary>
        </ActionsHeader>
        <ActionsHeader>
          <TouchableOpacity onPress={() => router.push("/(main)/PromotersComponent")}>
            <Text style={{ color: '#fff', fontSize: 16 }}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(main)/PromotersComponent")}
          >
            <ButtonBack >
              <Left width={35} height={35} />
            </ButtonBack>
          </TouchableOpacity>

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
