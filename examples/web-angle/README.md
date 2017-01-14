
This is a tiny library able to hyper-efficiently convert CSS angles to and from
different units, as described
[here](https://developer.mozilla.org/en-US/docs/Web/CSS/angle).

This library was auto-generated using
[QuickConvert](https://github.com/samvv/js-quickconvert).

## Supported Units

 - **deg**
 - **turn**
 - **grad**
 - **rad**

## Example

```js
const a = new Angle()
a.deg = 180

const b = new Angle('1turn')
b.deg // 360
b.turn = 2
b.deg += 20
b.deg // 740

const c = new Angle(90, 'deg')
c.add(b)
const d = Angle.sub(c, a)
```

## Reference

For a full reference, see the documentation of the
[quickconvert](https://github.com/samvv/js-quickconvert)-project.

