import { transition, trigger, query, style, animate, group } from '@angular/animations';

const duration = '400ms';
const delay = '100ms';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home => Master', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate(duration + ' ' +  delay + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration + ' ' + delay + ' ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Master => Home', [
      query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Home => Fool', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Fool => Home', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration + ' ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
      ])
    ]),
  ]);
