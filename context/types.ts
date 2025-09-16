export interface IPropsColaborator {
    count_with_check_in: number
    count_without_check_in: number
    total: number
}

export interface IPropsPromoterOptions {
  label: string
  value: number
}

export interface IPropsStore {
  count_with_check_in: number
  count_without_check_in: number
  total: number
}

export interface IWorkspace {
  slug: string
  id: number
  name: string
  avatar_url: string | null
  product_complete: number
  product_total: number
  store_complete: number
  store_total: number
  view_rupture?: any
}

export interface IPropsVisit{
  count_visits_complete: number
  count_visits_in_progress: number
  count_visits_justify: number
  count_visits_pendent: number
  count_visits_total: number
}

export interface IPropsFormsDash {
  tasks_complete: number
  tasks_pendent: number
  tasks_total: number
}

export interface IPropsVisitsProgrammer {
  id: number
  status: string
  promoter_name: string
  pdv_name: string
  pdv_address: string
  dt_visit: string
  created_at: string
  check_in_date: string
  check_out_date: string
}

export interface IPropsListPromoter {
  id: number;
  name: string
  team_name: string
  last_visit: string
  sync_last_change: string
  email: string
  phone: string
  visits_complete: number
  visits_in_progress: number
  visits_pendent: number
  visits_justify: number
  tasks_complete: number
  tasks_pendent: number
}

export interface IPropsOnOff {
  count_with_check_in: number
  count_without_check_in: number
  total: number
}


export interface IProsVisitsByPromoter {
  id: number
  name: string
  avatar_url: string
  last_visit: string
  team_name: string
  visits: {
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
    count_store_task_pendent: number
    count_store_task_complete: number
    count_product_task_pendent: number
    count_product_task_complete: number
    total_task: number
  }[]
}

export interface IPropsJustify {
  id: number
  description: string
  mandatory_picture: boolean
  mandatory_observation: boolean
  workspace_id: boolean
  sub_workspace_id: boolean
}

export interface IPropsTeam {
  id: number
  name: number
}

export interface IVisit {
  id: number
  user_name: string
  pdv_name: string
  pdv_address: string
  dt_visit: string
  created_at: string
  sub_workspace?: any
  status: 'PENDENT' | 'IN_PROGRESS' | 'COMPLETE' | 'JUSTIFIED_ABSENCE'
}