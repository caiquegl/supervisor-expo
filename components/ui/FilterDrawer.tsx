import moment from 'moment';
import React from 'react';
import { Modal, TouchableOpacity, View, Button as RNButton, Text } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FilterDrawerProps {
  visible: boolean;
  selectedDate: Date | undefined;
  onChangeDate: (date: Date | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  selectedDate,
  onChangeDate,
  onApply,
  onClear,
  onClose,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(selectedDate);

  // Atualiza o valor interno quando o drawer é aberto ou o selectedDate muda
  React.useEffect(() => {
    if (visible) {
      setInternalDate(selectedDate);
    }
  }, [visible, selectedDate]);

  const handleConfirmDate = (params: { date: Date | undefined }) => {
    setShowDatePicker(false);
    setInternalDate(params.date);
  };

  const handleApply = () => {
    onChangeDate(internalDate);
    onApply();
  };

  const handleClear = () => {
    setInternalDate(moment().toDate());
    onChangeDate(moment().toDate());
    onClear();
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 18, color: '#222', marginTop: 8 }}>Filtrar por data</Text>
          {/* Input único de data */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 24, marginTop: 24 }}>
            <Text>
              {internalDate
                ? internalDate.toLocaleDateString()
                : 'Selecione a data'}
            </Text>
          </TouchableOpacity>
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