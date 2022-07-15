import { Prototype } from './prototype.interface';

export interface Responsable extends Prototype {
  nombre: string; 
  primer_apellido: string; 
  segundo_apellido: string; 
  correo_electronico: string; 
  puesto_laboral: string; 
}