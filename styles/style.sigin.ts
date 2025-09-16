import styled from "styled-components/native";
import { TextInputMask } from "react-native-masked-text";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableHighlight, TouchableOpacity } from "react-native";

export const Container = styled.View`
  background-color: #6600cc;
  width: 100%;
  height: 100%;
  padding: 0;
`;

export const ContainerIcon = styled.View`
  position: absolute;
  top: 33px;
  left: 34px;
  flex-direction: row;
`;

export const ContainerIconRight = styled.View`
  position: absolute;
  top: 33px;
  right: 34px;
  flex-direction: row;
`;

export const TextLogo = styled.Text`
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;
export const Body = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  flex: 1;
`;
export const BigText = styled.Text`
  font-weight: bold;
  font-size: 28px;
  color: #fff;
  text-align: center;
  margin-top: 23px;
  margin-bottom: 39px;
`;
export const Input = styled.TextInput`
  border-bottom-color: #fff;
  border-bottom-width: 2px;
  width: 285px;
  color: #fff;
  font-size: 20px;
`;

export const InputMask = styled(TextInputMask)`
  border-bottom-color: #fff;
  border-bottom-width: 2px;
  width: 285px;
  color: #fff;
  font-size: 20px;
`;

export const Button = styled(TouchableOpacity)`
  margin-top: ${RFValue(47)}px;
  width: 240px;
  height: 55px;
  border-radius: 18px;
  background-color: #eeddfe;
  align-items: center;
  justify-content: center;
`;

export const TextButton = styled.Text`
  text-align: center;
  font-size: 15px;
  color: #9933ff;
  font-weight: bold;
`;

export const ContainerInput = styled.View``;

export const Label = styled.Text`
  color: #eeddff;
  font-size: 15px;
`;

export const ContainerBG = styled.View`
  position: absolute;
  align-self: center;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
