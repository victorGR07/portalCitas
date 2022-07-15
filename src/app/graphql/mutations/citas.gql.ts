import gql from 'graphql-tag';

const ATENDER_CITA = gql`
mutation setAtendido($id: ID!, $tramite_confirmacion: ID!, $id_usuario: ID!) {
  setAtendido(id: $id, tramite_confirmacion: $tramite_confirmacion, id_usuario: $id_usuario) {
    id
  }
}
`;

const UPDATE_REQUISITOS_CITA = gql`
mutation setDocumentacion($id: ID!, $documentacion: JSON!, $id_usuario: ID!) {
  setDocumentacion(id: $id, documentacion: $documentacion, id_usuario: $id_usuario) {
    id
  }
}
`;


const UPDATE_ESTADO_CITA = gql`
mutation setEstadoCita($id: ID!, $id_estado: ID!, $id_usuario: ID!) {
  setEstadoCita(id: $id, id_estado: $id_estado, id_usuario: $id_usuario) {
    id
  }
}

`;

const CREATE_CITA = gql`
mutation cita(
  $nombre: String
  $primer_apellido: String
  $segundo_apellido: String
  $razon_social: String
  $tipo_persona: String!
  $rfc: String!
  $telefono: String!
  $email: String!
  $fecha: String!
  $hora: String!
  $union_tramite_configuracion: ID!
) {
  cita(
    nombre: $nombre
    primer_apellido: $primer_apellido
    segundo_apellido: $segundo_apellido
    razon_social: $razon_social
    tipo_persona: $tipo_persona
    rfc: $rfc
    telefono: $telefono
    email: $email
    fecha: $fecha
    hora: $hora
    union_tramite_configuracion: $union_tramite_configuracion
  ) {
      id
  folio_general
  folio_dia
  nombre
  primer_apellido
  segundo_apellido
  razon_social
  tipo_persona
  rfc
  telefono
  email
  fecha
  hora
  union_tramite_configuracion{
    id
    tramite
    {
      id
      nombre
      requisitos
    }
  }
  observacion
  tramite_confirmacion{
    id
    nombre
    requisitos
  }
  created_at
  }
}
`;



const UPDATE_OBSERVACION = gql`
mutation setObservacion($id: ID!, $observacion: String!, $id_usuario: ID!) {
  setObservacion(id: $id, observacion: $observacion, id_usuario: $id_usuario) {
    id
    nombre
    primer_apellido
    segundo_apellido
    telefono
    email
    fecha
    hora
  }
}

`;


export {  ATENDER_CITA,UPDATE_REQUISITOS_CITA,UPDATE_ESTADO_CITA,CREATE_CITA,UPDATE_OBSERVACION  };
