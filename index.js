
const parser = require('./units')
    , fs = require('fs')
    , path = require('path')

const DEFAULT_OPERATORS = {
  "+": 1,
  "-": 2,
  "*": 3,
  "/": 4
}

function push(arr, el) {
  const newArr = arr.slice()
  newArr.push(el)
  return newArr
}

function shuntingYard(exps, operators = DEFAULT_OPERATORS) {
  const operatorStack = []
  const out = []
  for (const exp of exps.slice().reverse()) {
    if (operators[exp] === undefined) {
      out.unshift(exp)
    } else {
      const prec1 = operators[exp]
      while (operatorStack.length > 0) {
        const o2 = operatorStack[0]
        const prec2 = operators[o2]
        if (prec1 < prec2) {
          out.unshift(o2)
          operatorStack.pop()
        } else {
          break
        }
      }
      operatorStack.push(exp)
    }
  }
  while (operatorStack.length > 0) 
    out.unshift(operatorStack.pop())
  return out
}

function toAST(exps, operators = DEFAULT_OPERATORS) {
  function consumeOne() {
    const exp = exps.shift()
    if (operators[exp] === undefined) {
      return exp
    } else {
      const a = consumeOne()
          , b = consumeOne()
      return [exp, a, b]
    }
  }
  return consumeOne()
}

function forEach(ast, proc, operators = DEFAULT_OPERATORS, path = []) {
  if (ast instanceof Array) {
    const [op, a, b] = ast
    const nextp = 
    forEach(a, proc, operators, push(path, 1))
    forEach(b, proc, operators, push(path, 2))
  } else {
    proc(ast, path)
  }
}

function forEachUnit(ast, proc, operators = DEFAULT_OPERATORS) {
  forEach(ast, (leaf, path) => {
    if (operators[leaf] === undefined && isNaN(parseFloat(leaf)))
      proc(leaf, path)
  })
}

function getPaths(rules) {
  const paths = {}
  for (const rule of rules) {
    forEachUnit(rule, (unit, path) => {
      if (paths[unit] === undefined)
        paths[unit] = []
      const fullpath = path.slice()
      fullpath.unshift(rule)
      paths[unit].push(fullpath)
    })
  }
  return paths
}

function getGraph(rules) {
  const edges = []
  const paths = getPaths(rules)
  for (const unit of Object.keys(paths)) {
    const unitPaths = paths[unit]
    for (const path of unitPaths) {
      const [rule, ...indices] = path
      edges.push([unit, rule[1], indices])
    }
  }
  return edges
}

function analyse(content, rules = []) {
  const parsed = parser.parse(content)
  parsed.forEach(rule => {
    rules.push(["=", rule[0], toAST(shuntingYard(rule[1]))])
  })
  return rules
}

module.exports = { shuntingYard, analyse, getGraph }

