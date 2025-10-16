import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from "react-native";
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
import { useLazyQuery } from "@apollo/client";
import { VISIT_INDUSTRY_TASK_QUERY } from "../../context/querys";

type VisitIndustryParams = {
  visitId: string;
  industryId: string;
  industryName?: string;
  promoterName?: string;
  pdvName?: string;
  pdvAddress?: string;
  dtVisit?: string;
}

type FormItem = {
  complete: boolean;
  form_name: string;
}

const handleBack = () => {
  if (router.canGoBack?.()) {
    router.back();
  } else {
    router.replace("/(main)/programmerVisits");
  }
};

export default function VisitDetailsIndustry() {
  const params = useLocalSearchParams<VisitIndustryParams>();
  
  // Estados para gerenciar os dados da query
  const [formsList, setFormsList] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query para buscar os formulários da indústria
  const [getVisitIndustryTask, { loading: queryLoading }] = useLazyQuery(VISIT_INDUSTRY_TASK_QUERY, {
    onCompleted: (data) => {
      const forms = data?.visitIndustryTask || [];
      setFormsList(forms);
      setLoading(false);
      setError(null);
    },
    onError: (error) => {
      console.error('Erro ao buscar formulários da indústria:', error);
      setError('Erro ao carregar formulários');
      setLoading(false);
    }
  });

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (params.visitId && params.industryId) {
      setLoading(true);
      getVisitIndustryTask({
        variables: {
          input: {
            visit_id: parseInt(params.visitId),
            sub_workspace_id: parseInt(params.industryId)
          }
        }
      });
    }
  }, [params.visitId, params.industryId, getVisitIndustryTask]);

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
            <TextName>Detalhes da Indústria</TextName>
          </TouchableOpacity>
          <ButtonBack onPress={handleBack}>
            <Left />
          </ButtonBack>
        </ActionsHeader>
        <ContainerBody style={{ marginTop: 20, flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <VStack space="4px">
              {/* Título da Tela */}
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 20, 
                borderRadius: 8, 
                marginBottom: 16,
                alignItems: 'center'
              }}>
                <HStack alignItems="center" space="8px" mb="8px">
                  <Ionicons name="business" size={24} color="#6600CC" />
                  <Text style={{ 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    color: '#333'
                  }}>
                    Detalhes da Indústria
                  </Text>
                </HStack>
                <Text style={{ 
                  fontSize: 16, 
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {params.industryName || 'Indústria'}
                </Text>
              </View>

              {/* Informações do Promotor */}
              {params.promoterName && (
                <View style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: 15, 
                  borderRadius: 8, 
                  marginBottom: 8 
                }}>
                  <HStack alignItems="center" space="8px" mb="8px">
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
                    {params.promoterName}
                  </Text>
                </View>
              )}

              {/* Informações da Loja */}
              {params.pdvName && (
                <View style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: 15, 
                  borderRadius: 8, 
                  marginBottom: 8 
                }}>
                  <HStack alignItems="center" space="8px" mb="8px">
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
                    {params.pdvName}
                  </Text>
                  {params.pdvAddress && (
                    <Text style={{ 
                      fontSize: 13, 
                      color: '#888',
                      marginLeft: 28
                    }}>
                      {params.pdvAddress}
                    </Text>
                  )}
                </View>
              )}

              {/* Data da Visita */}
              {params.dtVisit && (
                <View style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: 15, 
                  borderRadius: 8, 
                  marginBottom: 8 
                }}>
                  <HStack alignItems="center" space="8px" mb="8px">
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
                    {params.dtVisit}
                  </Text>
                </View>
              )}


              {/* Listagem de Formulários */}
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 15, 
                borderRadius: 8, 
                marginBottom: 8 
              }}>
                <HStack alignItems="center" space="8px" mb="12px">
                  <Ionicons name="list" size={20} color="#6600CC" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    color: '#333'
                  }}>
                    Formulários da Indústria
                  </Text>
                </HStack>
                
                {/* Loading State */}
                {(loading || queryLoading) && (
                  <View style={{ 
                    alignItems: 'center', 
                    paddingVertical: 20 
                  }}>
                    <ActivityIndicator size="large" color="#6600CC" />
                    <Text style={{ 
                      marginTop: 10, 
                      color: '#666',
                      fontSize: 14 
                    }}>
                      Carregando formulários...
                    </Text>
                  </View>
                )}

                {/* Error State */}
                {error && !loading && !queryLoading && (
                  <View style={{ 
                    alignItems: 'center', 
                    paddingVertical: 20 
                  }}>
                    <Ionicons name="alert-circle" size={24} color="#dc3545" />
                    <Text style={{ 
                      marginTop: 10, 
                      color: '#dc3545',
                      fontSize: 14,
                      textAlign: 'center'
                    }}>
                      {error}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => {
                        if (params.visitId && params.industryId) {
                          setLoading(true);
                          getVisitIndustryTask({
                            variables: {
                              input: {
                                visitId: params.visitId,
                                industryId: params.industryId
                              }
                            }
                          });
                        }
                      }}
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: '#6600CC',
                        borderRadius: 6
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 12 }}>
                        Tentar Novamente
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Empty State */}
                {!loading && !queryLoading && !error && formsList.length === 0 && (
                  <View style={{ 
                    alignItems: 'center', 
                    paddingVertical: 20 
                  }}>
                    <Ionicons name="document-text" size={24} color="#999" />
                    <Text style={{ 
                      marginTop: 10, 
                      color: '#999',
                      fontSize: 14,
                      textAlign: 'center'
                    }}>
                      Nenhum formulário encontrado
                    </Text>
                  </View>
                )}
                
                {/* Formulários List */}
                {!loading && !queryLoading && !error && formsList.length > 0 && (
                  <FlatList
                    data={formsList}
                    keyExtractor={(item, index) => `${item.form_name}-${index}`}
                    renderItem={({ item }) => (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        marginBottom: 6
                      }}>
                        {/* Bolinha de Status */}
                        <View style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: item.complete ? '#28a745' : '#007bff',
                          marginRight: 12
                        }} />
                        
                        {/* Nome do Formulário */}
                        <Text style={{
                          flex: 1,
                          fontSize: 15,
                          color: '#333',
                          fontWeight: item.complete ? '600' : '400'
                        }}>
                          {item.form_name}
                        </Text>
                        
                        {/* Status Texto */}
                        <Text style={{
                          fontSize: 12,
                          color: item.complete ? '#28a745' : '#007bff',
                          fontWeight: 'bold',
                          marginLeft: 8
                        }}>
                          {item.complete ? 'Concluído' : 'Pendente'}
                        </Text>
                      </View>
                    )}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>

            </VStack>
          </ScrollView>
        </ContainerBody>
      </Container>
      <Menu routeActive="programmerVisits" />
    </View>
  );
}
