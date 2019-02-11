require("#{app_path}/helpers/include_all")

class UnitsController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.response_success db.select 'units'

  delete_action: (data) ->
    $.response_success db.delete 'units', (item) -> item.id.toString() is data.id.toString()

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
    return $.response_fail message: 'عنوان یگان نمی‌تواند خالی باشد' if not data.title.length
    data = db.insert 'units', data
    db.save()
    $.response_success data

module.exports = UnitsController
