import { Prototype } from './prototype.interface';
import { Estado } from './estado.interface';
import { Area } from './area.interface';

export interface Revision extends Prototype {
  id_queja: string; 
  estado: Estado; 
  area: Area; 
  comentario: string; 
  numero_oficio: string;   
}