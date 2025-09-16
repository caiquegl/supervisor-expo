import moment from 'moment';
import React from 'react';
import { Modal, TouchableOpacity, View, Button as RNButton, Text, TextInput, ScrollView } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyQuery } from '@apollo/client';
import { PROMOTER_OPTIONS_QUERY } from '../../context/querys';
import { userContext } from '@/context/userContext';

interface FilterDrawerProps {
  visible: boolean;
  selectedDate: Date | undefined;
  selectedUserId: number | undefined;
  onChangeDate: (date: any | undefined) => void;
  onChangeUserId: (userId: number | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  selectedDate,
  selectedUserId,
  onChangeDate,
  onChangeUserId,
  onApply,
  onClear,
  onClose,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showUserPicker, setShowUserPicker] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(selectedDate);
  const [internalUserId, setInternalUserId] = React.useState<number | undefined>(selectedUserId);
  const [searchText, setSearchText] = React.useState('');
  const { setFilter, filter } = userContext();
  
  // Query para buscar promotores
  const [loadPromoterOptions, { data: promoterOptionsData, loading: loadingPromoters }] = useLazyQuery(PROMOTER_OPTIONS_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Carregar promotores quando o drawer é aberto
  React.useEffect(() => {
    if (visible) {
      loadPromoterOptions();
    }
  }, [visible, loadPromoterOptions]);

  // Inicializar valores internos quando o drawer é aberto
  React.useEffect(() => {
    if (visible) {
      
      
      
      
      // Se não há selectedDate, usar a data atual simples
      let initialDate = selectedDate;
      if (!selectedDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        initialDate = new Date(year, month, day);
        
      }
      
      setInternalDate(initialDate);
      setInternalUserId(selectedUserId);
      
      
      
      
    }
  }, [visible]);

  // Atualiza o valor interno quando o drawer é aberto ou os valores mudam
  React.useEffect(() => {
    
    
    
    
    if (visible) {
      setInternalDate(selectedDate);
      setInternalUserId(selectedUserId);
      
      
      
      
    }
  }, [visible, selectedDate, selectedUserId]);

  const handleConfirmDate = (params: { date: Date | undefined }) => {
    
    setShowDatePicker(false);
    
    if (params.date) {
      // Criar uma data simples apenas com dia, mês e ano
      const year = params.date.getFullYear();
      const month = params.date.getMonth();
      const day = params.date.getDate();
      const simpleDate = new Date(year, month, day);
      
      
      
      setInternalDate(simpleDate);
      
    } else {
      setInternalDate(undefined);
      
    }
  };

  const handleApply = () => {
    let newFilter = {...filter }
    if(internalDate) newFilter.dt_visit = moment(internalDate).format('YYYY-MM-DD')
    if(internalUserId) newFilter.user_id = internalUserId
    
    setFilter({...newFilter})
    // Garantir que onChangeDate seja chamado com o valor correto
 
    // Fechar o drawer
    onApply();
  };

  const handleClear = () => {
    
    
    // Criar uma data simples para hoje
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const simpleToday = new Date(year, month, day);
    
    
    
    
    setInternalDate(simpleToday);
    setInternalUserId(undefined);
    onChangeDate(simpleToday);
    onChangeUserId(undefined);
    onClear();
  };

  // Filtrar promotores baseado no texto de busca
  const filteredPromoters = React.useMemo(() => {
    if (!promoterOptionsData?.getPromoterOptions) return [];
    
    if (!searchText.trim()) {
      return promoterOptionsData.getPromoterOptions;
    }
    
    return promoterOptionsData.getPromoterOptions.filter((promoter: any) =>
      promoter.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [promoterOptionsData, searchText]);

  // Encontrar o promotor selecionado
  const selectedPromoter = React.useMemo(() => {
    if (!internalUserId || !promoterOptionsData?.getPromoterOptions) return null;
    return promoterOptionsData.getPromoterOptions.find((promoter: any) => promoter.value === internalUserId);
  }, [internalUserId, promoterOptionsData]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View style={{ width: 320, backgroundColor: '#fff', height: '100%', padding: 24, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 }}>
          {/* Ícone de fechar no topo direito */}
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <Icon name="close" size={28} color="#222" />
          </TouchableOpacity>
          
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 18, color: '#222', marginTop: 8 }}>Filtrar</Text>
          
          {/* Filtro por data */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#666' }}>Data</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 24 }}>
            <Text>
              {internalDate
                ? internalDate.toLocaleDateString()
                : 'Selecione a data'}
            </Text>
          </TouchableOpacity>

          {/* Filtro por usuário */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#666' }}>Promotor</Text>
          <TouchableOpacity 
            onPress={() => setShowUserPicker(!showUserPicker)} 
            style={{ 
              borderWidth: 1, 
              borderColor: '#ccc', 
              borderRadius: 6, 
              padding: 10, 
              marginBottom: showUserPicker ? 0 : 24,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ flex: 1 }}>
              {selectedPromoter ? selectedPromoter.label : 'Selecione o promotor'}
            </Text>
            <Icon name={showUserPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#666" />
          </TouchableOpacity>

          {/* Dropdown de promotores */}
          {showUserPicker && (
            <View style={{ 
              borderWidth: 1, 
              borderColor: '#ccc', 
              borderRadius: 6, 
              marginBottom: 24,
              maxHeight: 200
            }}>
              <TextInput
                placeholder="Buscar promotor..."
                value={searchText}
                onChangeText={setSearchText}
                style={{ 
                  padding: 10, 
                  borderBottomWidth: 1, 
                  borderBottomColor: '#eee',
                  fontSize: 14
                }}
              />
              <ScrollView style={{ maxHeight: 150 }}>
                {loadingPromoters ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>Carregando...</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setInternalUserId(undefined);
                        setShowUserPicker(false);
                        setSearchText('');
                      }}
                      style={{ 
                        padding: 12, 
                        borderBottomWidth: 1, 
                        borderBottomColor: '#eee',
                        backgroundColor: internalUserId === undefined ? '#f0f0f0' : 'transparent'
                      }}
                    >
                      <Text style={{ color: '#666', fontStyle: 'italic' }}>Todos os promotores</Text>
                    </TouchableOpacity>
                    {filteredPromoters.map((promoter: any) => (
                      <TouchableOpacity
                        key={promoter.value}
                        onPress={() => {
                          setInternalUserId(promoter.value);
                          setShowUserPicker(false);
                          setSearchText('');
                        }}
                        style={{ 
                          padding: 12, 
                          borderBottomWidth: 1, 
                          borderBottomColor: '#eee',
                          backgroundColor: internalUserId === promoter.value ? '#f0f0f0' : 'transparent'
                        }}
                      >
                        <Text style={{ color: '#222' }}>{promoter.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </ScrollView>
            </View>
          )}

          <DatePickerModal
            locale="pt"
            mode="single"
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
            date={internalDate}
            onConfirm={handleConfirmDate}
            saveLabel="Confirmar"
            label="Selecione a data"
            animationType="slide"
          />
          
          {/* Botão aplicar filtro */}
          <RNButton title="Aplicar filtro" onPress={handleApply} color="#6600CC" />
          
          {/* Botão limpar filtro */}
          <TouchableOpacity onPress={handleClear} style={{ marginTop: 12, alignSelf: 'center' }}>
            <Text style={{ color: '#CC0066', fontWeight: 'bold' }}>Limpar filtro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 