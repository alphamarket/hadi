JsonDB = require('node-json-db');

exports.db = new JsonDB(database, true, false)

module.exports = {
    method: () -> console.log('the method')
    otherMethod: () -> console.log('the otherMethod')
}
