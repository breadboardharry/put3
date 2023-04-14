import { transition, trigger, query, style, animate, group } from '@angular/animations';

const duration = {
  global: '400ms',
  locker: '200ms'
}
const delay = {
  global: '100ms',
  locker: '100ms'
}

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home => Master, Home => Control', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate(duration.global + ' ' +  delay.global + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration.global + ' ' + delay.global + ' ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Master => Home', [
      query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Home => Fool, Home => Control', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Fool => Home', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(duration.global + ' ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
      ])
    ]),

    transition('Control => Home', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'scale(0%)' }),
          animate(duration.locker + ' ' +  delay.locker + ' ease-in-out', style({ transform: 'scale(100%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'scale(100%)' }),
          animate(duration.locker + ' ' +  delay.locker + ' ease-in-out', style({ transform: 'scale(0%)' }))
        ], { optional: true }),
      ])
    ]),

    // transition('Control => *', [
    //   query(':enter, :leave',
    //     style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
    //   group([
    //     query(':enter', [
    //       style({ transform: 'translateY(100%)' }),
    //       animate(duration.locker + ' ' +  delay.locker + ' ease-in-out', style({ transform: 'translateY(0%)' }))
    //     ], { optional: true }),
    //     query(':leave', [
    //       style({ transform: 'translateY(0%)' }),
    //       animate(duration.locker + ' ' + delay.locker + ' ease-in-out', style({ transform: 'translateY(-100%)' }))
    //     ], { optional: true }),
    //   ])
    // ]),

    transition('Control => *', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
      group([
        query(':enter', [
          style({ opacity: '0' }),
          animate(duration.locker + ' ease-in-out', style({ opacity: '1' }))
        ], { optional: true }),
        query(':leave', [
          style({ opacity: '1' }),
          animate(duration.locker + ' ' + delay.locker + ' ease-in-out', style({ opacity: '0' }))
        ], { optional: true }),
      ])
    ]),
  ]);
