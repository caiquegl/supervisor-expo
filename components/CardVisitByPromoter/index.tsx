import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Box, Center, Divider, Flex, Input, Spinner, Text } from "native-base";
import Icon from 'react-native-vector-icons/Feather'
import { FlatList } from 'react-native'
import { Card } from "./Card";
import { IProsVisitsByPromoter } from "../../context/types";
import { userContext } from "../../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { VISITS_BY_PROMOTER_QUERY } from "../../context/querys";

export const CardVisitByPromoter = ({ selected, navigation }: any) => {
  const { selectedPromoter, filter } = userContext();
  const [dataPromoter, setDataPromoter] = useState<IProsVisitsByPromoter | null>(null);

  const { data, loading, refetch } = useQuery(VISITS_BY_PROMOTER_QUERY, {
    variables: {
      filter: { dt_visit: filter?.dt_visit || new Date().toISOString().slice(0, 10) },
      getPromoterId: selectedPromoter?.id,
    },
    skip: !selectedPromoter?.id,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  useFocusEffect(
    useCallback(() => {
      if (selectedPromoter?.id) {
        refetch();
      }
    }, [selectedPromoter, filter, refetch])
  );

  useEffect(() => {
    if (data?.getPromoter) {
      setDataPromoter(data.getPromoter);
    }
  }, [data]);

  const keyEstractor = useCallback((item: any) => item.id.toString(), []);

  return (
    <Box
      bg="#fff"
      borderRadius="33px"
      paddingX="21px"
      paddingY="19px"
    >
      {/* <Text fontSize="18px" fontWeight="bold" mb="21px">
        EQUIPE DISPONÍVEL
      </Text> */}
      {loading ? <Spinner color="indigo.500" /> :
        <>
          {!dataPromoter?.name ? <Spinner color="indigo.500" /> :
            <>
              <Flex
                direction="row"
                alignItems="center"
                w="100%"
                mb="15px"
              >
                <Center
                  borderRadius="full"
                  bg="#6600CC"
                  w="35px"
                  h="35px"
                  alignItems="center"
                  justifyContent="center"
                  mr="10px"
                >
                  <Text
                    fontSize="20px"
                    color="#fff"
                  >
                    {dataPromoter?.name ? dataPromoter.name.split('')[0] : null}
                  </Text>
                </Center>
                <Box>
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    color="#2E2F34"
                  >
                    {dataPromoter?.name.length > 0 && dataPromoter?.name.split('').length < 20 ? dataPromoter?.name : dataPromoter?.name.split('') && dataPromoter?.name.split('').length > 0 && dataPromoter?.name.split('').map((char: any, number) => (
                      <Fragment key={number}>
                        {number < 20 && char}
                      </Fragment>
                    ))}
                    {dataPromoter?.name.length > 0 && dataPromoter?.name.split('').length >= 20 && '...'}
                  </Text>
                </Box>
              </Flex>
              <Flex
                direction="row"
                alignItems="center"
                mb="15px"
              >
                <Icon
                  name="wifi"
                  size={20}
                  style={{ color: '#2E2F34' }}
                />
                <Text
                  ml="7px"
                  fontSize="13px"
                  color="#4C4C4C"
                >
                  {selectedPromoter?.sync_last_change}
                </Text>
              </Flex>
              <FlatList
                data={dataPromoter?.visits}
                keyExtractor={keyEstractor}
                renderItem={({ item, index }: any) => {
                  return (
                    <>
                      <Card data={item} />
                      {dataPromoter?.visits && index != dataPromoter?.visits.length - 1 && <Divider />}
                    </>
                  )
                }}
                maxToRenderPerBatch={2}
                windowSize={5}
              />
            </>
          }
        </>
      }
    </Box >
  );
};
