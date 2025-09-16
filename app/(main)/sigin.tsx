import React, { useEffect, useState } from 'react';
import {
  Container,
  ContainerIcon,
  TextLogo,
  Body,
  BigText,
  Input,
  Button,
  TextButton,
  ContainerInput,
  Label,
  InputMask
} from '../../styles/style.sigin';
import Logo from '../../assets/images/logoRocket.png';
import { ModalAlert } from '../../components/ModalAlert';
import { ActivityIndicator, TouchableHighlight, DevSettings, ScrollView } from 'react-native';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { View } from 'react-native';
import { userContext } from '../../context/userContext';
import { useMutation, gql } from "@apollo/client";
import { theme } from '@/theme';
import { router } from 'expo-router';
import * as Updates from 'expo-updates';

const qLogin = gql`mutation Login($input: AuthInput!) {
  login(input: $input) {
    id
    name
    token
    workspace_id
    slug
    shared_environment
  }
}`

export default function Sigin() {
  let userContextData;
  try {
    userContextData = userContext();
  } catch (error) {
    // Se o contexto não está disponível, não renderize nada
    return null;
  }
  const { signInUser } = userContextData;
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [alert, setAlert] = useState(false);
  const [msgErro, setMsgErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [security, setSecurity] = useState(true);
  const [checked, setChecked] = useState(true);
  const [iconSecutiry, setIconSecutiry] = useState('eye');

  const [login, { loading }] = useMutation(qLogin); //execute query

  const handleRegister = async () => {
    if (cpf == '' && checked) {
      setMsgErro('CPF inválido, por favor preencha um CPF correto.');
      setAlert(true);
      setIsLoading(false);
      return;
    }
    if (password == '') {
      setMsgErro('Senha inválida, por favor preencha uma senha correta.');
      setAlert(true);
      setIsLoading(false);
      return;
    }
    try {
      await login({
        fetchPolicy: 'network-only',
        variables: {
          input: {
            cpf,
            password
          }
        }
      }).then(async ({ data }) => {
        const user = data?.login;
        if (user?.id && user?.token && user?.name) {
          try {
            await signInUser(user);
            router.push("/(main)/home");
          } catch (error) {
            setMsgErro('Erro ao fazer login. Usuário ou senha inválidos');
            setAlert(true);
          }
        } else {
          setMsgErro('Usuário ou senha inválidos');
          setAlert(true);
        }
      }).catch((error) => {
        setMsgErro('Erro ao fazer login. Usuário ou senha inválidos');
        setAlert(true);
      });
    } catch (error) {
      setMsgErro('Login inválido');
      setAlert(true);
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    setNickname('');
    setCpf('');
  }, [checked]);

  return (

      <Container>
        {/* <ContainerBG>
          <Image source={Bg} />
        </ContainerBG> */}

        <ContainerIcon>
          <Image source={Logo} />
          <TextLogo>Rock-At.</TextLogo>
        </ContainerIcon>
        <Body>
          {/* <LogoPromoter height={135} width={200} /> */}
          <BigText>Teams</BigText>
          <ContainerInput style={{ marginBottom: 75 }}>
            <Label>CPF</Label>
            <InputMask value={cpf} type="cpf" onChangeText={setCpf} />
          </ContainerInput>
          <ContainerInput>
            <Label>Senha</Label>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry={security}
              />
              <TouchableHighlight
                style={{
                  position: 'absolute',
                  left: '85%',
                  padding: 10,
                }}
                underlayColor="transparent"
                onPress={() => {
                  if (iconSecutiry === 'eye') setIconSecutiry('eye-off');
                  if (iconSecutiry === 'eye-off') setIconSecutiry('eye');
                  setSecurity(!security);
                }}>
                <Icon name={iconSecutiry} size={24} color={'#fff'} />
              </TouchableHighlight>
            </View>
          </ContainerInput>
          <Button
            onPress={() => handleRegister()}
            underlayColor="none"
            activeOpacity={0.2}>
            {loading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <TextButton>ENTRAR</TextButton>
            )}
          </Button>
        </Body>
        {alert && (
          <ModalAlert
            visible={alert}
            closeAlert={(close: any) => setAlert(close)}
            icon="error"
            title="Erro ao fazer login"
            msg={msgErro}
          />
        )}
      </Container>

  );
};
