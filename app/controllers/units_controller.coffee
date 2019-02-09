require("#{app_path}/helpers/include_all")

class UnitsController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.response_success db.select 'units'

  update_action: (data) ->
    out = null
    db.update 'units',
      (item) ->
        item.id.toString() is data.id
      ,
      (item) ->
        for key, value of data
          item[key] = value
        out = item
    db.save()
    $.response_success out

  create_action: (data) ->
    data = $.map(data, (el) -> $.trim(el, true))
    db.insert 'units', data
    db.save()
    $.response_success data

module.exports = UnitsController
