require("#{app_path}/helpers/include_all")

class EventController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.response_success db.select 'events'

module.exports = EventController
