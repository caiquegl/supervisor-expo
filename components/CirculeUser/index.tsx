import React from "react";
import { ContainerIcon, ContainerName, TextName } from "./style";
interface Props {
  name: string;
}

export const CirculeUser = ({ name }: Props) => {
  return (
    <ContainerIcon>
      <ContainerName>
        <TextName>{name}</TextName>
      </ContainerName>
    </ContainerIcon>
  );
};
