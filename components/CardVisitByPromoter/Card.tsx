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
import { Ionicons } from '@expo/vector-icons';

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
        option_justify: string
        obs_justify: string
        picture_justify: string
        promoter_name?: string
        industries?: any[]
        created_at?: string
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
                        <Text ml="10px" mr="10px" fontSize="15px" color="#2E2F34" fontWeight="bold" style={{ flexWrap: 'wrap', flex: 1 }}>
                            {data.pdv_name}
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

                        {data.status === 'JUSTIFIED_ABSENCE' &&
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="rgb(255, 128, 66)"
                            />
                        }
                    </Flex>
                </Flex>


                <HStack space="7px" mt="15px" h="18px">
                    <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                        Endereço:
                    </Text>
                    <Text fontSize="13px" color="#4C4C4C" style={{ flexWrap: 'wrap', flex: 1 }}>
                        {data.pdv_address}
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
                {data.status === 'JUSTIFIED_ABSENCE' &&
                    <>
                        <View style={{ marginTop: 10, backgroundColor: '#fae7c9', padding: 10, borderRadius: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center', maxWidth: 100  }}>
                            <Text style={{ color: 'rgb(255, 128, 66)', fontSize: 14, fontWeight: 'bold' }}>Justificado</Text>
                        </View>
                        <HStack space="7px" mt="15px" h="18px">
                            <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                Motivo:
                            </Text>
                            <Text fontSize="13px" color="#4C4C4C" >
                                {data.option_justify || 'Não informado'}
                            </Text>
                        </HStack>
                        {data.obs_justify && (
                            <HStack space="7px" mt="15px" h="18px">
                                <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                    Observação:
                                </Text>
                                <Text fontSize="13px" color="#4C4C4C" >
                                    {data.obs_justify}
                                </Text>
                            </HStack>
                        )}
                        {data.picture_justify && (
                            <HStack space="7px" mt="15px" h="18px">
                                <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                    Foto da justificativa:
                                </Text>
                                <View style={{ width: 91, height: 91 }}>
                                    <Lightbox navigator={Navigator}>
                                        <Image source={{ uri: data.picture_justify }} style={{ width: '100%', height: '100%' }} />
                                    </Lightbox>
                                </View>
                            </HStack>
                        )}
                    </>
                }
                {data.status == 'IN_PROGRESS' || data.status == 'COMPLETE' ?
                    <>
                        {data.status != 'PENDENT' && data.status != 'JUSTIFIED_ABSENCE' &&
                            <HStack space="7px" mt="15px" h="18px">
                                <Text fontSize="13px" color="#4C4C4C" fontWeight="bold">
                                    Check-in:
                                </Text>
                                <Text fontSize="13px" color="#4C4C4C" >
                                    {data.check_in_date}
                                </Text>
                            </HStack>
                        }
                        {data.status != 'PENDENT' && data.status != 'JUSTIFIED_ABSENCE' &&

                            <HStack space="7px" h="20px">
                                <Battery width={15} height={15} />
                                <Text fontSize="13px" color="#4C4C4C" >
                                    {data.check_in_battery}%
                                </Text>
                            </HStack>
                        }
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

                        {data.check_in_photo || data.check_out_photo ?
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
                            : null}
                            <View style={{ width: '100%', justifyContent: "center", alignItems: "center" }}>
                                <Button style={{ marginTop: 0, height: 40, width: '100%' }}
                                    onPress={() => router.push({ pathname: './pictures', params: data })}
                                >
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Ver fotos</Text>
                                </Button>
                            </View>
                        


                    </>
                : null}

                {/* Botão de detalhes para todas as visitas (incluindo pendentes e justificadas) */}
                <View style={{ width: '100%', justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                    <Button 
                        style={{ marginTop: 0, height: 40, width: '100%', backgroundColor: '#4B0082' }}
                        onPress={() => router.push({ 
                            pathname: './visitDetails', 
                            params: { 
                                ...data, 
                                industries: data.industries ? JSON.stringify(data.industries) : '[]' 
                            } 
                        })}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Detalhes da visita</Text>
                    </Button>
                </View>

                {/* <ModalEditVisit closeAlert={(close) => setOpen(close)} visible={open} />
            <ModalTask closeAlert={(close) => setOpenMenu(close)} visible={openMenu} /> */}
            </Box>
        </View>
    )
};
