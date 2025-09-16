import { useLazyQuery, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef, useMemo } from "react";
import { COLABORATORS_QUERY, FORMS_QUERY_DASH, GET_JUSTIFY_QUERY, LIST_PROMOTER_QUERY, ON_OFF_QUERY, PROMOTER_OPTIONS_QUERY, STORES_QUERY, TEAM_QUERY, VISITS_BY_PROMOTER_QUERY, VISITS_PROGRAMER_QUERY, VISITS_QUERY, VISITS_SUPERVISOR_QUERY } from "./querys";
import { IPropsColaborator, IPropsFormsDash, IPropsJustify, IPropsListPromoter, IPropsOnOff, IPropsPromoterOptions, IPropsStore, IPropsTeam, IPropsVisit,  IProsVisitsByPromoter, IVisit } from "./types";
import { userContext } from "./userContext";


interface ApolloContextData {
  colaborators: IPropsColaborator
  promoterOptionsData: IPropsPromoterOptions[]
  loadingPromoterOptions: boolean
  store: IPropsStore
  visits: IPropsVisit
  formDash: IPropsFormsDash
  visitsProgrammer: any[]
  listPromoter: IPropsListPromoter[]
  onOff: IPropsOnOff
  visitsByPromoter: IProsVisitsByPromoter
  justifys: IPropsJustify[]
  team: IPropsTeam[]
  visitsBySupervisor: IVisit[]
  loadPromoterOptionsVoid: any
  connected: any
}

interface ApolloProviderProps {
  children: ReactNode;
}


export const ApolloContext = createContext({} as ApolloContextData);

function ApolloProviderContext({ children }: ApolloProviderProps) {
  const { filter, selectedPromoter, dateVisit } = userContext();
  
  // Cache inteligente para evitar requisições desnecessárias
  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  // Debounce para evitar múltiplas requisições
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Estados otimizados
  const [colaborators, setColaborators] = useState<IPropsColaborator>({} as IPropsColaborator);
  const [promoterOptionsData, setPromoterOptionsData] = useState<IPropsPromoterOptions[]>([]);
  const [store, setStore] = useState<IPropsStore>({} as IPropsStore);
  const [visits, setVisits] = useState<IPropsVisit>({} as IPropsVisit);
  const [formDash, setFormDash] = useState<IPropsFormsDash>({} as IPropsFormsDash);
  const [visitsProgrammer, setVisitsProgrammer] = useState<any[]>([]);
  const [listPromoter, setListPromoter] = useState<IPropsListPromoter[]>([]);
  const [onOff, setOnOff] = useState<IPropsOnOff>({} as IPropsOnOff);
  const [visitsByPromoter, setVisitsByPromoter] = useState<IProsVisitsByPromoter>({} as IProsVisitsByPromoter);
  const [justifys, setJustifys] = useState<IPropsJustify[]>([]);
  const [team, setTeam] = useState<IPropsTeam[]>([]);
  const [visitsBySupervisor, setVisitsBySupervisor] = useState<IVisit[]>([]);
  const [connected, setConnected] = useState(true);

  // Função para verificar cache
  const getCachedData = useCallback((key: string) => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  // Função para salvar no cache
  const setCachedData = useCallback((key: string, data: any) => {
    cacheRef.current.set(key, { data, timestamp: Date.now() });
  }, []);

  // Função para debounce
  const debounce = useCallback((func: () => void, delay: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(func, delay);
  }, []);

  const [promoterOptions, { data: dataPromoterOptions, loading: loadingPromoterOptions }] = useLazyQuery(PROMOTER_OPTIONS_QUERY);


  const loadPromoterOptionsVoid = useCallback(() => {


      promoterOptions({
        fetchPolicy: 'network-only',
        
        onCompleted: (data) => {
          const result = data?.getPromoterOptions || [];
          setPromoterOptionsData([...result]);
        },
        onError: (error) => {
          console.error('Error loading promoter options:', error);
        }
      });
  }, [promoterOptions]);




  return (
    <ApolloContext.Provider
      value={{
        connected,
        loadPromoterOptionsVoid,
        visitsBySupervisor,
        team,
        justifys,
        visitsByPromoter,
        onOff,
        listPromoter,
        visitsProgrammer,
        formDash,
        visits,
        colaborators,
        store,
        promoterOptionsData,
        loadingPromoterOptions
      }}
    >
      {children}
    </ApolloContext.Provider>
  );
}

function apolloContext() {
  const context = useContext(ApolloContext);
  if (!context) {
    console.warn('apolloContext must be used within an ApolloProviderContext');
    // Retornar um objeto padrão para evitar erros

  }
  return context;
}

export { ApolloProviderContext, apolloContext };
