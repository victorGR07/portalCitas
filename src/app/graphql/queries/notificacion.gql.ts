import gql from 'graphql-tag';

const GET_NOTIFICACIONES = gql`
query {
  logNotificaciones {
    id
    descripcion
    operacion
  }
}
`;

export { GET_NOTIFICACIONES };
