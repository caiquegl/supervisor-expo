import React, { memo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Divider, Flex, Spinner, Text } from "native-base";
import StoreGreen from '../../assets/icon/store-green.svg'
import StoreRed from '../../assets/icon/store-red.svg'
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { STORES_QUERY, LIST_PDVS_WITH_CHECK_IN_QUERY, LIST_PDVS_WITHOUT_CHECK_IN_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { IPropsPdvWithCheckIn } from "../../context/types";
import { StoresModal } from "../StoresModal";

export const CardStore = memo(() => {
  const { filter } = userContext();
  const [showWithModal, setShowWithModal] = useState(false);
  const [showWithoutModal, setShowWithoutModal] = useState(false);

  const queryFilter = {
    ...filter,
    dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
  };

  // PDV filters only accept dt_visit, state, team — strip any extra context fields
  const pdvQueryFilter = {
    dt_visit: queryFilter.dt_visit,
    ...(queryFilter.state ? { state: queryFilter.state } : {}),
    ...(queryFilter.team ? { team: queryFilter.team } : {}),
  };

  const { data, loading } = useQuery(STORES_QUERY, {
    variables: { filter: pdvQueryFilter },
    fetchPolicy: 'cache-and-network',
  });

  const { data: withData, loading: withLoading } = useQuery(LIST_PDVS_WITH_CHECK_IN_QUERY, {
    variables: { filter: pdvQueryFilter },
    fetchPolicy: 'network-only',
    skip: !showWithModal,
  });

  const { data: withoutData, loading: withoutLoading } = useQuery(LIST_PDVS_WITHOUT_CHECK_IN_QUERY, {
    variables: { filter: pdvQueryFilter },
    fetchPolicy: 'network-only',
    skip: !showWithoutModal,
  });

  const store = data?.countPdvDash || {};
  const isLoading = loading;
  const hasData = store && store.total !== undefined;
  const storesWithCheckIn: IPropsPdvWithCheckIn[] = withData?.listPdvsWithCheckIn || [];
  const storesWithoutCheckIn: IPropsPdvWithCheckIn[] = withoutData?.listPdvsWithoutCheckIn || [];

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <Flex alignItems="center" justifyContent="space-between" direction="row">
        <Text flex={1} color="#2e2f34" fontSize="18px" textTransform="uppercase" fontWeight="700" numberOfLines={1} adjustsFontSizeToFit>Lojas</Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mt="26px"
        mb="26px"
        direction="row"
      >
        <TouchableOpacity onPress={() => setShowWithModal(true)} activeOpacity={0.8}>
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
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowWithoutModal(true)} activeOpacity={0.8}>
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
        </TouchableOpacity>
      </Flex>
      <Divider />
      <Text w="100%" textAlign="right" fontSize="18px" fontWeight="medium" color="#2E2F34">
        Totais: {hasData ? store.total : 0}
      </Text>

      <StoresModal
        visible={showWithModal}
        onClose={() => setShowWithModal(false)}
        title="Lojas c/ Entrada"
        color="#0AB200"
        icon={<StoreGreen width={20} height={20} />}
        stores={storesWithCheckIn}
        loading={withLoading}
        showTimes
        emptyMessage="Nenhuma loja com entrada registrada."
        onPressItem={(store) => {
          setShowWithModal(false);
          router.push({
            pathname: "/(main)/visitDetails",
            params: {
              id: String(store.visit_id),
              status: store.visit_status ?? "",
              promoter_name: store.promoter_name ?? "",
              pdv_name: store.name,
              pdv_address: store.address ?? "",
              dt_visit: pdvQueryFilter.dt_visit,
              created_at: store.created_at ?? "",
              check_in_date: store.first_check_in ?? "",
              check_out_date: store.last_check_out ?? "",
              industries: JSON.stringify(store.industries ?? []),
            },
          });
        }}
      />

      <StoresModal
        visible={showWithoutModal}
        onClose={() => setShowWithoutModal(false)}
        title="Lojas s/ Entrada"
        color="#FF0001"
        icon={<StoreRed width={20} height={20} />}
        stores={storesWithoutCheckIn}
        loading={withoutLoading}
        showTimes={false}
        emptyMessage="Todas as lojas já registraram entrada."
      />
    </Box>
  );
});
