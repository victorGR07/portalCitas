export interface AccountItem {
  X_TOKEN_ACCOUNT: string;
  X_REFRESH_TOKEN_ACCOUNT: string;
  expiresIn: Date;
}

export interface CredencialesItem {
  correo_electronico: string;
  clave_privada: string;
  id_aplicacion: number;
}

export interface Account {
  persona: any,
  usuario: any;
  rol: any;
  area: any;
}
