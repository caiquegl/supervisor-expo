import React, { Fragment, useState } from "react";
import { Box, Flex, HStack, Image, Text } from "native-base";
import Store from '../../assets/icon/store.svg'
import StorePrimary from '../../assets/icon/store-primary.svg'
import Pendent from '../../assets/icon/clock-pendent.svg'
import Complete from '../../assets/icon/check-circle.svg'
import Inprogress from '../../assets/icon/check-circle-progress.svg'
import Bag from '../../assets/icon/shopping-bag.svg'
import Battery from "../../assets/icon/battery-bolt.svg";
import { TouchableOpacity } from 'react-native'
import Lightbox from 'react-native-lightbox-v2';
import { View } from 'react-native'
import { Button } from "@/styles/style.sigin";
import { Navigator, router } from "expo-router";

interface IProps {
    data: {
        id: number
        status: string
        pdv_name: string
        pdv_address: string
        dt_visit: string
        check_in_date: string
        check_out_date: string
        check_in_battery: string
        check_out_battery: string
        check_in_photo: string
        check_out_photo: string
        count_store_task_pendent: number
        count_store_task_complete: number
        count_product_task_pendent: number
        count_product_task_complete: number
        total_task: number,
    }
}
export const Card = ({ data }: IProps) => {
    const [openMenu, setOpenMenu] = useState(false)
    const [open, setOpen] = useState(false)

    return (
        <View>
            <Box py="20px">
                <Flex
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    h="20px"
                >
                    <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Store width="20px" height="20px" />
                        <Text ml="10px" mr="10px" fontSize="15px" color="#2E2F34" fontWeight="bold">
                            {data.pdv_name && data.pdv_name.split('').length < 20
                                ? data.pdv_name
                                : data.pdv_name && data.pdv_name.split('').length > 0
                                    ? (
                                        <>
                                            {data.pdv_name.split('').map((char: any, number) => (
                                                <Fragment key={number}>
                                                    {number < 20 && char}
                                                </Fragment>
                                            ))}
                                            {data.pdv_name.split('').length >= 20 && '...'}
                                        </>
                                    )
                                    : null
                            }
                        </Text>

                        {data.status === 'PENDENT' &&
                            <Pendent width="20px" height="20px" />
                        }
                        {data.status === 'IN_PROGRESS' &&
                            <Inprogress width="20px" height="20px" />
                        }
                        {data.status === 'COMPLETE' &&
                            <Complete width="20px" height="20px" />
                        }
                    </Flex>
                </Flex>
                {/* <HStack
                    space="15px"
                    justifyContent="center"
                    borderRadius="7px"
                    bg="#F7F0FE"
                    alignItems="center"
                    h="30px"
                    mt="15px"
                >
                    <HStack space="7px" alignItems="center">
                        <Bag width={20} height={20} />
                        <Text
                            fontSize="10px"
                            color="#6600CC"
                        >
                            {data.count_store_task_complete}/{data.count_store_task_complete + data.count_store_task_pendent} tarefas
                        </Text>
                    </HStack>
                    <HStack space="7px" alignItems="center">
                        <StorePrimary width={20} height={20} />
                        <Text
                            fontSize="10px"
                            color="#6600CC"
                        >
                            {data.count_product_task_complete}/{data.count_product_task_complete + data.count_product_task_pendent} tarefas
                        </Text>
                    </HStack>
                    <Text
                        fontSize="10px"
                        color="#6600CC"
                    >
                        {data.count_store_task_complete + data.count_product_task_pendent + data.count_store_task_complete + data.count_store_task_pendent} tarefas
                    </Text>
                </HStack> */}
                <HStack space="7px" mt="15px" h="18px">
                    <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                        Loja:
                    </Text>
                    <Text fontSize="13px" color="#4C4C4C">
                        {data.pdv_name && data.pdv_name.length < 20
                            ? data.pdv_name
                            : data.pdv_name && data.pdv_name.length > 0
                                ? (
                                    <>
                                        {data.pdv_name.split('').map((char: any, number) => (
                                            <Fragment key={number}>
                                                {number < 20 && char}
                                            </Fragment>
                                        ))}
                                        {data.pdv_name.length >= 20 && '...'}
                                    </>
                                )
                                : null
                        }
                    </Text>

                </HStack>
                <HStack space="7px" mt="15px" h="18px">
                    <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                        Endereço:
                    </Text>
                    <Text fontSize="13px" color="#4C4C4C" >
                        {data.pdv_address && data.pdv_address.split('').length < 20
                            ? data.pdv_address
                            : data.pdv_address && data.pdv_address.split('').length > 0
                                ? data.pdv_address.split('').map((char: any, number) => (
                                    <Fragment key={number}>
                                        {number < 20 && char}
                                    </Fragment>
                                ))
                                : null
                        }
                        {data.pdv_address && data.pdv_address.split('').length >= 20 && '...'}

                    </Text>
                </HStack>
                <HStack space="7px" mt="15px" h="18px">
                    <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                        Data:
                    </Text>
                    <Text fontSize="13px" color="#4C4C4C" >
                        {data.dt_visit}
                    </Text>
                </HStack>
                {data.status != 'PENDENT' &&
                    <>
                        <HStack space="7px" mt="15px" h="18px">
                            <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                Check-in:
                            </Text>
                            <Text fontSize="13px" color="#4C4C4C" >
                                {data.check_in_date}
                            </Text>
                        </HStack>
                        <HStack space="7px" h="20px">
                            <Battery width={15} height={15} />
                            <Text fontSize="13px" color="#4C4C4C" >
                                {data.check_in_battery}%
                            </Text>
                        </HStack>
                        {data.status == 'COMPLETE' &&
                            <>

                                <HStack space="7px" mt="15px" h="18px">
                                    <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                        Check-out:
                                    </Text>
                                    <Text fontSize="13px" color="#4C4C4C" >
                                        {data.check_out_date}
                                    </Text>
                                </HStack>
                                <HStack space="7px" h="20px">
                                    <Battery width={15} height={15} />
                                    <Text fontSize="13px" color="#4C4C4C" >
                                        {data.check_out_battery}%
                                    </Text>
                                </HStack>
                            </>
                        }

                        <HStack space="10px" mt="15px" h="105px">
                            {data.check_in_photo &&
                                <View style={{ width: 91, height: 91 }}>
                                    <Lightbox navigator={Navigator}>
                                        <Image source={{ uri: data.check_in_photo }} style={{ width: '100%', height: '100%' }} />

                                    </Lightbox>
                                </View>
                            }
                            {data.check_out_photo &&
                                <View style={{ width: 91, height: 91 }}>
                                    <Lightbox navigator={Navigator}>
                                        <Image source={{ uri: data.check_out_photo }} style={{ width: '100%', height: '100%' }} />

                                    </Lightbox>
                                </View>
                            }
                        </HStack>
                        {data.status != 'PENDENT' &&
                            <View style={{ width: '100%', justifyContent: "center", alignItems: "center" }}>
                                <Button style={{ marginTop: 0, height: 40, width: '100%' }}
                                    onPress={() => router.push({ pathname: './pictures', params: data })}
                                >
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Ver fotos</Text>
                                </Button>
                            </View>
                        }


                    </>
                }

                {/* <ModalEditVisit closeAlert={(close) => setOpen(close)} visible={open} />
            <ModalTask closeAlert={(close) => setOpenMenu(close)} visible={openMenu} /> */}
            </Box>
        </View>
    )
};
