import gql from 'graphql-tag';

const CREAR_USUARIO = gql`
mutation($id_rol: ID!,$nombre: String!,$primer_apellido: String!,$segundo_apellido: String,$correo: String!,$clave_privada: String!,$id_usuario: ID!,$curp: String!,$clave: String!) {
  addUsuario(id_rol: $id_rol,nombre: $nombre,primer_apellido: $primer_apellido,segundo_apellido: $segundo_apellido,correo: $correo,clave_privada: $clave_privada,id_usuario: $id_usuario,curp: $curp,clave: $clave) {
    id
    nombre
  }
}
`;


const ACTUALIZAR_USUARIO = gql`
mutation($id: ID!,$id_rol: ID!,$nombre: String!,$primer_apellido: String!,$segundo_apellido: String,$correo: String!,$clave_privada: String!,$id_usuario: ID!,$curp: String!,$clave: String) {
    updatedUsuario(id: $id,id_rol: $id_rol,nombre: $nombre,primer_apellido: $primer_apellido,segundo_apellido: $segundo_apellido,correo: $correo,clave_privada: $clave_privada,id_usuario: $id_usuario,curp: $curp,clave: $clave) {
      id
      nombre
    }
  }
`;


const BLOQUEAR_USUARIO_ACTIVO = gql`
mutation($id: ID!,$accion: Int!,$valor: Boolean!,$id_usuario: ID!) {
    bloqueoActivoUsario(id: $id,accion: $accion,valor: $valor,id_usuario: $id_usuario)
  }
`;


export { CREAR_USUARIO,ACTUALIZAR_USUARIO,BLOQUEAR_USUARIO_ACTIVO };
