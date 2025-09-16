import { gql } from "@apollo/client";

export const COLABORATORS_QUERY = gql`
query CountPromoterDash($filter: CounterPromoterDashFilter!) {
  countPromoterDash(filter: $filter) {
    count_with_check_in
    count_without_check_in
    total
  }
}
`;

export const PROMOTER_OPTIONS_QUERY = gql`
query GetPromoterOptions {
  getPromoterOptions {
    value
    label
  }
}

`;

export const PICT_QUERY = gql`
query VisitPhotosById($filter: VisitPhotosInput!) {
  visitPhotosById(filter: $filter) {
    form_name,
    field_name,
    url_image,
    sub_workspace,
    collected_date,
    pdv_name
  }
}
`;

export const STORES_QUERY = gql`
query CountPromoterDash($filter: CounterPdvDashFilter!) {
  countPdvDash(filter: $filter) {
    count_with_check_in
    count_without_check_in
    total
  }
}
`;

export const VISITS_QUERY = gql`
query CountPromoterDash($filter: CounterVisitsDashFilter!) {
  countVisitsDash(filter: $filter) {
    count_visits_complete
    count_visits_pendent
    count_visits_in_progress
    count_visits_justify
  }
}
`;

export const FORMS_QUERY_DASH = gql`
query CountTasksDash($filter: CounterTasksDashFilter!) {
  countTasksDash(filter: $filter) {
    tasks_complete
    tasks_pendent
    tasks_total
  }
}
`;

export const VISITS_PROGRAMER_QUERY = gql`
query VisitsPromoters($filter: ListVisitsPromotersFilter!) {
  visitsPromoters(filter: $filter) {
    id
    status
    promoter_name
    pdv_name
    pdv_address
    dt_visit
    created_at
    check_in_date
    check_out_date
    obs_justify
    option_justify
    picture_justify
  }
}
`;

export const LIST_PROMOTER_QUERY = gql`
query ListPromoters($filter: ListPromotersFilter!) {
  listPromoters(filter: $filter) {
    id
    name
    team_name
    last_visit
    sync_last_change
    email
    phone
    visits_complete
    visits_in_progress
    visits_pendent
    visits_justify
    tasks_complete
    tasks_pendent
    lunch_check_in
    lunch_check_out
    time_in_lunch
  }
}
`;

export const ON_OFF_QUERY = gql`
query CountPromoterDash($filter: CounterPromoterDashFilter!) {
  countPromoterDash(filter: $filter) {
    count_with_check_in
    count_without_check_in
    total
  }
}
`;

export const VISITS_BY_PROMOTER_QUERY = gql`
query GetPromoter($filter: GetPromoterFilter!, $getPromoterId: Int!) {
  getPromoter(filter: $filter, id: $getPromoterId) {
    id
    name
    avatar_url
    last_visit
    team_name
    visits {
      id
      status
      pdv_name
      pdv_address
      dt_visit
      check_in_date
      check_out_date
      check_in_battery
      check_out_battery
      check_in_photo
      check_out_photo
      obs_justify
      option_justify
      picture_justify
    }
  }
}
`;

export const GET_JUSTIFY_QUERY = gql`
query GetJustify {
  getJustify {
    id
    description
    mandatory_picture
    mandatory_observation
    workspace_id
    sub_workspace_id
  }
}
`;

export const TEAM_QUERY = gql`
query ListFilterTeam {
  listFilterTeam {
    id
    name
  }
}
`;

export const VISITS_SUPERVISOR_QUERY = gql`
query Visits($filter: VisitFilter!) {
  visits(filter: $filter) {
    id
    status
    user_name
    pdv_name
    pdv_address
    dt_visit
    created_at
  }
}
`;