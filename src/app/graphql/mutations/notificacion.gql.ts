import gql from 'graphql-tag';

const CREAR_NOTIFICACION = gql`
mutation($mensaje: String!,$fecha: Date!,$id_usuario: ID!) {
  notificacionCitas(mensaje: $mensaje,fecha: $fecha,id_usuario: $id_usuario)
}
`;


export { CREAR_NOTIFICACION };
