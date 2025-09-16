import styled from "styled-components/native";

export const ContainerCard = styled.View`
  background-color: #fff;
  border-radius: 33px;
  padding: 19px 21px;
`;

export const ContainerIconCard = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextTitleCard = styled.Text`
  color: #2e2f34;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
`;

export const ContainerCardStatus = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 26px;
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