import {
  animate,
  group,
  query,
  state,
  style,
  transition,
  trigger
  } from '@angular/animations';

export const slideAnimation  =
  trigger('routeAnimations', [
        transition('Aplicacion => *', [
             query(':enter, :leave',
                  style({
                    position: 'fixed', width: '100%'
                  }),
                  { optional: true }),
             group([
                  query(':enter',[
                      style({ transform: 'translateX(-100%)' }),
                      animate('300ms ease-out',
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({ transform:   'translateX(0%)'}),
                      animate('300ms ease-out',
                      style({ transform: 'translateX(100%)' }))
                  ], { optional: true }),
             ])
        ]),
        transition('Login => *', [
             query(':enter, :leave',
                  style({ position: 'fixed',  width: '100%' }),
                  { optional: true }),
             group([
                  query(':enter', [
                      style({ transform: 'translateX(100%)' }),
                      animate('300ms ease-out',
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({ transform: 'translateX(0%)' }),
                      animate('300ms ease-out',
                      style({ transform: 'translateX(-100%)' }))
                      ], { optional: true }),
              ])
        ])
  ]);
