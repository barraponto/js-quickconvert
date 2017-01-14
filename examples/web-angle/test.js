
const { expect } = require('chai')
const Angle = require('./angle')

describe('an angle', () => {
  
  it('can do some conversions', () => {
    const a = new Angle()
    a.deg = 180
    expect(a.rad).to.equal(Math.PI)
    a.turn = 1
    expect(a.deg).to.equal(360)
  })

  it('can construct from a string', () => {
    const a = new Angle('180deg')
    expect(a.deg).to.equal(180)
  })

  it('can add two units', () => {
    const a = new Angle('180deg')
    const b = new Angle('1turn')
    a.add(b)
    expect(a.deg).to.equal(540)

    const c = new Angle('180deg')
    const d = new Angle('1turn')
    const e = Angle.add(c,d)
    expect(e).to.be.instanceof(Angle)
    expect(e.deg).to.equal(540)
  })

})

