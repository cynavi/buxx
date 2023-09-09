import { animate, style } from '@angular/animations';
import { defaultSlideAnimation, SlideAnimationParams } from '../animation.constant';

export class SlideAnimationUtil {

  static defaultSlideAnimate = (animationDuration: number) => animate(
    `${animationDuration}ms`,
    style({ transform: `translate3d(0, 0, 0)` })
  );

  static slideUp = (animation: SlideAnimationParams = defaultSlideAnimation) => [
    style({ transform: `translate3d(0, ${animation.slidePercentage}%, 0)` }),
    SlideAnimationUtil.defaultSlideAnimate
  ];

  static slideDown = (animation: SlideAnimationParams = defaultSlideAnimation) => [
    style({ transform: `translate3d(0, -${animation.slidePercentage}%, 0)` }),
    SlideAnimationUtil.defaultSlideAnimate
  ];

  static slideRight = (animation: SlideAnimationParams = defaultSlideAnimation) => [
    style({ transform: `translate3d(-${animation.slidePercentage}%, 0, 0)` }),
    SlideAnimationUtil.defaultSlideAnimate
  ];

  static slideLeft = (animation: SlideAnimationParams = defaultSlideAnimation) => [
    style({ transform: `translate3d(${animation.slidePercentage}%, 0, 0)` }),
    SlideAnimationUtil.defaultSlideAnimate
  ];
}
