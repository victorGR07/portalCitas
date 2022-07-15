import gql from 'graphql-tag';

const GET_RECOMENDACIONES_GENERAL = gql`
query($id: ID,$recomendacion: String) {
    recomendacionPersonalizadoGeneral(id: $id,recomendacion: $recomendacion) {
      id
      recomendacion
      estatus
      deprecated
      created_at
    }
  }

`;

const GET_RECOMENDACIONES = gql`
query($id: ID,$recomendacion: String) {
    recomendacionPersonalizado(id: $id,recomendacion: $recomendacion) {
      id
      recomendacion
      estatus
      deprecated
      created_at
    }
  }

`;


const GET_TOPE = gql`
query fecha_configuracion {
  fecha_configuracion
}

`;

const GET_FECHAS = gql`
query fecha_configuraciones {
  fecha_configuraciones{
    id
    fecha
    is_current
  }
}
`;
const GET_HORAS = gql`
query freeTimeByTramite(
  $id_tramite:ID!,
  $fecha:Date!
) {
  getFreeTimeByTramite(
    id_tramite:$id_tramite,
    fecha:$fecha
  )
}
`;

const UNION_TRAMITE = gql`
query($id_tramite: ID!) {
  unionByTramite(id_tramite: $id_tramite) {
    id
    configuracion
  }
}
`;

const GET_TRAMITES_GENERAL = gql`
query {
  tramitesGeneral {
    id
    nombre
    descripcion
    requisitos
    estatus
  }
}
`;

const GET_TRAMITES = gql`
query {
  tramites {
    id
    nombre
    descripcion
    requisitos
  }
}
`;

const GET_DIAS_BLOQ = gql`
query dias {
  dias {
    id
    fecha
    deprecated
    created_at
    updated_at
  }
}
`;

const GET_DAYS_SPECIAL = gql`
query diasEspecialesByTramite($id_tramite: ID!) {
  diasEspecialesByTramite(
    id_tramite: $id_tramite
  )
}
`;


export { GET_RECOMENDACIONES_GENERAL,GET_RECOMENDACIONES,GET_TRAMITES_GENERAL,GET_TOPE,GET_FECHAS,GET_HORAS,UNION_TRAMITE,GET_TRAMITES,GET_DIAS_BLOQ,GET_DAYS_SPECIAL };
