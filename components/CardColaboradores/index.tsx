import React, { memo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Divider, Flex, Spinner, Text } from "native-base";
import UserCheck from '../../assets/icon/user-check-green.svg'
import UserTime from '../../assets/icon/user-times-red.svg'
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { COLABORATORS_QUERY, LIST_PROMOTERS_WITH_CHECK_IN_QUERY, LIST_PROMOTERS_WITHOUT_CHECK_IN_QUERY } from "../../context/querys";
import { userContext } from "../../context/userContext";
import { IPropsPromoterWithCheckIn } from "../../context/types";
import { PromotersModal } from "../PromotersModal";

export const CardColaboradores = memo(() => {
  const { filter } = userContext();
  const [showWithModal, setShowWithModal] = useState(false);
  const [showWithoutModal, setShowWithoutModal] = useState(false);

  const queryFilter = {
    ...filter,
    dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10),
  };

  const { data, loading } = useQuery(COLABORATORS_QUERY, {
    variables: { filter: queryFilter },
    fetchPolicy: 'network-only',
  });

  const { data: withData, loading: withLoading } = useQuery(LIST_PROMOTERS_WITH_CHECK_IN_QUERY, {
    variables: { filter: queryFilter },
    fetchPolicy: 'network-only',
    skip: !showWithModal,
  });

  const { data: withoutData, loading: withoutLoading } = useQuery(LIST_PROMOTERS_WITHOUT_CHECK_IN_QUERY, {
    variables: { filter: queryFilter },
    fetchPolicy: 'network-only',
    skip: !showWithoutModal,
  });

  const colaborators = data?.countPromoterDash || {};
  const isLoading = loading || !colaborators || Object.keys(colaborators).length === 0;
  const hasData = colaborators && colaborators.total !== undefined;
  const promotersWithCheckIn: IPropsPromoterWithCheckIn[] = withData?.listPromotersWithCheckIn || [];
  const promotersWithoutCheckIn: IPropsPromoterWithCheckIn[] = withoutData?.listPromotersWithoutCheckIn || [];

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      <Flex alignItems="center" justifyContent="space-between" direction="row">
        <Text flex={1} color="#2e2f34" fontSize="18px" textTransform="uppercase" fontWeight="700" numberOfLines={1} adjustsFontSizeToFit>Colaboradores</Text>
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
            <UserCheck width={25} height={25} />
            <Box ml="10px">
              {isLoading ? <Spinner color="indigo.500" /> :
                <Text color="#0AB200" fontSize="22px" fontWeight="700" textAlign="center">
                  {colaborators?.count_with_check_in || 0}
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
            <UserTime width={25} height={25} />
            <Box ml="10px">
              {isLoading ? <Spinner color="indigo.500" /> :
                <Text color="#FF0001" fontSize="22px" fontWeight="700" textAlign="center">
                  {colaborators?.count_without_check_in || 0}
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
        Totais: {hasData ? colaborators.total : 0}
      </Text>

      <PromotersModal
        visible={showWithModal}
        onClose={() => setShowWithModal(false)}
        title="Colaboradores c/ Entrada"
        color="#0AB200"
        icon={<UserCheck width={20} height={20} />}
        promoters={promotersWithCheckIn}
        loading={withLoading}
        showTimes
        emptyMessage="Nenhum colaborador com entrada registrada."
        onPressItem={(promoter) => {
          setShowWithModal(false);
          router.push({
            pathname: "/(main)/visitDetails",
            params: {
              id: String(promoter.visit_id),
              status: promoter.visit_status ?? "",
              promoter_name: promoter.name,
              pdv_name: promoter.pdv_name ?? "",
              pdv_address: promoter.pdv_address ?? "",
              dt_visit: queryFilter.dt_visit,
              created_at: promoter.created_at ?? "",
              check_in_date: promoter.first_check_in ?? "",
              check_out_date: promoter.last_check_out ?? "",
              industries: JSON.stringify(promoter.industries ?? []),
            },
          });
        }}
      />

      <PromotersModal
        visible={showWithoutModal}
        onClose={() => setShowWithoutModal(false)}
        title="Colaboradores s/ Entrada"
        color="#FF0001"
        icon={<UserTime width={20} height={20} />}
        promoters={promotersWithoutCheckIn}
        loading={withoutLoading}
        showTimes={false}
        showContacts
        emptyMessage="Todos os colaboradores já registraram entrada."
      />
    </Box>
  );
});
