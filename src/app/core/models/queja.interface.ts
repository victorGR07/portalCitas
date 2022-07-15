import { Prototype } from './prototype.interface';
import { Estado } from './estado.interface';
import { Medio } from './medio.interface';
import { TipoSolicitud } from './tipo_solicitud.interface';
import { Area } from './area.interface';
import { Revision } from './revision.interface';

export interface Queja extends Prototype {
  folio: string;
  medio: Medio; 
  estado: Estado; 
  tipo_solicitud: TipoSolicitud; 
  area: Area;
  concesiones: { concesiones: {id_concesion: string, nuc: string, nombre: string}[] }; 
  numeros_economicos: { numeros_economicos: {numero: string}[] };
  mensaje: string; 
  nombre_emisor: string; 
  telefono_emisor: string; 
  correo_electronico_emisor: string; 
  revisiones: Revision[];
  revision_ultima: Revision;
  concesion: any; 
}