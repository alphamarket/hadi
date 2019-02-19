moment = require('moment-jalaali')

require("#{app_path}/helpers/include_all")

class HomeController extends BaseController
  constructor: (args) ->
    super()

  context_action: (args) ->
    bayan = db_extra.getData('/bayanat')
    hadis = db_extra.getData('/ahadis')
    doy   = moment().dayOfYear()
    $.response_success {
      bayan: bayan[doy % bayan.length]
      hadis: hadis[doy % hadis.length]
    }

module.exports = HomeController
