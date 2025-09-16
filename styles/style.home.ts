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
`;

export const ContainerIcon = styled.View`
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
  margin-top: 22px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 27px;
`;

export const ContainerText = styled.View`
  margin-left: 30px;
`;

export const TextName = styled.Text`
  font-weight: 600;
  font-size: 22px;
  color: #fff;
  max-width: 250px;
`;

export const TextNameSmall = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-top: 10px;
  max-width: 300px;
`;

export const ContainerBody = styled.View`
  background-color: #f9f9f9;
  border-top-left-radius: 44px;
  border-top-right-radius: 44px;
  flex: 1;
  padding: 24px 21px;
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

export const ContainerCalendar = styled.TouchableOpacity`
  margin-top: 13px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px;
  height: 37px;
  background-color: #f6edff;
  border-radius: 7px;
  z-index: 999;
`;

export const ContainerCardStatus = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 26px;
`;

export const TitlePage = styled.Text`
  font-size: 18px;
  color: #2E2F34;
  font-weight: bold;
`

export const RowTitlePage = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 0 21px;
  margin-bottom: 29px;

`
