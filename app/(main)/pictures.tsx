import React, { useCallback, useEffect, useMemo } from 'react'
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
import { Flex, Text, VStack, ScrollView } from 'native-base';
import { TouchableOpacity, View, FlatList, ActivityIndicator, Share, Dimensions, Modal } from 'react-native'
import { Menu } from '../../components/Menu';
import { useFocusEffect } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { PICT_QUERY } from '../../context/querys';
import { Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from 'expo-router';
import { theme } from '@/theme';
import { useRoute } from '@react-navigation/native';
import ImageZoom from 'react-native-image-pan-zoom';

const { width } = Dimensions.get('window');

interface RouteParams {
  id?: string;
}

const PhotoItem = React.memo(({ item }: any) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const compartilharTexto = async (texto: any) => {
    try {
      await Share.share({ message: texto });
    } catch (error: any) {
      console.error('Erro ao compartilhar: ', error.message);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={{ width: '50%', marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, justifyContent: "center", alignItems: "center", elevation: 2 }}>
        <View style={{ width: 91, height: 91 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: item.url_image }} style={{ width: '100%', height: '100%' }} alt={item.url_image} />
          </TouchableOpacity>
        </View>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: 12, marginTop: 10 }}>Empresa: {item.sub_workspace.slice(0, 15)}</Text>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>{item.form_name.slice(0, 15)}</Text>
        <Text style={{ width: '70%', textAlign: 'center', fontSize: 12, flexWrap: 'wrap' }}>{item.field_name.slice(0, 15)}</Text>
      </View>
      {/* Modal de visualização e zoom da imagem */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 40, right: 24, zIndex: 10, padding: 8 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: '#fff', fontSize: 28 }}>×</Text>
          </TouchableOpacity>
          <View style={{ position: 'relative', width: screenWidth * 0.95, height: screenHeight * 0.7, justifyContent: 'center', alignItems: 'center' }}>
            <ImageZoom
              cropWidth={screenWidth * 0.95}
              cropHeight={screenHeight * 0.7}
              imageWidth={screenWidth * 0.95}
              imageHeight={screenHeight * 0.7}
              minScale={1}
              maxScale={3}
              enableCenterFocus={false}
              style={{ backgroundColor: 'transparent' }}
            >
              <Image
                source={{ uri: item.url_image }}
                style={{
                  width: screenWidth * 0.95,
                  height: screenHeight * 0.7,
                  resizeMode: 'contain',
                  borderRadius: 10,
                  borderWidth: 2,
                  backgroundColor: 'transparent',
                }}
                alt={item.url_image}
              />
            </ImageZoom>
            {/* Descrição pequena em amarelo no canto inferior direito da foto */}
            {(item.pdv_name) && (
              <Text
                style={{
                  position: 'absolute',
                  bottom: 30,
                  left: 12,
                  color: '#FFD600',
                  fontSize: 13,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                  textAlign: 'left',
                  maxWidth: '80%',
                }}
              >
                {item.pdv_name ? item.pdv_name : ''}
              </Text>
            )}

            {(item.collected_date) && (
              <Text
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 12,
                  color: '#FFD600',
                  fontSize: 13,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                  textAlign: 'left',
                  maxWidth: '80%',
                }}
              >
                {item.collected_date ? item.collected_date : ''}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => compartilharTexto(item.url_image)}
            style={{ marginTop: 32, backgroundColor: '#6600CC', padding: 12, borderRadius: 8, alignSelf: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Compartilhar</Text>
          </TouchableOpacity>
       
        </View>
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
  const picSubscriptionRef = React.useRef<any>(null);

  const getPictures = async () => {
    const id = (route.params as RouteParams)?.id;
    if (id) {
      const subscription = loadPic({
        fetchPolicy: 'network-only',
        variables: {
          filter: { visit_id: parseInt(id) },
        },
      });
      picSubscriptionRef.current = subscription;
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPictures();
      return () => {
        // Cancela a query Apollo ao desmontar
        if (picSubscriptionRef.current && typeof picSubscriptionRef.current.unsubscribe === 'function') {
          picSubscriptionRef.current.unsubscribe();
        }
      };
    }, [])
  );

  // Memoize data to avoid unnecessary re-renders
  const photos = useMemo(() => data?.visitPhotosById || [], [data]);


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
          <TouchableOpacity
            onPress={handleBack}
          >
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
                FOTOS
              </Text>
            </Flex>
          </VStack>
          {loadingPic &&
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#6600CC" />
            </View>
          }
          {!loadingPic && photos.length === 0 && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4c4c4c' }}>Parece que não há fotos no momento!</Text>
            </Text>
          </View>}
          <FlatList
            data={photos}
            renderItem={({ item }) => <PhotoItem item={item} />}
            keyExtractor={(item, index) => item.url_image + index}
            numColumns={2}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={7}
            removeClippedSubviews
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </ContainerBody>
      </Container>
      <Menu routeActive="PromoterDetail" />
    </View>
  );
}
