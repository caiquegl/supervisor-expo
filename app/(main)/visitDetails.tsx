import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  ActionsHeader,
  Container,
  ContainerBody,
  TextLogo,
} from "../../styles/style.home";
import {
  ContainerIconPrimary,
  TextName,
  ButtonBack,
} from "../../styles/style.pictures";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import Left from "../../assets/icon/angle-left.svg";
import { VStack, HStack } from "native-base";
import { Menu } from "../../components/Menu";
import { theme } from "@/theme";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    industries: string;
}

const handleBack = () => {
  if (router.canGoBack?.()) {
    router.back();
  } else {
    router.replace("/(main)/programmerVisits");
  }
};

export default function VisitDetails() {
  const visit = useLocalSearchParams<VisitParams>();

  const industries = visit.industries
    ? JSON.parse(visit.industries)
    : [];

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
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <TextName>Detalhes da Visita</TextName>
          </TouchableOpacity>
          <ButtonBack onPress={handleBack}>
            <Left />
          </ButtonBack>
        </ActionsHeader>
        <ContainerBody style={{ marginTop: 20, flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <VStack space="4px">

            {/* Informações do Promotor */}
            <View style={{ 
              backgroundColor: '#f8f9fa', 
              padding: 10, 
              borderRadius: 6, 
              marginBottom: 4 
            }}>
              <HStack alignItems="center" space="8px" mb="4px">
                <Ionicons name="person" size={20} color="#6600CC" />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: '#333'
                }}>
                  Promotor
                </Text>
              </HStack>
              <Text style={{ 
                fontSize: 15, 
                color: '#666',
                marginLeft: 28
              }}>
                {visit?.promoter_name || 'Nome não disponível'}
              </Text>
            </View>

            {/* Informações da Loja */}
            <View style={{ 
              backgroundColor: '#f8f9fa', 
              padding: 10, 
              borderRadius: 6, 
              marginBottom: 4 
            }}>
              <HStack alignItems="center" space="8px" mb="4px">
                <Ionicons name="storefront" size={20} color="#6600CC" />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: '#333'
                }}>
                  Loja
                </Text>
              </HStack>
              <Text style={{ 
                fontSize: 15, 
                color: '#666', 
                marginBottom: 3,
                marginLeft: 28
              }}>
                {visit?.pdv_name || 'Nome da loja não disponível'}
              </Text>
              <Text style={{ 
                fontSize: 13, 
                color: '#888',
                marginLeft: 28
              }}>
                {visit?.pdv_address || 'Endereço não disponível'}
              </Text>
            </View>

            {/* Data da Visita e Status */}
            <View style={{ 
              backgroundColor: '#f8f9fa', 
              padding: 10, 
              borderRadius: 6, 
              marginBottom: 4 
            }}>
              <HStack space="20px" style={{ marginLeft: 0 }}>
                {/* Data da Visita */}
                <View style={{ flex: 1 }}>
                  <HStack alignItems="center" space="8px" mb="4px">
                    <Ionicons name="calendar" size={20} color="#6600CC" />
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: '#333'
                    }}>
                      Data da Visita
                    </Text>
                  </HStack>
                  <Text style={{ 
                    fontSize: 15, 
                    color: '#666',
                    marginLeft: 28
                  }}>
                    {visit?.dt_visit || 'Data não disponível'}
                  </Text>
                </View>

                {/* Status da Visita */}
                <View style={{ flex: 1 }}>
                  <HStack alignItems="center" space="8px" mb="4px">
                    <Ionicons name="information-circle" size={20} color="#6600CC" />
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: '#333'
                    }}>
                      Status
                    </Text>
                  </HStack>
                  <HStack alignItems="center" space="8px" style={{ marginLeft: 28 }}>
                    <View style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: visit?.status === 'COMPLETE' ? '#28a745' : 
                                     visit?.status === 'IN_PROGRESS' ? '#ffc107' : 
                                     visit?.status === 'PENDENT' ? '#6c757d' : '#dc3545'
                    }} />
                    <Text style={{ 
                      fontSize: 15, 
                      color: '#666'
                    }}>
                      {visit?.status === 'COMPLETE' ? 'Concluída' : 
                       visit?.status === 'IN_PROGRESS' ? 'Em Andamento' : 
                       visit?.status === 'PENDENT' ? 'Pendente' : 
                       visit?.status || 'Status não disponível'}
                    </Text>
                  </HStack>
                </View>
              </HStack>
            </View>

            {/* Informações de Check-in e Check-out */}
            {(visit?.status === 'IN_PROGRESS' || visit?.status === 'COMPLETE') && (
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 12, 
                borderRadius: 8, 
                marginBottom: 8 
              }}>
                <HStack alignItems="center" space="8px" mb="4px">
                  <Ionicons name="time" size={20} color="#6600CC" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    color: '#333'
                  }}>
                    Horários
                  </Text>
                </HStack>
                <HStack space="15px" style={{ marginLeft: 28 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 13, 
                      fontWeight: 'bold', 
                      color: '#666',
                      marginBottom: 2
                    }}>
                      Check-in:
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#333' 
                    }}>
                      {visit?.check_in_date || 'Não realizado'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 13, 
                      fontWeight: 'bold', 
                      color: '#666',
                      marginBottom: 2
                    }}>
                      Check-out:
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#333' 
                    }}>
                      {visit?.check_out_date || 'Não realizado'}
                    </Text>
                  </View>
                </HStack>
              </View>
            )}

            {/* Indústrias da Visita */}
            {Array.isArray(industries) && industries.length > 0 && (
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 10, 
                borderRadius: 6, 
                marginBottom: 4 
              }}>
                <HStack alignItems="center" space="8px" mb="4px">
                  <Ionicons name="pricetags" size={20} color="#6600CC" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    color: '#333'
                  }}>
                    Indústrias
                  </Text>
                </HStack>
                <View style={{ marginLeft: 28 }}>
                  {industries.map((industry, index) => (
                    <TouchableOpacity
                      key={industry.id || index}
                      style={{
                        paddingVertical: 16,
                        paddingHorizontal: 12,
                        borderBottomWidth: index < industries.length - 1 ? 1 : 0,
                        borderBottomColor: '#e0e0e0',
                        borderWidth: 1,
                        borderColor: '#e0e0e0',
                        borderRadius: 8,
                        marginBottom: 8,
                        backgroundColor: '#fff',
                      }}
                      onPress={() => {
                        // TODO: Adicionar ação ao clicar na indústria
                        console.log('Clicou na indústria:', industry);
                      }}
                    >
                      <Text style={{ fontSize: 15, color: '#333', marginBottom: 4 }}>
                        {industry.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#888' }}>
                        Fotos: { industry.total_pictures }
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Botão Adicionar Indústria */}
            {visit?.status !== 'COMPLETE' && visit?.status !== 'JUSTIFIED' && (
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 10, 
                borderRadius: 6, 
                marginBottom: 4 
              }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#6600CC',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    console.log('Adicionar nova indústria');
                  }}
                >
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: 'bold' 
                  }}>
                    + Adicionar Indústria
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            </VStack>
          </ScrollView>
        </ContainerBody>
      </Container>
      <Menu routeActive="programmerVisits" />
    </View>
  );
}
