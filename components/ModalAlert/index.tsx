import React from 'react';
import {Dialog, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ContainerIcon,
  ContainerTitle,
  Title,
  Description,
  Gradient,
  ButtonStle,
  TextButton,
  ContainerButton,
  ContainerButtonCancel,
} from './style';
import { theme } from '@/theme';
interface Props {
  visible: boolean;
  closeAlert: (close: boolean) => void;
  confirm?: (close: boolean) => void;
  title: string;
  msg: string;
  icon?: string;
}

export const ModalAlert = ({
  visible,
  closeAlert,
  title,
  msg,
  confirm,
  icon,
}: Props) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => closeAlert(false)}
        style={{backgroundColor: '#fff'}}>
        {icon && (
          <ContainerIcon>
            <Icon
              name={icon}
              size={40}
              color={theme.colors.secondary}
              style={{alignSelf: 'center'}}
            />
          </ContainerIcon>
        )}
        <ContainerTitle>
          <Title>{title}</Title>
        </ContainerTitle>
        <Description>{msg}</Description>
        {confirm ? (
          <>
            <ButtonStle
              onPress={() => confirm(false)}
              style={{margin: 0, padding: 0}}>
              <ContainerButton
                end={{x: 1, y: 1}}
                style={{backgroundColor: theme.colors.primary}}>
                <TextButton>Confirmar</TextButton>
              </ContainerButton>
            </ButtonStle>
            <ButtonStle onPress={() => closeAlert(false)}>
              <ContainerButtonCancel>
                <TextButton style={{color: '#ff872c'}}>Cancelar</TextButton>
              </ContainerButtonCancel>
            </ButtonStle>
          </>
        ) : (
          <ButtonStle onPress={() => closeAlert(false)}>
            <Gradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{backgroundColor: theme.colors.primary}}>
              <TextButton>OK</TextButton>
            </Gradient>
          </ButtonStle>
        )}
      </Dialog>
    </Portal>
  );
};
