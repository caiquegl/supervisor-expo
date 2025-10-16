import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, FlatList, ActivityIndicator, Alert } from "react-native";
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
import apiBackoffice from '../../service/apiBackoffice';
import { userContext } from "../../context/userContext";
import { ADD_INDUSTRY_MUTATION } from "../../context/querys";
import { useMutation } from '@apollo/client';

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
  const { user } = userContext();

  const [industries, setIndustries] = useState<any>(visit.industries ? JSON.parse(visit.industries) : []);

  // Estados para o modal de adicionar indústria
  const [showAddIndustryModal, setShowAddIndustryModal] = useState(false);
  const [searchIndustryText, setSearchIndustryText] = useState('');
  const [listIndustries, setListIndustries] = useState<any>([]);
  const [loadingIndustries, setLoadingIndustries] = useState(false);

  // Mutation para adicionar indústria
  const [addIndustryMutation, { loading: addingIndustry }] = useMutation(ADD_INDUSTRY_MUTATION);

  // Função para buscar indústrias
  const searchIndustries = useCallback(async (value: string) => {
    try {
      setSearchIndustryText(value);
      setLoadingIndustries(true);
      
      apiBackoffice.defaults.headers.authorization = `Bearer ${user.token}`;
      apiBackoffice.defaults.headers.workspace = user.slug;
      apiBackoffice.defaults.headers.workspaceId = user.workspace_id;
      
      const { data } = await apiBackoffice.get(`/search/sub-workspaces?search=${value}`);
      setListIndustries(data);
    } catch (error) {
      console.error('Erro ao buscar indústrias:', error);
      Alert.alert('Erro', 'Erro ao buscar indústrias. Tente novamente.');
    } finally {
      setLoadingIndustries(false);
    }
  }, [user.token, user.slug, user.workspace_id]);

  // Função para adicionar indústria à visita
  const addIndustryToVisit = useCallback(async (industry: any) => {
    try {
      // Chamar a mutation para adicionar indústria
      const { data } = await addIndustryMutation({
        variables: {
          input: {
            visit_id: parseInt(visit.id),
            sub_workspace_id: parseInt(industry.value)
          }
        },
      });

      if (data?.addIndustry?.id) {
        // Adicionar indústria à lista local após sucesso da mutation
        const newIndustry = {
          id: industry.value,
          name: industry.label,
          total_pictures: 0
        };

        setIndustries([...industries, newIndustry]);

        Alert.alert(
          'Sucesso!',
          `Indústria "${industry.label}" está sendo processada, em breve ela será adicionada à visita.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setShowAddIndustryModal(false);
                setSearchIndustryText('');
                setListIndustries([]);
              }
            }
          ]
        );
      } else {
        throw new Error('Resposta inválida da API');
      }

    } catch (error: any) {
      console.error('Erro ao adicionar indústria:', error);
      Alert.alert(
        'Erro', 
        error.message || 'Erro ao adicionar indústria. Tente novamente.'
      );
    }
  }, [addIndustryMutation, visit.id, industries]);

  // Função para fechar modal
  const closeAddIndustryModal = useCallback(() => {
    setShowAddIndustryModal(false);
    setSearchIndustryText('');
    setListIndustries([]);
  }, []);

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
                  onPress={() => setShowAddIndustryModal(true)}
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

      {/* Modal para Adicionar Indústria */}
      <Modal
        visible={showAddIndustryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAddIndustryModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            width: '95%',
            maxHeight: '80%',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#2E2F34',
                flex: 1
              }}>
                Adicionar Indústria
              </Text>
              <TouchableOpacity onPress={closeAddIndustryModal} style={{ padding: 5 }}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2E2F34',
                marginBottom: 10,
              }}>
                Pesquisar Indústria
              </Text>
              <View style={{
                borderWidth: 2,
                borderColor: '#8f8f8f',
                borderRadius: 10,
                backgroundColor: '#fff'
              }}>
                <TextInput
                  value={searchIndustryText}
                  onChangeText={searchIndustries}
                  placeholder="Digite o nome da indústria..."
                  style={{
                    padding: 12,
                    color: '#2E2F34',
                    fontSize: 16,
                  }}
                />
              </View>
            </View>

            {loadingIndustries && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="large" color="#6600CC" />
                <Text style={{ marginTop: 10, color: '#666' }}>Buscando indústrias...</Text>
              </View>
            )}

            {addingIndustry && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="large" color="#6600CC" />
                <Text style={{ marginTop: 10, color: '#666' }}>Adicionando indústria...</Text>
              </View>
            )}

            {listIndustries.length > 0 && (
              <View style={{
                maxHeight: 300,
                backgroundColor: '#fff',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#e0e0e0'
              }}>
                <FlatList
                  data={listIndustries}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => {
                    const isAlreadyAdded = industries.some((ind: any) => ind.id === item.value);
                    
                    return (
                      <TouchableOpacity
                        onPress={() => !isAlreadyAdded && !addingIndustry && addIndustryToVisit(item)}
                        disabled={isAlreadyAdded || addingIndustry}
                        style={{
                          padding: 15,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          opacity: isAlreadyAdded || addingIndustry ? 0.5 : 1,
                          backgroundColor: isAlreadyAdded ? '#f5f5f5' : 'transparent',
                        }}
                      >
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: isAlreadyAdded ? '#ccc' : '#6600CC',
                          marginRight: 12,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          {isAlreadyAdded ? (
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          ) : (
                            <Ionicons name="business" size={12} color="#fff" />
                          )}
                        </View>
                        <Text style={{
                          flex: 1,
                          fontSize: 16,
                          color: isAlreadyAdded ? '#999' : '#2E2F34'
                        }}>{item.label}</Text>
                        {isAlreadyAdded && (
                          <Text style={{
                            fontSize: 12,
                            color: '#999',
                            fontStyle: 'italic'
                          }}>Já adicionada</Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  nestedScrollEnabled
                  style={{ flexGrow: 0 }}
                />
              </View>
            )}

            {searchIndustryText.length > 0 && listIndustries.length === 0 && !loadingIndustries && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Ionicons name="search" size={48} color="#ccc" />
                <Text style={{ marginTop: 10, color: '#666', textAlign: 'center' }}>
                  Nenhuma indústria encontrada para "{searchIndustryText}"
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={closeAddIndustryModal} style={{ marginTop: 20 }}>
              <View
                style={{
                  height: 50,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: '#6600CC',
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#6600CC',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Cancelar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
