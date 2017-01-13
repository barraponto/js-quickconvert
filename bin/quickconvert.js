
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
        const formula = converter.get(a,b)
        if (formula) {
          console.log(`${a} to ${b} = ${formula.toString()}`)
        }
      }
    }
  }
  process.exit(0)
}

process.stdout.write(`

class ${name} {
  `)

for (const a of converter.getUnits()) {
  process.stdout.write(`
  get ${a}() {
    switch (this.type) {
    case '${a}':
      return this.value`)
  for (const b of converter.getUnits()) {
    if (b !== a && converter.canConvert(b, a)) {
      const formula = converter.get(b, a)
      if (formula) {
        process.stdout.write(`
    case '${b}': {`)
        for (const v of getVariables(formula)) {
          process.stdout.write(`
      const ${v} = this.${v}`)
        }
        process.stdout.write(`
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

