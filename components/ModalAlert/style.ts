import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { TouchableHighlight } from "react-native";

export const ContainerIcon = styled.View`
  align-self: center;
  width: 70px;
  height: 70px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 135, 44, 0.3);
  margin-top: 30px;
`;

export const ContainerTitle = styled.View`
  width: 80%;
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: rgba(113, 88, 193, 0.3);
  border-radius: 20px;
  padding: 5px 8px;
  margin: 15px 0;
`;

export const Title = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: #7158c1;
`;

export const Description = styled.Text`
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
  width: 80%;
  align-self: center;
  letter-spacing: 1px;
  color: #363f5f;
`;

export const TextButton = styled.Text`
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 2px;
`;
export const Gradient = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${RFValue(50)}px;
  border-radius: 30px;
  align-self: center;
  margin: 20px 0;
`;

export const ContainerButton = styled.View`
  width: 100%;
  background-color: #7158c1;
  align-self: center;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
`;

export const ConfirmButton = styled(TouchableHighlight)`
  align-self: center;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  width: 100%;
`;

export const ContainerButtonCancel = styled.View`
  width: 100%;
  align-self: center;
  height: 60px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 30px;
  border-width: 2px;
  border-color: #ff872c;
`;

export const ButtonStle = styled(TouchableHighlight).attrs({
  activeOpacity: 0.7,
  underlayColor: "transparent",
})`
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 60px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
`;
