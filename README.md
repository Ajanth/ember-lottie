# ember-lottie

Forked from [@qonto/ember-lottie ](https://github.com/qonto/ember-lottie)

Render [lottie](https://github.com/airbnb/lottie-web) after effects animations in [Ember.js](https://emberjs.com).

## Compatibility

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Installation

```
ember install @ajanth/ember-lottie
```

## Usage

```hbs
<Lottie
  @name='empty state'
  @animationData={{this.animationData}}
  @path='/data.json'
  @loop={{false}}
  @autoplay={{false}}
  @speed={{500}}
  @containerId={{this.id}}
  @onDataReady={{this.args.onDataReady}}
  @isPaused={{false}}
  @isRestarted={{false}}
/>
```

## API reference

### Arguments

| Argument      | Type     | Description                                                                                     |     | Example |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- | --- | ------- |
| name          | string   | animation name for future reference                                                             |
| animationData | object   | an object with the exported animation data (mandatory at least one: `animationData` or `path`)  |
| path          | string   | the relative path to the animation object (mandatory at least one: `animationData` or `path`)   |
| loop          | boolean  | by default at `true`, the animation runs forever, at `false`, the animation is played only once |
| autoplay      | boolean  | by default to `true`, it will play as soon as it's loaded                                       |
| speed         | number   | `1` is normal speed, supports dynamic udpates                                                   |
| containerId   | string   | the dom element id on which to render the animation (mandatory)                                 |
| onDataReady   | function | a function that triggers the Lottie when you want it                                            |
| isPaused      | boolean  | by default at `false`, toggle this flag to pause/unpause animation                              |
| isRestarted   | boolean  | by default at `false`, update to true to restart animation (setting to false has no effect)     |

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
