`const db = require('better-sqlite3')(database, { verbose: console.log })`

class EventController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    db.prepare('SELECT * FROM events').all()

module.exports = EventController
