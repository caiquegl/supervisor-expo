import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import { restaureUser } from "../controller/user.controller";
import { convertToParse } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloClient } from '@apollo/client';
import { IPropsListPromoter, IVisit, IWorkspace } from "./types";
import moment from "moment";

interface UserContextData {
  user: any;
  signInUser(user: UserProps): Promise<void>
  connected: any;
  signStore(store: IVisit): Promise<void>
  signForm(form: any): Promise<void>
  signProduct(product: any): Promise<void>
  signInSubWorkspace(workspace: IWorkspace): Promise<void>
  dateVisit: Date
  checked: any
  changeChecked: any
  store: any
  form: any
  product: any
  category: any
  signCategory: any
  firstForm: any
  subWorkspace: any
  defaultAnswer: any
  setDefaultAnswerForm: any
  signFirstForm: any
  setUpdatePageForm: any
  updatePageForm: any
  setReq: any
  setUser: any
  client?: ApolloClient<any>
  setClient: any
  setFilter: any
  filter: any
  logOut: any
  setSelectedPromoter: any
  selectedPromoter: IPropsListPromoter
  setDateVisit: any
}

interface UserProviderProps {
  children: ReactNode;
}

export interface WorkspaceProps {
  id: number
  manage_shelf?: boolean
  view_rupture?: boolean
  msg_add_visit?: string
  msg_finish_form?: string
  msg_ruptura?: string
  name?: string
  required_check_auto?: boolean
  required_check_in?: boolean
  required_check_out?: false
  slug?: string
  type_colect?: string
  form_check_in?: number
  shared_environment?: boolean
  type_view_form?: string
  required_all_rupture?: boolean
}

export interface UserProps {
  token: string
  name: string
  workspace_id: number
  id: number
  shared_environment: any
  slug: any
}

export const UserContext = createContext({} as UserContextData);
export const USER_ITEM = '@rocketPdv:user'
export const PHOTOS_STORAGE = '@rocketPdv:photo'
export const SUBWORKSPACE_STORAGE = '@rocketPdv:subworkspace'
export const SYNC_DB = '@rocketPdv:sync_db'
export const LOGINSYNC = '@rocketPdv:login_siync'

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState({} as UserProps)
  const [connected, setConnected] = useState(true)
  const [store, setSTore] = useState({} as IVisit)
  const [form, setForm] = useState({})
  const [product, setProduct] = useState({})
  const [selectedPromoter, setSelectedPromoter] = useState<IPropsListPromoter>({} as IPropsListPromoter)
  const [dateVisit, setDateVisit] = useState<any>(moment().toDate())
  const [client, setClient] = useState<ApolloClient<any>>()
  const [defaultAnswer, setDefaultAnswer] = useState({})
  const [filter, setFilter] = useState<any>({
    dt_visit: moment().format('YYYY-MM-DD')
  })
  const [category, setCategory] = useState({})
  const [firstForm, setFirstForm] = useState({})
  const [requireds, setRequireds] = useState<any>([])
  const [updatePageForm, setUpdatePageForm] = useState(false)
  const [subWorkspace, setSubWorkspace] = useState({} as IWorkspace)
  const [checked, setChecked] = useState({
    all: true,
    complete: false,
    in_progress: false,
    pendent: false,
  })

  // Debug logs para filter
  useEffect(() => {
  }, [filter]);

  async function signInUser(userLogged: UserProps) {
    try {
      await AsyncStorage.setItem('auth_token_2', userLogged.token);
      await AsyncStorage.setItem('auth_user_2', JSON.stringify(userLogged));
      // api.defaults.headers.authorization = `Bearer ${userLogged.token}`
      setUser({ ...userLogged });
    } catch (error: any) {
      console.error('Error in signInUser:', error, 'caiu aqui')
      throw error; // Re-throw para que o componente possa tratar
    }
  }

  const logOut = async (clearApolloData?: () => void) => {
    try {
      // Limpar dados do AsyncStorage
      await AsyncStorage.removeItem('auth_token_2');
      await AsyncStorage.removeItem('auth_user_2');
      
      // Limpar estado do usuário
      setUser({} as UserProps);
      
      // Limpar cache do Apollo Client se disponível
      if (client) {
        await client.clearStore();
      }
      
      // Limpar dados do Apollo Context se função fornecida
      if (clearApolloData) {
        clearApolloData();
      }
      
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  }


  const isConnected = async () => {
    try {
      // let userDb: any = await restaureUser()
      // if (userDb) {
      //   await api.get(`/check-internet`)
      //   setConnected(true)
      // }
    } catch (error) {
      setConnected(false)
    }
  }

  const signFirstForm = (form: any) => {
    setFirstForm(form)
  }

  async function signStore(store: IVisit) {
    try {
      setSTore({ ...store })
    } catch (error) {
     
    }
  }

  async function signForm(form: any) {
    try {
      let isParse = convertToParse(form)
      if (isParse) {
        let isParseFields = convertToParse(form.forms.fields)
        if (isParseFields) form.forms.fields = isParseFields
      }

      setForm(form)
    } catch (error) {
     
    }
  }

  async function signProduct(product: any) {
    try {
      setProduct(product)
    } catch (error) {
     
    }
  }


  async function signInSubWorkspace(workspace: IWorkspace) {
    try {
      setSubWorkspace(workspace)
    } catch (error) { }
  }

  const setDefaultAnswerForm = (date: any) => {
    setDefaultAnswer(date)
  }

  const changeChecked = (data: any) => {
    if (data.complete || data.pendent || data.in_progress) {
      setChecked({ ...data, all: false })
    } else if (data.all) {
      setChecked({
        all: true,
        complete: false,
        in_progress: false,
        pendent: false,
      })
    } else {
      setChecked({
        all: true,
        complete: false,
        in_progress: false,
        pendent: false,
      })
    }
  }

  async function signCategory(category: any) {
    try {
      setCategory(category)
    } catch (error) {
     
    }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => await isConnected(), 7000);
    
    // Cleanup function para limpar o intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Carregar usuário do AsyncStorage na inicialização
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth_user_2');
        const storedToken = await AsyncStorage.getItem('auth_token_2');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          if (userData.token && userData.token.trim() !== '') {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      }
    };
    
    loadStoredUser();
  }, []);

  const setReq = (id: any) => {
    setRequireds(id)
  }

  return (
    <UserContext.Provider
      value={{
        setDateVisit,
        selectedPromoter,
        setSelectedPromoter,
        logOut,
        filter,
        setFilter,
        client,
        setClient,
        setUser,
        setReq,
        setUpdatePageForm,
        updatePageForm,
        signFirstForm,
        category,
        defaultAnswer,
        firstForm,
        product,
        setDefaultAnswerForm,
        signCategory,
        subWorkspace,
        form,
        user,
        signInUser,
        connected,
        signStore,
        store,
        signForm,
        signProduct,
        signInSubWorkspace,
        dateVisit,
        changeChecked,
        checked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function userContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('userContext must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, userContext };
