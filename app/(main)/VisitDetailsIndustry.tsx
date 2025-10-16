import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Modal } from "react-native";
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
import { useLazyQuery, useMutation } from "@apollo/client";
import { VISIT_INDUSTRY_TASK_QUERY, SEARCH_FORMS_QUERY, ADD_TASK_MUTATION } from "../../context/querys";

type VisitIndustryParams = {
  visitId: string;
  industryId: string;
  industryName?: string;
  promoterName?: string;
  pdvName?: string;
  pdvAddress?: string;
  dtVisit?: string;
  visitStatus?: string;
}

type FormItem = {
  complete: boolean;
  form_name: string;
}

type FormSearchItem = {
  form_id: string;
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
  
  // Estados para o modal de adicionar pesquisa
  const [showAddResearchModal, setShowAddResearchModal] = useState(false);
  const [searchFormsList, setSearchFormsList] = useState<FormSearchItem[]>([]);
  const [searchFormsLoading, setSearchFormsLoading] = useState(false);
  const [searchFormsError, setSearchFormsError] = useState<string | null>(null);
  
  // Estados para o modal de confirmação
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormSearchItem | null>(null);
  
  // Estados para a mutation de adicionar task
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [addTaskError, setAddTaskError] = useState<string | null>(null);

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

  // Query para buscar formulários disponíveis para adicionar
  const [searchForms, { loading: searchQueryLoading }] = useLazyQuery(SEARCH_FORMS_QUERY, {
    onCompleted: (data) => {
      const forms = data?.searchForms || [];
      setSearchFormsList(forms);
      setSearchFormsLoading(false);
      setSearchFormsError(null);
    },
    onError: (error) => {
      console.error('Erro ao buscar formulários disponíveis:', error);
      setSearchFormsError('Erro ao carregar formulários disponíveis');
      setSearchFormsLoading(false);
    }
  });

  // Mutation para adicionar task
  const [addTask] = useMutation(ADD_TASK_MUTATION, {
    onCompleted: (data) => {
      console.log('Task adicionada com sucesso:', data);
      setAddTaskLoading(false);
      setAddTaskError(null);
      
      // Fechar modais
      setShowConfirmationModal(false);
      setSelectedForm(null);
      
      // Recarregar a lista de formulários
      if (params.visitId && params.industryId) {
        getVisitIndustryTask({
          variables: {
            input: {
              visit_id: parseInt(params.visitId),
              sub_workspace_id: parseInt(params.industryId)
            }
          }
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao adicionar task:', error);
      setAddTaskError('Erro ao adicionar formulário à visita');
      setAddTaskLoading(false);
    }
  });

  // Função helper para verificar se um formulário já está na visita
  const isFormAlreadyInVisit = (formName: string): boolean => {
    return formsList.some(form => form.form_name === formName);
  };

  // Função helper para verificar se a visita está finalizada (concluída ou justificada)
  const isVisitFinalized = (): boolean => {
    return params.visitStatus === 'COMPLETE' || params.visitStatus === 'JUSTIFIED';
  };

  // Função para executar a mutation de adicionar task
  const handleAddTask = async () => {
    if (!selectedForm || !params.visitId || !params.industryId) {
      console.error('Dados insuficientes para adicionar task');
      return;
    }

    try {
      setAddTaskLoading(true);
      setAddTaskError(null);

      await addTask({
        variables: {
          input: {
            visit_id: parseInt(params.visitId),
            form_id: parseInt(selectedForm.form_id),
            sub_workspace_id: parseInt(params.industryId)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao executar mutation addTask:', error);
      setAddTaskError('Erro ao adicionar formulário à visita');
      setAddTaskLoading(false);
    }
  };

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
                                visit_id: params.visitId,
                                sub_workspace_id: params.industryId
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

              {/* Botão de Adicionar Pesquisa */}
              <View style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 15, 
                borderRadius: 8, 
                marginBottom: 8 
              }}>
                <TouchableOpacity 
                  onPress={() => {
                    if (!isVisitFinalized()) {
                      console.log('Abrindo modal de adicionar pesquisa');
                      setSearchFormsLoading(true);
                      setSearchFormsError(null);
                      searchForms({
                        variables: {
                          filter: {
                            sub_workspace_id: params.industryId
                          }
                        }
                      });
                      setShowAddResearchModal(true);
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isVisitFinalized() ? '#ccc' : '#6600CC',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    opacity: isVisitFinalized() ? 0.6 : 1
                  }}
                  activeOpacity={isVisitFinalized() ? 1 : 0.8}
                  disabled={isVisitFinalized()}
                >
                  <Ionicons 
                    name="add-circle" 
                    size={20} 
                    color={isVisitFinalized() ? '#666' : '#fff'} 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={{
                    color: isVisitFinalized() ? '#666' : '#fff',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                    Adicionar Pesquisa
                  </Text>
                </TouchableOpacity>
                
                {/* Texto explicativo quando o botão está desabilitado */}
                {isVisitFinalized() && (
                  <Text style={{
                    fontSize: 12,
                    color: '#888',
                    textAlign: 'center',
                    marginTop: 8,
                    fontStyle: 'italic'
                  }}>
                    Não é possível adicionar nova pesquisa, pois a visita já está finalizada!
                  </Text>
                )}
              </View>

            </VStack>
          </ScrollView>
        </ContainerBody>
      </Container>
      
      {/* Modal de Adicionar Pesquisa */}
      <Modal
        visible={showAddResearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          console.log('Fechando modal');
          setShowAddResearchModal(false);
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            width: '100%',
            height: '70%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4
          }}>
            {/* Header do Modal */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0'
            }}>
              <HStack alignItems="center" space="8px">
                <Ionicons name="document-text" size={24} color="#6600CC" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  Selecionar Formulário
                </Text>
              </HStack>
              <TouchableOpacity 
                onPress={() => setShowAddResearchModal(false)}
                style={{
                  padding: 4
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Mensagem de Aviso */}
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              backgroundColor: '#fff3cd',
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
              alignItems: 'center'
            }}>
              <Ionicons name="warning" size={24} color="#856404" style={{ marginBottom: 8 }} />
              <Text style={{
                fontSize: 14,
                color: '#856404',
                textAlign: 'center',
                lineHeight: 20
              }}>
                Fique Atento! Adicionar pesquisa via App não irá respeitar as regras de agendamento e mix configuradas no backoffice.
              </Text>
            </View>

            {/* Lista de Formulários */}
            <View style={{ 
              flex: 1,
              backgroundColor: '#fff'
            }}>
              {/* Loading State */}
              {(searchFormsLoading || searchQueryLoading) && (
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
                    Carregando formulários disponíveis...
                  </Text>
                </View>
              )}

              {/* Error State */}
              {searchFormsError && !searchFormsLoading && !searchQueryLoading && (
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
                    {searchFormsError}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setSearchFormsLoading(true);
                      setSearchFormsError(null);
                      searchForms({
                        variables: {
                          filter: {
                            sub_workspace_id: params.industryId
                          }
                        }
                      });
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
              {!searchFormsLoading && !searchQueryLoading && !searchFormsError && searchFormsList.length === 0 && (
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
                    Nenhum formulário disponível
                  </Text>
                </View>
              )}

              {/* Formulários List */}
              {!searchFormsLoading && !searchQueryLoading && !searchFormsError && searchFormsList.length > 0 && (
                <FlatList
                  data={searchFormsList}
                  keyExtractor={(item) => item.form_id}
                  renderItem={({ item }) => {
                    const isDisabled = isFormAlreadyInVisit(item.form_name);
                    
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (!isDisabled) {
                            setSelectedForm(item);
                            setShowAddResearchModal(false);
                            setShowConfirmationModal(true);
                          }
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 15,
                          paddingHorizontal: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                          backgroundColor: isDisabled ? '#f8f9fa' : '#fff',
                          opacity: isDisabled ? 0.6 : 1
                        }}
                        activeOpacity={isDisabled ? 1 : 0.7}
                        disabled={isDisabled}
                      >
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: isDisabled ? '#999' : '#6600CC',
                          marginRight: 12
                        }} />
                        <Text style={{
                          flex: 1,
                          fontSize: 16,
                          color: isDisabled ? '#999' : '#333'
                        }}>
                          {item.form_name}
                        </Text>
                        {isDisabled ? (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}>
                            <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                            <Text style={{
                              fontSize: 12,
                              color: '#28a745',
                              marginLeft: 4,
                              fontWeight: '500'
                            }}>
                              Já adicionado
                            </Text>
                          </View>
                        ) : (
                          <Ionicons name="chevron-forward" size={16} color="#999" />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={true}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexGrow: 1 }}
                />
              )}
            </View>

            {/* Footer do Modal */}
            <View style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0'
            }}>
              <TouchableOpacity
                onPress={() => setShowAddResearchModal(false)}
                style={{
                  backgroundColor: '#f8f9fa',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#666',
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal
        visible={showConfirmationModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowConfirmationModal(false);
          setSelectedForm(null);
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            width: '100%',
            maxWidth: 400,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4
          }}>
            {/* Header do Modal */}
            <View style={{
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0'
            }}>
              <Ionicons name="help-circle" size={48} color="#6600CC" style={{ marginBottom: 12 }} />
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center'
              }}>
                Confirmar Adição
              </Text>
            </View>

            {/* Conteúdo do Modal */}
            <View style={{
              padding: 20
            }}>
              <Text style={{
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 20
              }}>
                Deseja adicionar o formulário "{selectedForm?.form_name}" à esta visita?
              </Text>
              
              <Text style={{
                fontSize: 14,
                color: '#856404',
                textAlign: 'center',
                lineHeight: 20,
                backgroundColor: '#fff3cd',
                padding: 12,
                borderRadius: 8,
                marginBottom: 20
              }}>
                ⚠️ Lembre-se: Esta ação não respeitará as regras de agendamento e mix configuradas no backoffice.
              </Text>

              {/* Error State */}
              {addTaskError && (
                <View style={{
                  backgroundColor: '#f8d7da',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 20,
                  alignItems: 'center'
                }}>
                  <Ionicons name="alert-circle" size={20} color="#721c24" style={{ marginBottom: 8 }} />
                  <Text style={{
                    fontSize: 14,
                    color: '#721c24',
                    textAlign: 'center'
                  }}>
                    {addTaskError}
                  </Text>
                </View>
              )}
            </View>

            {/* Botões de Ação */}
            <View style={{
              flexDirection: 'row',
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              gap: 12
            }}>
              <TouchableOpacity
                onPress={() => {
                  if (!addTaskLoading) {
                    setShowConfirmationModal(false);
                    setSelectedForm(null);
                    setAddTaskError(null);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: addTaskLoading ? '#e0e0e0' : '#f8f9fa',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  opacity: addTaskLoading ? 0.6 : 1
                }}
                disabled={addTaskLoading}
              >
                <Text style={{
                  color: addTaskLoading ? '#999' : '#666',
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddTask}
                style={{
                  flex: 1,
                  backgroundColor: addTaskLoading ? '#999' : '#6600CC',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  opacity: addTaskLoading ? 0.8 : 1
                }}
                disabled={addTaskLoading}
              >
                {addTaskLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bold'
                    }}>
                      Adicionando...
                    </Text>
                  </>
                ) : (
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                    Confirmar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Menu routeActive="programmerVisits" />
    </View>
  );
}
