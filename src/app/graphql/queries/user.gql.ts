import gql from 'graphql-tag';


const GET_USUARIOS = gql`
query($id: ID,$clave_privada: String,$correo: String,$curp: String,$id_rol: ID) {
  usuarioPersonalizado(id: $id,clave_privada: $clave_privada,correo: $correo,curp: $curp,id_rol: $id_rol) {
    id
    rol{
      id
      nombre
    }
    nombre
    primer_apellido
    segundo_apellido
    correo
    curp
    estatus
    bloqueado
    clave_privada
    created_at
  }
}
`;

const GET_ROLES = gql`
query($id: ID,$nombre: String) {
  rolPersonalizado(id: $id,nombre: $nombre) {
    id
    nombre
  }
}
`;

const USER = gql`
  query($login: String!) {
    user(login: $login) {
      avatarUrl
      login
      name
    }
  }
`;

export { GET_ROLES,GET_USUARIOS,USER };
