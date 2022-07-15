import gql from 'graphql-tag';


const DAR_BAJA_RECOMENDACIONES = gql`
mutation bajaRecomendacion(
  $id: ID!
  $id_usuario: ID!
) {
  bajaRecomendacion(
    id: $id,id_usuario: $id_usuario
  )
}
`;

const DAR_ALTA_RECOMENDACIONES = gql`
mutation altaRecomendacion(
  $id: ID!
  $id_usuario: ID!
) {
  altaRecomendacion(
    id: $id,id_usuario: $id_usuario
  )
}
`;


const ORDENAR_RECOMENDACIONES = gql`
mutation ordenamientoRecomendaciones(
  $ordenamiento: JSON
) {
  ordenamientoRecomendaciones(
    ordenamiento: $ordenamiento
  )
}
`;

const BAJAR_RECOMENDACION = gql`
mutation bajaRecomendacion(
  $id: ID!
  $id_usuario: ID!
) {
  bajaRecomendacion(
    id: $id
    id_usuario: $id_usuario
  )
}
`;

const AGREGAR_RECOMENDACION = gql`
mutation recomendacion($recomendacion: String!,$id_usuario: ID!) {
  recomendacion(recomendacion: $recomendacion,id_usuario: $id_usuario){
    id
  }
}
`;

const CAMBIAR_CONFIGURACION = gql`
mutation setConfiguracion($configuracion: JSON!,$id_usuario: ID!) {
  setConfiguracion(configuracion: $configuracion,id_usuario: $id_usuario){
    id
  }
}
`;


const ORDENAR_ENTIDADES = gql`
mutation ordenamiento(
  $ordenamiento: JSON
) {
  ordenamiento(
    ordenamiento: $ordenamiento
  )
}
`;

const CAMBIAR_ESTADO_TRAMITE = gql`
mutation updateEstatusTramite($id: ID!,$estatus: Boolean!,$id_usuario: ID!) {
  updateEstatusTramite(id: $id,estatus: $estatus,id_usuario: $id_usuario)
}
`;

const CREATE_TOPE = gql`
mutation crearfecha_configuracion($fecha_configuracion: Date,$id_usuario: ID!) {
  crearfecha_configuracion(fecha_configuracion: $fecha_configuracion,id_usuario: $id_usuario)
}
`;



const QUITAR_TOPE = gql`
mutation cancelarfechafecha_configuracion($id: ID!,$id_usuario: ID!) {
  cancelarfechafecha_configuracion(id: $id,id_usuario: $id_usuario)
}
`;


const ACTUALIZAR_TRAMITE = gql`
mutation updateTramite(
  $id: ID!
  $nombre: String!
  $descripcion: String
  $id_usuario: ID!
) {
  updateTramite(
    id: $id
    nombre: $nombre
    descripcion: $descripcion
    id_usuario: $id_usuario
  ){
    id
    nombre
  }
}
`;


const ACTUALIZAR_REQUISITOS_TRAMITE = gql`
mutation updatedTramiteRequsitos(
  $id: ID!
  $requisitos: [Requisitos!]
  $id_usuario: ID!
) {
  updatedTramiteRequsitos(
    id: $id
    requisitos: $requisitos
    id_usuario: $id_usuario
  ){
    id
    nombre
  }
}
`;

const CREATE_TRAMITE = gql`
mutation tramite(
  $nombre: String!
  $requisitos: [Requisitos!]!
  $descripcion: String
  $id_usuario: ID!
) {
  tramite(
    nombre: $nombre
    requisitos: $requisitos
    descripcion: $descripcion
    id_usuario: $id_usuario
  ){
    id
    nombre
  }
}
`;

const NEW_DATE = gql`
mutation crearDia($fecha: String!,$id_usuario: ID!) {
  dia(fecha:$fecha,id_usuario:$id_usuario) {
    id
    fecha
    deprecated
    created_at
    updated_at
  }
}
`;


const DELETE_DAYS_SPECIAL = gql`
mutation deleteDiasEspeciales(
  $id_tramite: ID!
  $id_usuario: ID!
  $dias: [String]!
) {
  deleteDiasEspeciales(
    id_tramite: $id_tramite
    id_usuario: $id_usuario
    dias: $dias
  )
}
`;


const CREATE_DAY_SPECIAL = gql`
mutation setDiasEspeciales(
  $id_tramite: ID!
  $id_usuario: ID!
  $dias: [JSON]!
) {
  setDiasEspeciales(
    id_tramite: $id_tramite
    id_usuario: $id_usuario
    dias: $dias
  )
}
`;



const CREATE_UNION = gql`

mutation unionSave($id_tramite:ID!, $configuracion: JSON!,$id_usuario:ID!) {
  union(
    id_tramite:$id_tramite,
    configuracion:$configuracion,
    id_usuario:$id_usuario
  ){
    id
  }
}

`;

export { DAR_BAJA_RECOMENDACIONES,DAR_ALTA_RECOMENDACIONES,ORDENAR_RECOMENDACIONES,BAJAR_RECOMENDACION,AGREGAR_RECOMENDACION,ACTUALIZAR_REQUISITOS_TRAMITE,ORDENAR_ENTIDADES,CAMBIAR_CONFIGURACION,CAMBIAR_ESTADO_TRAMITE,ACTUALIZAR_TRAMITE,QUITAR_TOPE,CREATE_TOPE,CREATE_TRAMITE,NEW_DATE,DELETE_DAYS_SPECIAL,CREATE_DAY_SPECIAL,CREATE_UNION };
