
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
in = cm / 2.54
pt = in * 72
pc = pt / 12
```

These are all simple linear equations, following standard JavaScript syntax.

Run quickconvert in a terminal:

```
quickconvert angle.units > angle.js
```

Now use it:

```ts
const Length = require('./length')
const l = new Length()
l.cm = 4
l.mm // suprise suprise!
l.mm = 5
const l2 = new Length('5px') // works
```

## CLI Usage

```
quickconvert [--name <name>] file ... 
```

 - **name**: the name of the JavaScript class. If none is defined, will be
   derived from the name of the file.

## API Reference

This section contains a reference of the generated API. `Unit` stands for the
name of the unit, as defined by the `--name`-parameter or the name of the
definitions file.

### new Unit()

Creates a new uninitialized unit.

### new Unit(str)

Parses `str` for a unit value according to the format `${val}${type}`. Examples are:

```
12px
2.345rad
1.2em
```

### new Unit(value, type)

Creates a new unit with the given numeric value and the given unit type.

```
new Length(12, 'px')
new Angle(15, 'grad')
```

### Unit.add(a, b)

Creates a new unit which is the sum of the two given units.

### Unit.sub(a, b)

Creates a new unit which is the difference of the two given units.

### Unit.neg(a)

Creates a new unit which is the negative of the given unit.

### unit.sub(a)

Mutates `unit` by subtracting the given unit.

### unit.add(a)

Mutates `unit` by adding the given unit.

### unit.neg()

Mutates unit by negating it.

```
const a = new Angle(12, 'deg')
a.neg()
a.deg // -12
```

## License

The MIT License

