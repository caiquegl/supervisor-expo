import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
  flex: 1;
  background-color: #6600cc;
`;

export const ActionsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-top: ${RFValue(28)}px;
  padding-bottom: 20px;
`;

export const ContainerIconPrimary = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TextLogo = styled.Text`
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const ContainerIconCenter = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

export const ContainerSearch = styled.View`
  margin-bottom: 27px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ContainerInput = styled.View`
  background-color: #f6edff;
  border-radius: 19px;
  align-items: center;
  justify-content: space-between;
  width: 266px;
  flex-direction: row;
  padding: 0 10px;
`;

export const Input = styled.TextInput`
  font-size: 16px;
  color: #000;
  width: 226px;
  height: 40px;
  text-decoration: none;
`;
export const ContainerText = styled.View``;

export const TextName = styled.Text`
  font-weight: 700;
  font-size: 22px;
  color: #fff;
`;

export const TextNameSmall = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-top: 10px;
`;

export const ContainerBody = styled.View`
  background-color: #f9f9f9;
  border-top-left-radius: 44px;
  border-top-right-radius: 44px;
  flex: 1;
  padding: 24px 21px;
  margin-top: 25px;
`;

export const ContainerCard = styled.View`
  background-color: #fff;
  border-radius: 33px;
  padding: 19px 21px;
`;

export const TextTitleCard = styled.Text`
  color: #2e2f34;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
`;

export const ContainerIconCard = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerCardStatus = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 26px;
`;

export const ContainerPagination = styled.View`
  width: 100%;
  flex-direction: row;
  margin-right: 15px;
  align-items: center;
  margin-top: 20px;
  justify-content: center;
`;

export const ButtonArrow = styled.View`
  align-items: center;
  justify-content: center;
  background-color: #9933ff;
  border-radius: 7px;
  width: 35px;
  height: 35px;
  margin-right: 15px;
  margin-left: 15px;
  margin-bottom: 20px;
`;

interface Props {
  active?: boolean;
}
export const NumericPagination = styled.Text<Props>`
  font-size: 13px;
  color: ${({ active }: any) => (active ? "#9933ff" : "#2E2F34")};
  margin: 0 10px;
`;

export const ButtonBack = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  background-color: #b56aff;
  align-items: center;
  justify-content: center;
`;
