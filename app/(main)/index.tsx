import { userContext } from '@/context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, Text, View, ActivityIndicator } from 'react-native';


export default function HomeScreen() {
  let userContextData;
  try {
    userContextData = userContext();
  } catch (error) {
    // Se o contexto não está disponível (ex: após logout), não renderize nada
    return null;
  }
  const { user, signInUser } = userContextData;
  const [isLoading, setIsLoading] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  
  const loadUser = async () => {
    if (isLoading || hasNavigated) return;
    
    try {
      setIsLoading(true);
      
      // Se o usuário já está carregado no contexto, navegar direto
      if (user && user.id && user.token) {
        setHasNavigated(true);
        router.push("/(main)/home");
        return;
      }
      
      let storedUser = await AsyncStorage.getItem('auth_user_2');
      let storedToken = await AsyncStorage.getItem('auth_token_2');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        
        // Verificar se o token não está vazio
        if (userData.token && userData.token.trim() !== '') {
          await signInUser(userData);
          setHasNavigated(true);
          router.push("/(main)/home");
        } else {
          setHasNavigated(true);
          router.push("/(main)/sigin");
        }
      } else {
        setHasNavigated(true);
        router.push("/(main)/sigin");
      }
    } catch (error) {
      // Em caso de erro, limpar dados corrompidos e ir para login
      await AsyncStorage.removeItem('auth_user_2');
      await AsyncStorage.removeItem('auth_token_2');
      setHasNavigated(true);
      router.push("/(main)/sigin");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Só executar se ainda não navegou e não está carregando
    if (!hasNavigated && !isLoading) {
      
      // Se o usuário já está no contexto, navegar imediatamente
      if (user && user.id && user.token) {
        setHasNavigated(true);
        router.push("/(main)/home");
        return;
      }
      
      // Se não há usuário no contexto, verificar AsyncStorage
      loadUser();
    }
  }, [user, hasNavigated, isLoading]);


  return (
    <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large"/>
    </View>
  );
}