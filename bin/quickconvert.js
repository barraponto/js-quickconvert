
const fs = require('fs')
    , path = require('path')
    , { Converter, getVariables } = require('../index')
    , _ = require('lodash')

const argv = require('minimist')(process.argv.slice(2))
const name = _.upperFirst(_.camelCase(argv['name'] || path.basename(argv._[0], path.extname(argv._[0]))))
const converter = new Converter()

for (const file of argv._) {
  const content = fs.readFileSync(path.resolve(file)).toString()
  converter.parse(content)
}

function toJavaScriptExpression(formula) {
  return formula.terms.map(term =>
    term.coefficients.join("*")+"*"+term.variables.map(v => v.variable).join('*')).join('+')
}

_.forEach(argv['const'], (val, name) => {
  this.addConstant(name, val)
})


if (argv['formulas']) {
  for (const a of converter.getUnits()) {
    for (const b of converter.getUnits()) {
      if (converter.canConvert(a, b)) {
        const formula = converter.get(b,a)
        if (formula) {
          console.log(`${a} to ${b} = ${formula.toString()}`)
        }
      }
    }
  }
  process.exit(0)
}

process.stdout.write(`

const UNIT_REGEX = /([0-9]*(\.[0-9]+)?)([a-z][a-z0-9]+)/

class ${name} {

  static add(a, b, type = a.type) {
    return new ${name} (a.value + b[a.type], a.type)
  }

  static sub(a, b, type = a.type) {
    return new ${name} (a.value - b[a.type], a.type)
  }

  add(other) {
    this.value += other[this.type]
  }

  sub(other) {
    this.value -= other[this.type]
  }

  constructor(unit, type) {
    if (unit === undefined) {
      this.type = null
      this.value = null
    } else if (type === undefined) {
      if (typeof unit === 'number')
        throw new TypeError('no unit provided')
      const match = unit.match(UNIT_REGEX)
      if (match === null)
        throw new TypeError('invalid string representation')
      this.value = parseFloat(match[1])
      this.type = match[3]
    } else {
      this.value = unit
      this.type = type
    }
  }

  `)

for (const a of converter.getUnits()) {
  process.stdout.write(`
  get ${a}() {
    switch (this.type) {
    case '${a}':
      return this.value`)
  for (const b of converter.getUnits()) {
    if (b !== a && converter.canConvert(b, a)) {
      const formula = converter.get(a, b)
      if (formula) {
        process.stdout.write(`
    case '${b}': {
      const ${b} = this.value
      return ${toJavaScriptExpression(formula)}
      }`)
      }
    }
  }
  process.stdout.write(`
    default:
      throw new TypeError('could not convert '+this.type+' to ${a}')
    }
  }

  set ${a}(${a}) {
    this.type = '${a}'
    this.value = ${a}
  }
`)
}

process.stdout.write(`
}

if (typeof module === 'object' && module.exports) {
  module.exports = ${name}
}
`)

