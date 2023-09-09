import { animate, style } from '@angular/animations';
import { defaultFadeAnimation, FadeAnimationParams } from '../animation.constant';

export class FadeAnimationUtil {

  static defaultFadeAnimate = (animationDuration: number) => animate(
    `${animationDuration}ms`,
    style({ opacity: 1, transform: `translate3d(0, 0, 0)` })
  );

  static fadeUp = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(0, ${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeDown = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(0, -${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeRight = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(-${animation.distance}px, 0, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeLeft = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(${animation.distance}px, 0, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeUpRight = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(-${animation.distance}px, ${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeUpLeft = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(${animation.distance}px, ${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeDownRight = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(-${animation.distance}px, -${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];

  static fadeDownLeft = (animation: FadeAnimationParams = defaultFadeAnimation) => [
    style({ opacity: 0, transform: `translate3d(${animation.distance}px, -${animation.distance}px, 0)` }),
    FadeAnimationUtil.defaultFadeAnimate(animation.animationDuration)
  ];
}
