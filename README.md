
Having lots of interrelated units that need to be converted from one to
another? Quickconvert to the rescue!

```
npm i -g quickconvert
```

## Tutorial

Say we have the following units which are taken from
[this page](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

**angle.units**
```ts
q = mm * 4
cm = mm / 10
in = 2.54 * cm
pt = in / 72
pc = 12 * pt
```

These are all simple linear equations, following standard JavaScript syntax.

Run quickconvert in a terminal:

```
quickconvert angle.units > angle.js
```

Now use it:

```ts
const Angle = require('./angle')
```

## License

The MIT License

