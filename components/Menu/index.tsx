import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Platform, ScrollView, ActivityIndicator, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import SHome from "../../assets/icon/estate.svg";
import STime from "../../assets/icon/users-alt.svg";
import SStimap from "../../assets/icon/sitemap.svg";
import Logout from "../../assets/icon/signout.svg";
import { ModalAlert } from '../ModalAlert';
import { userContext } from '../../context/userContext';
import { apolloContext } from '../../context/apolloContext';
import SPlus from "../../assets/icon/plus-circle-white.svg";
import CloseDrawer from "../../assets/icon/times-black.svg";
import apiBackoffice from '../../service/apiBackoffice';
import moment from 'moment';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';

interface IProps {
    routeActive: string
}

interface SelectedSub {
    value: string;
    label: string;
    selected: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Menu = ({ routeActive }: IProps) => {
    const { logOut, user } = userContext();
    const { loadPromoterOptionsVoid, promoterOptionsData } = apolloContext();

    const [logoutModal, setLogoutModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [addVisit, setAddVisit] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [alert, setAlert] = useState<boolean>(false)

    const [selectedStore, setSelectedStore] = useState('');
    const [selectedPromoter, setSelectedPromoter] = useState('');
    const [selectedSub, setSelectedSub] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [listPromoter, setListPromoter] = useState<any>([])
    const [listPromoterInitial, setListPromoterInitial] = useState<any>([])
    const [listSub, setListSub] = useState<any>([])
    const [selectPromoter, setSelectPromoter] = useState<any>({})
    const [listStore, setListStore] = useState<any>([])
    const [selectStore, setSelectStore] = useState<any>({})
    const [selectSub, setSelectSub] = useState<any>({})

    // Novo estado para múltiplas seleções
    const [selectedSubs, setSelectedSubs] = useState<SelectedSub[]>([]);
    const [searchSubText, setSearchSubText] = useState('');

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const searchPromoter =(value: any) => {
        try {
            setSelectedPromoter(value)
            let newListPromoter = listPromoterInitial.filter((item: any) => item.label.toLowerCase().includes(value.toLowerCase()))
            setListPromoter([...newListPromoter]);
        } catch (error) {
        }
    }
    
    const searchStore = useCallback(async (value: any) => {
        try {
            setSelectedStore(value)
            apiBackoffice.defaults.headers.authorization = `Bearer ${user.token}`
            apiBackoffice.defaults.headers.workspace = user.slug
            apiBackoffice.defaults.headers.workspaceId = user.workspace_id
            let { data } = await apiBackoffice.get(`/search/pdvs?search=${value}`)
            setListStore(data);
        } catch (error) {
        }
    }, [user.token, user.slug, user.workspace_id])

    const searchSub = useCallback(async (value: any) => {
        try {
            setSearchSubText(value)
            apiBackoffice.defaults.headers.authorization = `Bearer ${user.token}`
            apiBackoffice.defaults.headers.workspace = user.slug
            apiBackoffice.defaults.headers.workspaceId = user.workspace_id
            let { data } = await apiBackoffice.get(`/search/sub-workspaces?search=${value}`)
            setListSub(data);
        } catch (error) {
        }
    }, [user.token, user.slug, user.workspace_id])

    const handleSelect = useCallback((item: any) => {
        setSelectPromoter(item);
        setSelectedPromoter(item.label)
        setListPromoter([])
    }, []);

    const handleSelectStore = useCallback((item: any) => {
        setSelectStore(item);
        setSelectedStore(item.label)
        setListStore([])
    }, []);

    // Nova função para seleção múltipla de empresas
    const handleSelectSub = useCallback((item: any) => {
        setSelectedSubs(prev => {
            const existingIndex = prev.findIndex(sub => sub.value === item.value);

            if (existingIndex >= 0) {
                // Se já existe, remove da seleção
                return prev.filter(sub => sub.value !== item.value);
            } else {
                // Se não existe, adiciona à seleção
                return [...prev, { ...item, selected: true }];
            }
        });
        setListSub([]);
        setSearchSubText('');
    }, []);

    // Função para remover empresa da seleção
    const removeSelectedSub = useCallback((value: string) => {
        setSelectedSubs(prev => prev.filter(sub => sub.value !== value));
    }, []);

    // Função para limpar todas as seleções de empresas
    const clearSelectedSubs = useCallback(() => {
        setSelectedSubs([]);
    }, []);

    // Texto para mostrar empresas selecionadas
    const selectedSubsText = useMemo(() => {
        if (selectedSubs.length === 0) return 'Nenhuma empresa selecionada';
        if (selectedSubs.length === 1) return selectedSubs[0].label;
        return `${selectedSubs.length} empresas selecionadas`;
    }, [selectedSubs]);


    // Função para resetar formulário
    const resetForm = useCallback(() => {
        setSelectPromoter({});
        setSelectedPromoter('');
        setSelectStore({});
        setSelectedStore('');
        setDate(new Date());
        setShowDatePicker(false);
        setListPromoter([]);
        setListStore([]);
        setSelectedSubs([]);
        setSearchSubText('');
        setListSub([]);
    }, []);

    // Função para fechar modal
    const closeModal = useCallback(() => {
        setAddVisit(false);
        resetForm();
    }, [resetForm]);

    useEffect(() => {
        setListPromoterInitial([...promoterOptionsData])
    }, [promoterOptionsData])

    useEffect(() => {
        loadPromoterOptionsVoid()
    }, [addVisit])

    const submitVisit = useCallback(async () => {
        try {
            if (!selectPromoter.value || !selectStore.value || !date) {
                Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (user.shared_environment && selectedSubs.length === 0) {
                Alert.alert('Erro', 'Por favor, selecione pelo menos uma empresa.');
                return;
            }

            setLoading(true)

            apiBackoffice.defaults.headers.authorization = `Bearer ${user.token}`
            apiBackoffice.defaults.headers.workspace = user.slug
            apiBackoffice.defaults.headers.workspaceId = user.workspace_id

            let { data } = await apiBackoffice.post(`/visit`, {
                "dt_visit": moment(date).format('YYYY-MM-DD'),
                "user_id": selectPromoter.value,
                "pdv_id": selectStore.value,
                "sub_workspaces": selectedSubs.map(sub => sub.value)
            })

            // Sucesso - mostrar alert, fechar modal, navegar e recarregar
            Alert.alert(
                'Sucesso!',
                'Visita adicionada com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            closeModal();
                            router.push("/(main)/home");
                            
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error('Erro ao adicionar visita:', error);
            Alert.alert(
                'Erro',
                error.response?.data?.message || 'Erro ao adicionar visita. Tente novamente.'
            );
            // Mesmo com erro, tentar redirecionar após um delay
            setTimeout(() => {
                router.push("/(main)/sigin");
            }, 2000);
        } finally {
            setLoading(false)
        }
    }, [selectPromoter, selectStore, selectedSubs, date, user.token, user.slug, user.workspace_id, user.shared_environment, closeModal])

    // Resetar formulário quando modal abrir/fechar
    useEffect(() => {
        if (!addVisit) {
            resetForm();
        }

    }, [addVisit, resetForm])

    const handleLogout = async () => {
        try {
            setLoading(true);
            setLogoutModal(false);

            await logOut();

            Toast.show({
                type: 'success',
                text1: 'Logout realizado',
                text2: 'Você foi desconectado com sucesso',
                position: 'top',
                visibilityTime: 2000,
            });

            // Forçar reload do app para garantir árvore limpa
            await Updates.reloadAsync();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro no logout',
                text2: 'Ocorreu um erro ao fazer logout',
                position: 'top',
                visibilityTime: 3000,
            });
            await Updates.reloadAsync();
        } finally {
            setLoading(false);
        }
    };

    // Função para navegação otimizada
    const handleNavigation = useCallback((route: "/(main)/home" | "/(main)/PromotersComponent" | "/(main)/programmerVisits") => {
        // Cancelar requisições em andamento antes de navegar
      
        
        // Navegação imediata
        router.push(route);
    }, []);

    return (
        <View style={{ width: '100%', backgroundColor: '#f0f2f5' }}>
            <View style={{
                elevation: 0,
                backgroundColor: "#fff",
                height: 90,
                borderTopLeftRadius: 19,
                borderTopRightRadius: 19,
                borderColor: "#fff",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 20,
                paddingRight: 20
            }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleNavigation("/(main)/home")}>
                    <SHome
                        height={25}
                        width={25}
                        color={routeActive == 'HomeButton' ? "#B56AFF" : "#000"}
                        stroke={routeActive == 'HomeButton' ? "#B56AFF" : "#000"}
                        strokeWidth={0.4}
                    />
                    <Text style={{ fontSize: 16, color: routeActive == 'HomeButton' ? "#B56AFF" : "#000" }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleNavigation("/(main)/PromotersComponent")}>
                    <STime
                        height={25}
                        width={25}
                        color={routeActive == 'PromotersComponent' || routeActive == 'PromoterDetail' ? "#B56AFF" : "#000"}
                        stroke={routeActive == 'PromotersComponent' || routeActive == 'PromoterDetail' ? "#B56AFF" : "#000"}
                        strokeWidth={0.4}
                    />
                    <Text style={{ fontSize: 16, color: routeActive == 'PromotersComponent' || routeActive == 'PromoterDetail' ? "#B56AFF" : "#000" }}>Equipe</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        top: -20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 35,
                    }}
                    onPress={() => setAddVisit(true)}
                >

                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: '#6600cc',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <SPlus
                            height={25}
                            width={25}
                            stroke={"#fff"}
                            strokeWidth={0.4}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleNavigation("/(main)/programmerVisits")}>
                    <SStimap
                        height={25}
                        width={25}
                        color={routeActive == 'programmerVisits' ? "#B56AFF" : "#000"}
                        stroke={routeActive == 'programmerVisits' ? "#B56AFF" : "#000"}
                        strokeWidth={0.4}
                    />
                    <Text style={{ fontSize: 16, color: routeActive == 'programmerVisits' ? "#B56AFF" : "#000" }}>Visitas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => setLogoutModal(true)}>
                    <Logout
                        height={25}
                        width={25}
                        color={routeActive == 'Logout' ? "#B56AFF" : "#000"}
                        stroke={routeActive == 'Logout' ? "#B56AFF" : "#000"}
                        strokeWidth={0.4}
                    />
                    <Text style={{ fontSize: 16, color: routeActive == 'Logout' ? "#B56AFF" : "#000" }}>Sair</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={logoutModal}
                transparent={true}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        padding: 20,
                        width: '80%',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 20,
                            textAlign: 'center'
                        }}>
                            Deseja sair do aplicativo?
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <TouchableOpacity 
                                onPress={() => setLogoutModal(false)}
                                disabled={loading}
                            >
                                <View style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    backgroundColor: loading ? '#e0e0e0' : '#f0f0f0'
                                }}>
                                    <Text style={{ color: loading ? '#999' : '#000' }}>Cancelar</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={handleLogout}
                                disabled={loading}
                            >
                                <View style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    backgroundColor: loading ? '#ff8888' : '#ff4444',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    {loading && <ActivityIndicator size="small" color="#fff" />}
                                    <Text style={{ color: '#fff' }}>
                                        {loading ? 'Saindo...' : 'Sair'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={addVisit}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        padding: 20,
                        width: '95%',
                        height: '90%',
                        maxHeight: 600,
                        minHeight: 350,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#2E2F34',
                                flex: 1
                            }}>
                                Adicionar Visita
                            </Text>
                            <TouchableOpacity onPress={closeModal} style={{ padding: 5 }}>
                                <CloseDrawer width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                            style={{ flex: 1 }}
                        >
                            <View style={{ marginBottom: Math.min(30, screenHeight * 0.035) }}>
                                <Text
                                    style={{
                                        fontSize: Math.min(15, screenWidth * 0.04),
                                        fontWeight: 'bold',
                                        color: '#2E2F34',
                                        marginBottom: 10,
                                    }}
                                >
                                    LOJA*
                                </Text>
                                <View style={{
                                    borderWidth: 2,
                                    borderColor: '#8f8f8f',
                                    borderRadius: 10,
                                    backgroundColor: '#fff'
                                }}>
                                    <TextInput
                                        value={selectedStore}
                                        onChangeText={searchStore}
                                        placeholder="Pesquisar loja..."
                                        style={{
                                            padding: Math.min(10, screenHeight * 0.012),
                                            color: '#2E2F34',
                                            fontSize: Math.min(16, screenWidth * 0.04),
                                        }}
                                    />
                                </View>
                                {listStore.length > 0 && (
                                    <View style={{
                                        maxHeight: Math.min(300, screenHeight * 0.5),
                                        marginTop: 20,
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: '#e0e0e0'
                                    }}>
                                        <FlatList
                                            data={listStore}
                                            style={{ flexGrow: 0 }}
                                            keyExtractor={(item) => item.value.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => handleSelectStore(item)}
                                                    style={{
                                                        padding: Math.min(10, screenHeight * 0.012),
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#f0f0f0',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: Math.min(16, screenWidth * 0.04) }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>

                            <View style={{ marginBottom: Math.min(30, screenHeight * 0.035) }}>
                                <Text
                                    style={{
                                        fontSize: Math.min(15, screenWidth * 0.04),
                                        fontWeight: 'bold',
                                        color: '#2E2F34',
                                        marginBottom: 10,
                                    }}
                                >
                                    DATA VISITA*
                                </Text>

                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <View
                                        style={{
                                            padding: Math.min(10, screenHeight * 0.012),
                                            backgroundColor: '#f7f9fc',
                                            borderColor: '#e4e9f2',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Text style={{ fontSize: Math.min(16, screenWidth * 0.04) }}>{date.toLocaleDateString()}</Text>
                                    </View>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                            </View>

                            <View style={{ marginBottom: Math.min(30, screenHeight * 0.035) }}>
                                <Text
                                    style={{
                                        fontSize: Math.min(15, screenWidth * 0.04),
                                        fontWeight: 'bold',
                                        color: '#2E2F34',
                                        marginBottom: 10,
                                    }}
                                >
                                    PROMOTOR*
                                </Text>
                                <View style={{
                                    borderWidth: 2,
                                    borderColor: '#8f8f8f',
                                    borderRadius: 10,
                                    backgroundColor: '#fff'
                                }}>
                                    <TextInput
                                        value={selectedPromoter}
                                        onChangeText={searchPromoter}
                                        placeholder="Pesquisar promotor..."
                                        style={{
                                            padding: Math.min(10, screenHeight * 0.012),
                                            color: '#2E2F34',
                                            fontSize: Math.min(16, screenWidth * 0.04),
                                        }}
                                    />
                                </View>
                                {listPromoter.length > 0 && (
                                    <View style={{
                                        maxHeight: Math.min(300, screenHeight * 0.5),
                                        marginTop: 20,
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: '#e0e0e0'
                                    }}>
                                        <FlatList
                                        style={{ flexGrow: 0 }}
                                            data={listPromoter}
                                            keyExtractor={(item) => item.value.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => handleSelect(item)}
                                                    style={{
                                                        padding: Math.min(10, screenHeight * 0.012),
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#f0f0f0',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: Math.min(16, screenWidth * 0.04) }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>

                            {user.shared_environment &&
                                <View style={{ marginBottom: Math.min(30, screenHeight * 0.035) }}>
                                    <Text
                                        style={{
                                            fontSize: Math.min(15, screenWidth * 0.04),
                                            fontWeight: 'bold',
                                            color: '#2E2F34',
                                            marginBottom: 10,
                                        }}
                                    >
                                        INDUSTRIAS*
                                    </Text>

                                    {/* Mostrar empresas selecionadas */}
                                    {selectedSubs.length > 0 && (
                                        <View style={{ marginBottom: 15 }}>
                                            <Text style={{
                                                fontSize: Math.min(14, screenWidth * 0.035),
                                                color: '#666',
                                                marginBottom: 8
                                            }}>
                                                Empresas selecionadas:
                                            </Text>
                                            {selectedSubs.map((sub, index) => (
                                                <View key={sub.value} style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    backgroundColor: '#f0f8ff',
                                                    padding: Math.min(8, screenHeight * 0.01),
                                                    borderRadius: 8,
                                                    marginBottom: 5
                                                }}>
                                                    <Text style={{
                                                        flex: 1,
                                                        fontSize: Math.min(13, screenWidth * 0.035)
                                                    }}>{sub.label}</Text>
                                                    <TouchableOpacity onPress={() => removeSelectedSub(sub.value)}>
                                                        <Text style={{ color: '#ff4444', fontSize: 18, fontWeight: 'bold' }}>×</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                            <TouchableOpacity onPress={clearSelectedSubs} style={{ marginTop: 5 }}>
                                                <Text style={{ color: '#6600CC', fontSize: Math.min(12, screenWidth * 0.03) }}>Limpar todas</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    <View style={{
                                        borderWidth: 2,
                                        borderColor: '#8f8f8f',
                                        borderRadius: 10,
                                        backgroundColor: '#fff'
                                    }}>
                                        <TextInput
                                            value={searchSubText}
                                            onChangeText={searchSub}
                                            placeholder="Pesquisar empresas..."
                                            style={{
                                                padding: Math.min(10, screenHeight * 0.012),
                                                fontSize: Math.min(16, screenWidth * 0.04),
                                            }}
                                        />
                                    </View>
                                    {listSub.length > 0 && (
                                        <View style={{
                                            maxHeight: Math.min(300, screenHeight * 0.5),
                                            marginTop: 20,
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#e0e0e0'
                                        }}>
                                            <FlatList
                                                data={listSub}
                                                keyExtractor={(item) => item.value.toString()}
                                                renderItem={({ item }) => {
                                                    const isSelected = selectedSubs.some(sub => sub.value === item.value);
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => handleSelectSub(item)}
                                                            style={{
                                                                padding: Math.min(10, screenHeight * 0.012),
                                                                borderBottomWidth: 1,
                                                                borderBottomColor: '#f0f0f0',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                backgroundColor: isSelected ? '#f0f8ff' : 'transparent'
                                                            }}
                                                        >
                                                            <View style={{
                                                                width: 20,
                                                                height: 20,
                                                                borderWidth: 2,
                                                                borderColor: isSelected ? '#6600CC' : '#ccc',
                                                                borderRadius: 3,
                                                                marginRight: 10,
                                                                backgroundColor: isSelected ? '#6600CC' : 'transparent',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                {isSelected && (
                                                                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                                                                )}
                                                            </View>
                                                            <Text style={{
                                                                flex: 1,
                                                                fontSize: Math.min(16, screenWidth * 0.04)
                                                            }}>{item.label}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                                nestedScrollEnabled
                                                style={{ flexGrow: 0 }}
                                            />
                                        </View>
                                    )}
                                </View>
                            }

                            <View style={{
                                flexDirection: 'row',
                                gap: 15,
                                marginTop: 20
                            }}>
                                <TouchableOpacity onPress={closeModal} style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            height: Math.min(54, screenHeight * 0.065),
                                            borderRadius: 18,
                                            borderWidth: 1,
                                            borderColor: '#6600CC',
                                            backgroundColor: '#fff',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#6600CC',
                                                fontSize: Math.min(15, screenWidth * 0.04),
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Cancelar
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={submitVisit} style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            height: Math.min(54, screenHeight * 0.065),
                                            borderRadius: 18,
                                            backgroundColor: '#6600CC',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: Math.min(15, screenWidth * 0.04),
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </Text>

                                        {loading &&
                                            <View style={{ marginLeft: 10 }}>
                                                <ActivityIndicator size="small" color="#fff" />
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
