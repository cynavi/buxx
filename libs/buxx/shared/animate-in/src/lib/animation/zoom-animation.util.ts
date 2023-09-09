import { defaultZoomInAnimation, defaultZoomOutAnimation, ZoomAnimationParams } from '../animation.constant';
import { animate, AnimationAnimateMetadata, style } from '@angular/animations';

export class ZoomAnimationUtil {

  static defaultZoomAnimate = (animationDuration: number): AnimationAnimateMetadata => animate(
    `${animationDuration}ms`,
    style({ opacity: 1, transform: `translate3d(0, 0, 0) scale(1)` })
  );

  static zoomIn = (animation: ZoomAnimationParams = defaultZoomInAnimation) => [
    style({ opacity: 0, transform: `scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ]

  static zoomInUp = (animation: ZoomAnimationParams = defaultZoomInAnimation) => [
    style({ opacity: 0, transform: `translate3d(0, ${animation.distance}px, 0) scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomInDown = (animation: ZoomAnimationParams = defaultZoomInAnimation) => [
    style({
      opacity: 0,
      transform: `translate3d(0, -${animation.distance}px, 0) scale(${animation.zoomInOrOutScale})`
    }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomInRight = (animation: ZoomAnimationParams = defaultZoomInAnimation) => [
    style({
      opacity: 0,
      transform: `translate3d(-${animation.distance}px, 0, 0) scale(${animation.zoomInOrOutScale})`
    }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomInLeft = (animation: ZoomAnimationParams = defaultZoomInAnimation) => [
    style({ opacity: 0, transform: `translate3d(${animation.distance}px, 0, 0) scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomOut = (animation: ZoomAnimationParams = defaultZoomOutAnimation) => [
    style({ opacity: 0, transform: `scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomOutUp = (animation: ZoomAnimationParams = defaultZoomOutAnimation) => [
    style({ opacity: 0, transform: `translate3d(0, ${animation.distance}px, 0) scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomOutDown = (animation: ZoomAnimationParams = defaultZoomOutAnimation) => [
    style({
      opacity: 0,
      transform: `translate3d(0, -${animation.distance}px, 0) scale(${animation.zoomInOrOutScale})`
    }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomOutRight = (animation: ZoomAnimationParams = defaultZoomOutAnimation) => [
    style({
      opacity: 0,
      transform: `translate3d(-${animation.distance}px, 0, 0) scale(${animation.zoomInOrOutScale})`
    }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];

  static zoomOutLeft = (animation: ZoomAnimationParams = defaultZoomOutAnimation) => [
    style({ opacity: 0, transform: `translate3d(${animation.distance}px, 0, 0) scale(${animation.zoomInOrOutScale})` }),
    ZoomAnimationUtil.defaultZoomAnimate(animation.animationDuration)
  ];
}
