import gql from 'graphql-tag';


const GET_ESTADOS = gql`
query($id: ID,$nombre: String) {
    estadosPersonalizados(id: $id,nombre: $nombre) {
      id
      nombre
    }
  }
`;


const GET_REPORTE_CITAS = gql`
query($fecha_inicio: Date!,$fecha_fin: Date!,$tipo_persona: String,$id_tramite: ID,$id_usuario: ID,$id_estado: ID) {
    reportesCitas(fecha_inicio: $fecha_inicio,fecha_fin: $fecha_fin,tipo_persona: $tipo_persona,id_tramite: $id_tramite,id_usuario: $id_usuario,id_estado: $id_estado) {
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
    documentacion
    estado{
      id
      nombre
    }
    union_tramite_configuracion{
      id
      tramite
      {
        id
        nombre
        requisitos
      }
      tramiteGeneral{
        id
        nombre
        requisitos
      }
    }
    observacion
    tramite_confirmacion{
      id
      nombre
    }
    tramite_confirmacionGeneral{
     id
     nombre
   }
    usuario{
      id
      nombre
      primer_apellido
      segundo_apellido
    }
    created_at
    }
  }
`;


const GET_CITA = gql`
query($id: ID,$folio_general: ID,$folio_dia: ID,$rfc: String,$email: String,$fecha: Date,$hora: Date,$id_estado: ID) {
    citaPersonalizada(id: $id,folio_general: $folio_general,folio_dia: $folio_dia,rfc: $rfc,email: $email,fecha: $fecha,hora: $hora,id_estado: $id_estado) {
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
    documentacion
    union_tramite_configuracion{
      id
      tramite
      {
        id
        nombre
        requisitos
      }
      tramiteGeneral{
        id
        nombre
        requisitos
      }
    }
    observacion
    tramite_confirmacion{
      id
      nombre
    }
    estado{
      id
      nombre
    }
    usuario{
      id
      nombre
      primer_apellido
      segundo_apellido
    }
    created_at
    }
  }
`;


const GET_REPORTE_X_TRAMITE = gql`
query($id_tramite: ID!) {
  citasByTramite(id_tramite: $id_tramite) {
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
  atendido
  cancelado
  union_tramite_configuracion{
    id
    tramite
    {
      id
      nombre
    }
  }
  observacion
  tramite_confirmacion{
    id
    nombre
  }
  created_at
  }
}
`;


const VALIDAR_CITA = gql`
query($rfc: String!,$fecha: String!) {
  canMakeCita(rfc: $rfc,fecha: $fecha)
}
`;

export { GET_ESTADOS,GET_REPORTE_CITAS,GET_CITA,GET_REPORTE_X_TRAMITE,VALIDAR_CITA };
