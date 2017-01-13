
const fs = require('fs')
    , path = require('path')
    , quickconvert = require('../index')

const argv = require('minimist')(process.argv.slice(2))

const rules = []
for (const file of argv._) {
  const content = fs.readFileSync(path.resolve(file)).toString()
  quickconvert.analyse(content, rules)
}

console.log(rules)

