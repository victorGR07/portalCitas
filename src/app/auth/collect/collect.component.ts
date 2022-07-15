import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountService } from '../autentication.service';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { slideAnimation } from '../transition';
import { SessionStorageService } from '../../core/services/sessionstorage.service';
import { RelacionesInputValidacionesService } from '../../services/validaciones/relacioninputvalidaciones.service';
import { ServiciosService } from '../../core/services/servicios.service';
import { Subscription } from 'rxjs';

declare var M: any;

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.css'],
})
export class CollectComponent implements OnInit {
  form: FormGroup;
  pass: any;
  loading: boolean = false;
  user: any;
  arrextras: any;
  update_subscription: Subscription;
  sugerenciasPuestosLaboral: any[];
  sugerenciasModalidadesTrabajo: any[];
  sugerenciasAreas: any[];
  sugerenciasModulos: any[];
  puestosLaborales: any[];
  modalidadesTrabajo: any[];
  modulosAreas: any[];
  modulos: any[];
  areas: any[];
  union_subscription: Subscription;
  id_union_modulos_areas: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountService,
    private sessionStorageService: SessionStorageService,
    private utils: UtilsService,
    private serviciosService: ServiciosService,
    public relacionesInputValidacionesService: RelacionesInputValidacionesService,

    private router?: Router,

  ) { }

  ngOnInit(): void {
  }
 
}
