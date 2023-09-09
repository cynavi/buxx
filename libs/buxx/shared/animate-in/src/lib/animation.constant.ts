export interface AnimateDuration {
  animationDuration: number; // e.g, animation duration in millisecond
}

export interface FadeAnimationParams extends AnimateDuration {
  distance: number; // e.g, 200
}

export interface ZoomAnimationParams extends FadeAnimationParams {
  zoomInOrOutScale: number; // e.g, 0.8
}

export interface SlideAnimationParams extends AnimateDuration {
  slidePercentage: number; // e.g, 80
}

export interface FlipAnimationParams extends AnimateDuration {
  perspectiveDistance: number;
  rotateDegree: number;
}

export const defaultZoomInScale = 0.6;

export const defaultZoomOutScale = 1.2;

export const defaultDistance = 300;

export const defaultAnimationDuration = 500;

export const defaultSlidePercentage = 100;

export const defaultPerspectiveDistance = 2500;

export const defaultRotateDegree = 100;

export const defaultFadeAnimation: FadeAnimationParams = {
  animationDuration: defaultAnimationDuration,
  distance: defaultDistance
};

export const defaultFlipAnimation: FlipAnimationParams = {
  animationDuration: defaultAnimationDuration,
  perspectiveDistance: defaultPerspectiveDistance,
  rotateDegree: defaultRotateDegree
};

export const defaultZoomInAnimation: ZoomAnimationParams = {
  zoomInOrOutScale: defaultZoomInScale,
  distance: defaultDistance,
  animationDuration: defaultAnimationDuration
};

export const defaultZoomOutAnimation: ZoomAnimationParams = {
  zoomInOrOutScale: defaultZoomOutScale,
  distance: defaultDistance,
  animationDuration: defaultAnimationDuration
};

export const defaultSlideAnimation: SlideAnimationParams = {
  animationDuration: defaultAnimationDuration,
  slidePercentage: defaultSlidePercentage
};
