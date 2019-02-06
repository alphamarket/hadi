# `const db = require('better-sqlite3')(database, { verbose: console.log })`
# var sqlite3 = require('sqlite3').verbose();
# var db = new sqlite3.Database(databse);
#
$ = require("#{app_path}/helpers/backbone")

class EventController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.method()
    $.otherMethod()
    console.log(typeof $.db.getData('/events'))

module.exports = EventController
