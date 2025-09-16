import moment from 'moment';
import React from 'react';
import { Modal, TouchableOpacity, View, Button as RNButton, Text, ScrollView, TextInput, FlatList } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyQuery } from '@apollo/client';
import { PROMOTER_OPTIONS_QUERY } from '../../context/querys';
import { userContext } from '@/context/userContext';

interface FilterDrawerProps {
  visible: boolean;
  selectedDate: Date | undefined;
  selectedPromoter: number | undefined;
  promoterOptions: Array<{ label: string; value: number }>;
  onApplyFilters: (filters: { date: any | undefined; userId: number | undefined }) => void;
  onClear: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  selectedDate,
  selectedPromoter,
  promoterOptions,
  onApplyFilters,
  onClear,
  onClose,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showPromoterList, setShowPromoterList] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(selectedDate);
  const [internalPromoter, setInternalPromoter] = React.useState<number | undefined>(selectedPromoter);
  const [searchPromoter, setSearchPromoter] = React.useState('');
  const [filteredPromoters, setFilteredPromoters] = React.useState<Array<{ label: string; value: number }>>([]);

  // Atualiza os valores internos quando o drawer é aberto ou os valores externos mudam
  React.useEffect(() => {
    if (visible) {
      setInternalDate(selectedDate);
      setInternalPromoter(selectedPromoter);
      setSearchPromoter(getPromoterLabel(selectedPromoter));
      setFilteredPromoters(promoterOptions);
      setShowPromoterList(false);
    }
  }, [visible, selectedDate, selectedPromoter, promoterOptions]);

  // Filtra promotores baseado na pesquisa
  React.useEffect(() => {
    if (searchPromoter.trim() === '') {
      setFilteredPromoters(promoterOptions);
    } else {
      const filtered = promoterOptions.filter(promoter =>
        promoter.label.toLowerCase().includes(searchPromoter.toLowerCase())
      );
      setFilteredPromoters(filtered);
    }
  }, [searchPromoter, promoterOptions]);

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

  const handlePromoterSelect = (promoter: { label: string; value: number }) => {
    setInternalPromoter(promoter.value);
    setSearchPromoter(promoter.label);
    setShowPromoterList(false);
  };

  const handlePromoterInputPress = () => {
    setShowPromoterList(!showPromoterList);
    if (!showPromoterList) {
      setSearchPromoter('');
      setFilteredPromoters(promoterOptions);
    }
  };

  const handleApply = () => {
    // Envia todos os filtros de uma vez
    const newDate = internalDate ? moment(internalDate).format('YYYY-MM-DD') : undefined;
    onApplyFilters({
      date: newDate,
      userId: internalPromoter
    });
  };

  const handleClear = () => {
    // Reseta estado interno
    setInternalDate(moment().toDate());
    setInternalPromoter(undefined);
    setSearchPromoter('');
    setShowPromoterList(false);
    
    // Limpa filtros externos
    onClear();
  };

  const getPromoterLabel = (promoterId: number | undefined) => {
    if (!promoterId) return '';
    const promoter = promoterOptions.find(p => p.value === promoterId);
    return promoter ? promoter.label : '';
  };

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
          
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 18, color: '#222', marginTop: 8 }}>Filtros</Text>
          
          {/* Filtro de Data */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' }}>Data</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 24 }}>
            <Text>
              {internalDate
                ? internalDate.toLocaleDateString()
                : 'Selecione a data'}
            </Text>
          </TouchableOpacity>

          {/* Filtro de Promotor */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' }}>Promotor</Text>
          
          {/* Campo de seleção de promotor */}
          <TouchableOpacity onPress={handlePromoterInputPress} style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            backgroundColor: '#fff',
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 10
          }}>
            <TextInput
              value={searchPromoter}
              onChangeText={setSearchPromoter}
              placeholder="Selecione um promotor..."
              style={{
                padding: 10,
                color: '#2E2F34',
                fontSize: 16,
                flex: 1,
              }}
              editable={showPromoterList}
              onFocus={() => setShowPromoterList(true)}
            />
            <Icon 
              name={showPromoterList ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#8f8f8f" 
            />
          </TouchableOpacity>

          {/* Lista dropdown de promotores (só aparece quando aberta) */}
          {showPromoterList && filteredPromoters.length > 0 && (
            <View style={{
              maxHeight: 200,
              marginBottom: 24,
              backgroundColor: '#fff',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              position: 'relative',
              zIndex: 1000,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}>
              <FlatList
                style={{ flexGrow: 0 }}
                data={filteredPromoters}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handlePromoterSelect(item)}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f0f0f0',
                      backgroundColor: internalPromoter === item.value ? '#f0e6ff' : '#fff',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 16,
                      color: internalPromoter === item.value ? '#6600CC' : '#2E2F34',
                      fontWeight: internalPromoter === item.value ? '600' : '400'
                    }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
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
          <RNButton title="Aplicar filtros" onPress={handleApply} color="#6600CC" />
          
          {/* Botão limpar filtros */}
          <TouchableOpacity onPress={handleClear} style={{ marginTop: 12, alignSelf: 'center' }}>
            <Text style={{ color: '#CC0066', fontWeight: 'bold' }}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 