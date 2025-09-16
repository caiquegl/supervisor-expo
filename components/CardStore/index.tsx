import React, { memo } from "react";
import ElippseGray from "../../assets/icon/ellipsis-v-gray.svg";
import { Box, Divider, Flex, Spinner, Text } from "native-base";
import StoreGreen from '../../assets/icon/store-green.svg'
import StoreRed from '../../assets/icon/store-red.svg'
import { useQuery } from "@apollo/client";
import { STORES_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";

export const CardStore = memo(() => {
  const { filter } = userContext();
  const { data, loading } = useQuery(STORES_QUERY, {
    variables: {
      filter: {
        ...filter,
        dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const store = data?.countPdvDash || {};
  const isLoading = loading;
  const hasData = store && store.total !== undefined;

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <Flex alignItems="center" justifyContent="space-between" direction="row">
        <Text color="#2e2f34" fontSize="18px" textTransform="uppercase" fontWeight="700">Lojas</Text>
        <ElippseGray width={20} height={20} />
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
          borderColor="#0AB200"
          padding="10px 14px"
          alignItems="center"
          justifyContent="center"
          minHeight="53px"
          minWidth="121px"
          backgroundColor="#D6FFD4"
          direction="row"
        >
          <StoreGreen width={25} height={25} />
          <Box ml="10px">
            {isLoading ? <Spinner color="indigo.500" /> :
              <Text color="#0AB200" fontSize="22px" fontWeight="700" textAlign="center">
                {store?.count_with_check_in || 0}
              </Text>
            }
            <Text color="#0AB200" fontSize="11px" textAlign="center">
              C/ Entrada
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
          <StoreRed width={25} height={25} />

          <Box ml="10px">
            {isLoading ? <Spinner color="indigo.500" /> :
              <Text color="#FF0001" fontSize="22px" fontWeight="700" textAlign="center">
                {store?.count_without_check_in || 0}
              </Text>
            }
            <Text color="#FF0001" fontSize="11px" textAlign="center">
              S/ Entrada
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Divider />
      <Text w="100%" textAlign="right" fontSize="18px" fontWeight="medium" color="#2E2F34">
        Totais: {hasData ? store.total : 0}
      </Text>
    </Box>
  );
});
