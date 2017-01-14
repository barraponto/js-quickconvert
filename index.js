
const parser = require('./units')
    , algebra = require('algebra.js')
    , { Graph } = require('graphlib')
    , graphlib = require('graphlib')
    , _ = require('lodash')

function getVariables(ex) {
  if (ex instanceof algebra.Equation)
    return getVariables(ex.lhs).concat(getVariables(ex.rhs))
  else {
    const res = []
    function pushVars(ex) {
      if (ex.terms) {
        for (const term of ex.terms) {
          for (const v of term.variables) {
            res.push(v.variable)
          }
        }
      } else {
        throw new TypeError(`unknown expression`)
      }
    }
    pushVars(ex)
    return res
  }
}

class Converter {

  constructor() {
    this.constants = {}
    this.g = new Graph()
  }

  addConstant(name, value = true) {
    this.constants[name] = value
  }

  isConstant(v) {
    return this.constants[v] !== undefined
  }

  parse(content) {
    const parsed = parser.parse(content)
    for (const v of parsed.filter(p => typeof p !== 'string')) {
      this.addConstant(v)
    }
    const eqs = parsed
      .filter(p => typeof p === 'string')
      .map(p => new algebra.parse(p))
    for (const eq of eqs) {
      const vars = getVariables(eq).filter(v => !this.isConstant(v))
      if (vars.length !== 2)
        throw new TypeError(`unit formula cannot contain more than two distinct variables`)
      const [a, b] = vars
      this.g.setNode(a)
      this.g.setNode(b)
      this.g.setEdge(a, b, eq.solveFor(b))
      this.g.setEdge(b, a, eq.solveFor(a))
    }

    this.dijkstra = graphlib.alg.dijkstraAll(this.g)
    //if (this.dijkstra === undefined)
      //throw new TypeError(`could not link each unit to another`)
  }

  getPath(a, b) {
    const path = []
    const dijkstra = this.dijkstra[a]
    let curr = b
    while (true) {
      const { predecessor, distance } = dijkstra[curr]
      path.unshift(curr)
      if (predecessor === undefined)
        break
      else
        curr = predecessor
    }
    return path
  }

  canConvert(a, b) {
    return this.getPath(a,b).length > 0
  }

  getUnits() {
    return this.g.nodes()
  }

  get(a, b) {

    const path = this.getPath(b, a)

    if (path === null)
      throw new Error(`cannot convert unit ${a} to unit ${b}`)
    
    let eq
    eq = new algebra.Expression(path[0])
    let src = path[0]
    for (const dest of path.slice(1)) {
      const eq2 = this.g.edge(src, dest)
      eq = eq.eval({ [src]: eq2 })
      src = dest
    }

    //const f = (val) => {
      //let res = val
      //let src = a
      //for (const dest of path.slice(1)) {
        //const solver = this.g.edge(src, dest)
        //res = solver.eval(_.defaults({ [src]: res }, this.constants))
        //src = dest
      //}
      //return res
    //}

    return eq
  }

}

module.exports = { Converter, getVariables }

