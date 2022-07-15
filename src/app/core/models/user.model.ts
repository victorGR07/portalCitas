import {Role} from "./role.model";

export class User {
  id: number
  nombre: String;
  primer_apellido: String;
  segundo_apellido: String;
  correo: String;
  password: String;
  id_rol: number;
  id_centro_trabajo: number;
  id_region: number;
  estatus: boolean;
  bloqueado: boolean;

}
