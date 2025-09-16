import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import {
  ActionsHeader,
  ButtonBack,
  Container,
  ContainerBody,
  ContainerIconPrimary,
  TextLogo,
  TextName,
} from "../../styles/style.pictures";
import LogoPromoter from "../../assets/images/logoPromoter.svg";
import Left from "../../assets/icon/angle-left.svg";
import { Flex, Text, VStack } from 'native-base';
import { 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Share, 
  Dimensions, 
  Modal, 
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native'
import { Menu } from '../../components/Menu';
import { useFocusEffect } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { PICT_QUERY } from '../../context/querys';
import { router } from 'expo-router';
import { theme } from '@/theme';
import { useRoute } from '@react-navigation/native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Image } from 'expo-image';
import { FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  id?: string;
}

// Estilos otimizados para performance
const styles = {
  photoItemContainer: {
    width: (width - 80) / 2, // Largura calculada para 2 colunas com margem
    marginBottom: 12,
    marginHorizontal: 3,
  },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 230, // Altura aumentada
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 140, // Altura aumentada para imagem
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  photoInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'left',
    marginBottom: 3,
    lineHeight: 12,
    flexWrap: 'wrap',
    numberOfLines: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageZoomStyle: {
    backgroundColor: 'transparent',
  },
  fullImage: {
    width: width * 0.95,
    height: height * 0.75,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'column',
  },
  overlayText: {
    color: '#FFD600',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    textAlign: 'left',
    maxWidth: '100%',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.9,
    fontWeight: '500',
  },
  shareButton: {
    backgroundColor: '#6600CC',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 80,
    minWidth: 180,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c4c4c',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
};

// Componente otimizado para item de foto
const PhotoItem = React.memo(({ item }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Função de compartilhamento otimizada
  const compartilharTexto = useCallback(async (texto: string) => {
    try {
      await Share.share({ 
        message: texto,
        title: 'Foto do Supervisor',
        url: texto
      });
    } catch (error: any) {
      console.error('Erro ao compartilhar: ', error.message);
    }
  }, []);

  // Função para abrir modal
  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  // Função para fechar modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Função para truncar texto de forma inteligente
  const truncateText = useCallback((text: string, maxLength: number = 20) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
  }, []);

  return (
    <View style={styles.photoItemContainer}>
      <View style={styles.photoCard}>
        <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
                    <Image
                      source={{ uri: item.url_image }}
                      style={styles.thumbnailImage}
                      contentFit="cover"
                      transition={200}
                      onLoadStart={() => {
                        setImageLoaded(false);
                        setImageError(false);
                      }}
                      onLoad={() => {
                        setImageLoaded(true);
                        setImageError(false);
                      }}
                      onError={() => {
                        setImageLoaded(true);
                        setImageError(true);
                      }}
                      // Configurações para melhor cache e performance
                      cachePolicy="memory-disk"
                      recyclingKey={item.url_image}
                    />
                    {!imageLoaded && !imageError && (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color="#6600CC" />
                      </View>
                    )}
                    {imageError && (
                      <View style={styles.loadingOverlay}>
                        <Text style={{ color: '#666', fontSize: 12 }}>Erro ao carregar</Text>
                      </View>
                    )}
                  </TouchableOpacity>
        </View>
        
        <View style={styles.photoInfo}>
          <Text style={[styles.infoText, { fontWeight: '600', color: '#6600CC' }]}>
            {truncateText(item.sub_workspace, 18)}
          </Text>
          <Text style={styles.infoText}>
            {truncateText(item.form_name, 18)}
          </Text>
          <Text style={styles.infoText}>
            {truncateText(item.field_name, 18)}
          </Text>
          <Text style={[styles.infoText, { fontSize: 9, color: '#999', marginTop: 2 }]}>
            {item.collected_date}
          </Text>
        </View>
      </View>

      {/* Modal otimizado para visualização */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
          
          {/* Header do modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Container da imagem com zoom */}
          <View style={styles.imageZoomContainer}>
            <ImageZoom
              cropWidth={screenWidth * 0.95}
              cropHeight={screenHeight * 0.75}
              imageWidth={screenWidth * 0.95}
              imageHeight={screenHeight * 0.75}
              minScale={1}
              maxScale={5}
              enableCenterFocus={true}
              style={styles.imageZoomStyle}
            >
              <Image
                source={{ uri: item.url_image }}
                style={styles.fullImage}
                contentFit="contain"
                transition={300}
                cachePolicy="memory-disk"
                recyclingKey={item.url_image}
              />
            </ImageZoom>

            {/* Informações sobrepostas */}
            <View style={styles.imageOverlay}>
              {item.pdv_name && (
                <Text style={styles.overlayText}>
                  {item.pdv_name}
                </Text>
              )}
              {item.collected_date && (
                <Text style={[styles.overlayText, styles.dateText]}>
                  {item.collected_date}
                </Text>
              )}
            </View>
          </View>

          {/* Botão de compartilhar */}
          <TouchableOpacity
            onPress={() => compartilharTexto(item.url_image)}
            style={styles.shareButton}
            activeOpacity={0.8}
          >
            <Text style={styles.shareButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
});

const handleBack = () => {
  
  if (router.canGoBack?.()) {
    router.back();
  } else {
    router.replace("/(main)/programmerVisits");
  }
};

export default function Pictures() {
  const [loadPic, { data, loading: loadingPic, error, called }] = useLazyQuery(PICT_QUERY);
  const route = useRoute();
  const picSubscriptionRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Função otimizada para carregar fotos
  const getPictures = useCallback(async () => {
    const id = (route.params as RouteParams)?.id;
    if (id) {
      try {
        const subscription = loadPic({
          fetchPolicy: 'cache-first', // Usar cache primeiro para melhor performance
          variables: {
            filter: { visit_id: parseInt(id) },
          },
          onCompleted: () => {
            setRefreshing(false);
          },
          onError: (error) => {
            console.error('Erro ao carregar fotos:', error);
            setRefreshing(false);
          }
        });
        picSubscriptionRef.current = subscription;
      } catch (error) {
        console.error('Erro na requisição:', error);
        setRefreshing(false);
      }
    }
  }, [route.params, loadPic]);

  // Função de refresh otimizada
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPictures();
  }, [getPictures]);

  useFocusEffect(
    useCallback(() => {
      getPictures();
      return () => {
        // Cleanup da subscription
        if (picSubscriptionRef.current && typeof picSubscriptionRef.current.unsubscribe === 'function') {
          picSubscriptionRef.current.unsubscribe();
        }
      };
    }, [getPictures])
  );

  // Memoize data to avoid unnecessary re-renders
  const photos = useMemo(() => data?.visitPhotosById || [], [data]);

  // Função de renderização otimizada para item
  const renderPhotoItem = useCallback(({ item }: { item: any }) => (
    <PhotoItem item={item} />
  ), []);

  // Função de key extractor otimizada
  const keyExtractor = useCallback((item: any, index: number) => 
    `${item.url_image}_${item.id || index}`, []
  );

  // Componente de loading otimizado
  const LoadingComponent = useMemo(() => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6600CC" />
      <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
        Carregando fotos...
      </Text>
    </View>
  ), []);

  // Componente de estado vazio otimizado
  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Parece que não há fotos no momento!
      </Text>
      <Text style={{ marginTop: 8, color: '#999', fontSize: 14, textAlign: 'center' }}>
        As fotos coletadas durante as visitas aparecerão aqui.
      </Text>
    </View>
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <Container colors={theme.colors.primary}>
        <ActionsHeader>
          <ContainerIconPrimary>
            <LogoPromoter width={35} height={35} />
            <TextLogo>Teams</TextLogo>
          </ContainerIconPrimary>
        </ActionsHeader>
        <ActionsHeader>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <TextName>Voltar</TextName>
          </TouchableOpacity>
          <ButtonBack onPress={handleBack}>
            <Left />
          </ButtonBack>
        </ActionsHeader>
        
        <ContainerBody>
          <VStack space="19px">
            <Flex
              justifyContent="space-between"
              pl="21px"
              pr="21px"
              marginBottom="19px"
              direction='row'
            >
              <Text
                fontSize="18px"
                fontWeight="bold"
                color="#2E2F34"
              >
                FOTOS ({photos.length})
              </Text>
            </Flex>
          </VStack>

          {loadingPic && !refreshing ? (
            LoadingComponent
          ) : photos.length === 0 ? (
            EmptyComponent
          ) : (
            <FlatList
              data={photos}
              renderItem={renderPhotoItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              // Configurações de performance otimizadas para evitar desaparecimento de imagens
              initialNumToRender={10}
              maxToRenderPerBatch={8}
              windowSize={15}
              removeClippedSubviews={false}
              // Configurações de scroll
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingBottom: 32,
                paddingHorizontal: 6,
                paddingTop: 8
              }}
              columnWrapperStyle={{
                justifyContent: 'space-around',
                paddingHorizontal: 0,
                marginBottom: 8
              }}
              // Configurações de refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
              // Configurações de scroll infinito (se necessário no futuro)
              onEndReachedThreshold={0.5}
              // Configurações adicionais para manter imagens na memória
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10
              }}
            />
          )}
        </ContainerBody>
      </Container>
      <Menu routeActive="PromoterDetail" />
    </View>
  );
}
