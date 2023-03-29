import Component from '@glimmer/component';
import { action } from '@ember/object';
import { buildWaiter } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import Ember from 'ember';

import { AnimationItem, LottiePlayer } from 'lottie-web';
import window from 'ember-window-mock';

const waiter = buildWaiter('ember-lottie:lottie-waiter');
class NotFoundError extends Error {
  constructor() {
    super();

    this.name = 'NotFoundError';
    this.message = 'You must pass an existing file to the `@path`';

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export interface LottieArgs {
  name?: string;
  animationData?: any;
  path?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  containerId?: string;
  isPaused?: boolean;
  isRestarted?: boolean;
  onDataReady?: () => void;
}

export default class LottieComponent extends Component<LottieArgs> {
  private animation?: AnimationItem;
  private mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  @tracked private _isPaused = false;
  @tracked private _isRestarted = false;
  @tracked private _speed = 1;

  get isPaused() {
    return this._isPaused || false;
  }

  get speed() {
    return this._speed || 1;
  }

  get autoplay() {
    return this.canAutoplay ?? true;
  }

  get canAutoplay() {
    const prefersReducedMotion = this.mediaQuery?.matches;
    return !prefersReducedMotion && this.args.autoplay;
  }

  @action
  async animate(element: HTMLElement): Promise<void> {
    const token = waiter.beginAsync();
    const lottie = await this.loadLottie();
    let animationData;

    if (this.args.animationData) {
      animationData = this.args.animationData;
    } else if (this.args.path) {
      try {
        const response = await fetch(this.args.path);

        if (response.status === 404) {
          throw new NotFoundError();
        } else {
          animationData = await response.json();
        }
      } finally {
        waiter.endAsync(token);
      }
    }

    this.args.onDataReady?.();

    const { containerId } = this.args;
    const container = containerId
      ? (document.querySelector(`#${containerId}`) as Element)
      : element;

    this.animation = lottie.loadAnimation({
      name: this.args.name,
      loop: this.args.loop,
      autoplay: this.autoplay,
      animationData,
      container,
      rendererSettings: {
        progressiveLoad: true,
      },
    });

    this._speed = this.args.speed || 1;
    const speed = Ember.testing ? 0 : this._speed;
    this.animation.setSpeed(speed);

    this.mediaQuery?.addEventListener(
      'change',
      this.handleReducedMotionPreferenceChange
    );
  }

  willDestroy() {
    console.log('willDestroy called');
    super.willDestroy();

    this.mediaQuery?.removeEventListener(
      'change',
      this.handleReducedMotionPreferenceChange
    );

    if (this.animation) {
      this.animation.destroy();
    }
  }

  @action
  updateAnimationState() {
    if (
      this.args.isPaused !== undefined &&
      this.args.isPaused !== this._isPaused
    ) {
      this._isPaused = this.args.isPaused;
      if (this._isPaused) {
        this.animation?.pause();
      } else {
        this.animation?.play();
      }
    }

    if (
      this.args.isRestarted !== undefined &&
      this.args.isRestarted !== this._isRestarted
    ) {
      this._isRestarted = this.args.isRestarted;
      if (this._isRestarted) {
        this.animation?.goToAndPlay(0, true);
        this._isRestarted = false;
      }
    }

    if (
      this.args.speed !== undefined &&
      this.args.speed !== this._speed &&
      this.args.speed > 0
    ) {
      this._speed = this.args.speed;
      this.animation?.setSpeed(this._speed);
    }
  }

  @action
  private handleReducedMotionPreferenceChange() {
    const prefersReducedMotion = this.mediaQuery?.matches;
    if (prefersReducedMotion) {
      this.animation?.stop();
    }
  }

  private async loadLottie(): Promise<LottiePlayer> {
    const lottieModule = await import('lottie-web');
    return lottieModule.default;
  }
}
