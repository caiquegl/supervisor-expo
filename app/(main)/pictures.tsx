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
import { TouchableOpacity, View, FlatList, ActivityIndicator, Share, Dimensions } from 'react-native'
import { Menu } from '../../components/Menu';
import { useFocusEffect } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { PICT_QUERY } from '../../context/querys';
import { Image } from 'react-native'
import Lightbox from 'react-native-lightbox-v2';
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from 'expo-router';
import { theme } from '@/theme';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface RouteParams {
  id?: string;
}

const PhotoItem = React.memo(({ item }: any) => {
  const compartilharTexto = async (texto: any) => {
    try {
      await Share.share({ message: texto });
    } catch (error: any) {
      console.error('Erro ao compartilhar: ', error.message);
    }
  };
  return (
    <View style={{ width: '50%', marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, justifyContent: "center", alignItems: "center", elevation: 2 }}>
        <View style={{ width: 91, height: 91 }}>
          <TouchableOpacity onPress={() => compartilharTexto(item.url_image)}>
            <Image source={{ uri: item.url_image }} style={{ width: '100%', height: '100%' }} alt={item.url_image} />
          </TouchableOpacity>
        </View>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: 12, marginTop: 10 }}>Empresa: {item.sub_workspace.slice(0, 15)}</Text>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>{item.form_name.slice(0, 15)}</Text>
        <Text style={{ width: '70%', textAlign: 'center', fontSize: 12, flexWrap: 'wrap' }}>{item.field_name.slice(0, 15)}</Text>
      </View>
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
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between', paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </ContainerBody>
      </Container>
      <Menu routeActive="PromoterDetail" />
    </View>
  );
}
