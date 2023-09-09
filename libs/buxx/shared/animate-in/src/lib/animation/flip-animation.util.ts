import { defaultFlipAnimation, FlipAnimationParams } from '../animation.constant';
import { animate, style } from '@angular/animations';

export class FlipAnimationUtil {

  static flipLeft = (flipAnimation: FlipAnimationParams = defaultFlipAnimation) => [
    style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(-${flipAnimation.rotateDegree}deg)` }),
    animate(
      `${flipAnimation.animationDuration}ms`,
      style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(0)` })
    )
  ];

  static flipRight = (flipAnimation: FlipAnimationParams = defaultFlipAnimation) => [
    style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(${flipAnimation.rotateDegree}deg)` }),
    animate(
      `${flipAnimation.animationDuration}ms`,
      style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(0)` })
    )
  ];

  static flipUp = (flipAnimation: FlipAnimationParams = defaultFlipAnimation) => [
    style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(-${flipAnimation.rotateDegree}deg)` }),
    animate(
      `${flipAnimation.animationDuration}ms`,
      style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateX(0)` })
    )
  ];

  static flipDown = (flipAnimation: FlipAnimationParams = defaultFlipAnimation) => [
    style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateY(${flipAnimation.rotateDegree}deg)` }),
    animate(
      `${flipAnimation.animationDuration}ms`,
      style({ transform: `perspective(${flipAnimation.perspectiveDistance}px) rotateX(0)` })
    )
  ];
}

