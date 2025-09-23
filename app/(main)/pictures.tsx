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
import { Flex, Text, VStack, HStack, Box } from 'native-base';
import { 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Share, 
  Dimensions, 
  Modal, 
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  RefreshControl
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
import { CustomCollapsible } from '../../components/CustomCollapsible';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  id?: string;
}

// Estilos otimizados para performance
const styles = {
  photoItemContainer: {
    width: (width - 90) / 2, // Largura calculada para 2 colunas com margem
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
    width: '100%' as const,
    height: 140, // Altura aumentada para imagem
    borderRadius: 8,
    overflow: 'hidden' as const,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%' as const,
    height: '100%' as const,
  },
  loadingOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  photoInfo: {
    flex: 1,
    justifyContent: 'flex-start' as const,
    paddingHorizontal: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'left' as const,
    marginBottom: 3,
    lineHeight: 12,
    flexWrap: 'wrap' as const,
    numberOfLines: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 28,
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
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
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'column' as const,
  },
  overlayText: {
    color: '#FFD600',
    fontSize: 14,
    fontWeight: '600' as const,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    textAlign: 'left' as const,
    maxWidth: '100%' as const,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.9,
    fontWeight: '500' as const,
  },
  shareButton: {
    backgroundColor: '#6600CC',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center' as const,
    marginBottom: 80,
    minWidth: 180,
    alignItems: 'center' as const,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#4c4c4c',
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  // Estilos para collapse
  photosGrid: {
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
    marginHorizontal: 16,
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

  // Função para agrupar fotos hierarquicamente
  const groupedPhotos = useMemo(() => {
    const groups: { [key: string]: { [key: string]: any[] } } = {};
    
    photos.forEach((photo: any) => {
      const industry = photo.sub_workspace || 'Sem Indústria';
      const form = photo.form_name || 'Sem Formulário';
      
      if (!groups[industry]) {
        groups[industry] = {};
      }
      if (!groups[industry][form]) {
        groups[industry][form] = [];
      }
      groups[industry][form].push(photo);
    });
    
    return groups;
  }, [photos]);

  // Função de key extractor otimizada
  const keyExtractor = useCallback((item: any, index: number) => 
    `${item.url_image}_${item.id || index}`, []
  );

  // Função de renderização otimizada para item
  const renderPhotoItem = useCallback(({ item }: { item: any }) => (
    <PhotoItem item={item} />
  ), []);

  // Componente para renderizar fotos em grid
  const renderPhotosGrid = useCallback((photos: any[]) => {
    return (
      <View style={styles.photosGrid}>
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={15}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 8,
          }}
          columnWrapperStyle={{
            justifyContent: 'space-around',
            paddingHorizontal: 0,
            marginBottom: 8
          }}
        />
      </View>
    );
  }, [renderPhotoItem, keyExtractor]);

  // Componente para renderizar formulário com collapse
  const FormCollapse = React.memo(({ formName, photos }: { formName: string; photos: any[] }) => {
    return (
      <CustomCollapsible
        title={`Formulário: ${formName}`}
        count={photos.length}
        level="secondary"
      >
        <Box bg="#fafbfc" paddingX="8px" paddingY="8px" borderRadius="6px">
          {renderPhotosGrid(photos)}
        </Box>
      </CustomCollapsible>
    );
  });

  // Componente para renderizar indústria com collapse
  const IndustryCollapse = React.memo(({ industryName, forms }: { industryName: string; forms: { [key: string]: any[] } }) => {
    const totalPhotos = Object.values(forms).reduce((sum, formPhotos) => sum + formPhotos.length, 0);

    return (
      <Box
        bg="#fff"
        borderRadius="12px"
        marginBottom="16px"
        overflow="hidden"
        borderWidth="1px"
        borderColor="#E5E7EB"
      >
        <CustomCollapsible
          title={`Indústria: ${industryName}`}
          count={totalPhotos}
          level="primary"
        >
          <Box  paddingX="8px" paddingY="12px">
            <VStack space="12px">
              {Object.entries(forms).map(([formName, formPhotos]) => (
                <Box
                  key={formName}
                  bg="#fff"
                  borderRadius="8px"
                  paddingY="8px"
                  shadow={1}
                >
                  <FormCollapse
                    formName={formName}
                    photos={formPhotos}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
        </CustomCollapsible>
      </Box>
    );
  });

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
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingBottom: 32,
                paddingTop: 8
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#6600CC']}
                  tintColor="#6600CC"
                />
              }
            >
              <VStack space="0px">
                {Object.entries(groupedPhotos).map(([industryName, forms]) => (
                  <IndustryCollapse
                    key={industryName}
                    industryName={industryName}
                    forms={forms}
                  />
                ))}
              </VStack>
            </ScrollView>
          )}
        </ContainerBody>
      </Container>
      <Menu routeActive="PromoterDetail" />
    </View>
  );
}
