import React, { memo } from "react";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { Box, Flex, Spinner, Text } from "native-base";
import UserCheck from '../../assets/icon/user-check.svg'
import UserTime from '../../assets/icon/user-times-red.svg'
import { useQuery } from "@apollo/client";
import { ON_OFF_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";

export const CardOnOff = memo(() => {
  const { filter } = userContext();
  const { data, loading } = useQuery(ON_OFF_QUERY, {
    variables: {
      filter: { ...filter, dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10) },
    },
    fetchPolicy: 'network-only',
  });

  const onOff = data?.countPromoterDash || {};
  const isLoading = loading || !onOff || Object.keys(onOff).length === 0;

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <Flex alignItems="center" justifyContent="space-between" direction="row">
        <Text color="#2e2f34" fontSize="18px" textTransform="uppercase" fontWeight="700">PROMOTORES ON/OFF</Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mt="26px"
        mb="26px"
        direction="row"
      >
        <Flex
          borderRadius="12px"
          borderWidth="1px"
          borderColor="#6600CC"
          padding="10px 14px"
          alignItems="center"
          justifyContent="center"
          minHeight="53px"
          minWidth="121px"
          backgroundColor="#F8F1FF"
          direction="row"
        >
          <UserCheck width={25} height={25} />
          <Box ml="10px">
            {isLoading ? <Spinner color="indigo.500" /> :
              <Text color="#6600CC" fontSize="22px" fontWeight="700" textAlign="center">
                {onOff?.count_with_check_in || 0}
              </Text>
            }
            <Text color="#6600CC" fontSize="11px" textAlign="center">
              Disponíveis
            </Text>
          </Box>
        </Flex>
        <Flex
          borderRadius="12px"
          borderWidth="1px"
          borderColor="#FF0001"
          padding="10px 14px"
          alignItems="center"
          justifyContent="center"
          minHeight="53px"
          minWidth="121px"
          backgroundColor="#FFF2F2"
          direction="row"
        >
          <UserTime width={25} height={25} />

          <Box ml="10px">
            {isLoading ? <Spinner color="indigo.500" /> :
              <Text color="#FF0001" fontSize="22px" fontWeight="700" textAlign="center">
                {onOff?.count_without_check_in || 0}
              </Text>
            }
            <Text color="#FF0001" fontSize="11px" textAlign="center">
              Indisponíveis
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
});
