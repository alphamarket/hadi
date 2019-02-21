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
    # check for limited version
    return $.response_fail global.limited_version_error_msg if global.limited_version and db.count('units') >= limited_version_limit
    # prepare the data values
    data = $.map(data, (el) -> $.trim(el, true))
    # check for validations
    return $.response_fail message: 'عنوان یگان نمی‌تواند خالی باشد' if not data.title.length
    # insert the data
    data = db.insert 'units', data
    # save the database
    db.save()
    # response the saved data
    $.response_success data

module.exports = UnitsController
