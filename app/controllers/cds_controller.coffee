sizeOf = require('image-size')
moment = require('moment-jalaali')

require("#{app_path}/helpers/include_all")

class CDsController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.response_success db.select 'cds'

  update_action: (data) ->
    out = null
    db.update 'cds',
      (item) ->
        # find by id
        item.id.toString() is data.id
      ,
      (item) ->
        # try to delete the file if the image file already exists & trying to set a new one!
        require('fs').unlink(item.image, () -> ) if data.image and item.image
        # for each values in data
        for key, value of data
          # update the original data for that value
          item[key] = value
        # convert persian date to date object
        item["return_date"] = moment(data.return_date, 'jYYYY/jM/jD').toDate() if data.return_date
        # convert persian date to date object
        item["pass_date"] = moment(data.pass_date, 'jYYYY/jM/jD').toDate() if data.pass_date
        # if any image provided?
        if data.image
          # store the image file
          $.store_image item, "cd"
          # get the size
          item.image_size = sizeOf(item.image)
        # the output data
        out = $.clone(item)
    # save the database
    db.save()
    # respond success with the output data
    $.response_success out

  delete_action: (data) ->
    $.response_success db.delete 'cds', (item) -> item.id.toString() is data.id.toString()

  create_action: (data) ->
    # prepare the data values
    data = $.map(data, (el) -> $.trim(el, true))
    # init the unit if not set
    data.unit ||= ""
    # insert the data into database and get the references object to the inserted data
    data = db.insert 'cds', data
    # convert persian date to date object
    data.return_date = moment(data.return_date, 'jYYYY/jM/jD').toDate() if data.return_date
    # convert persian date to date object
    data.pass_date = moment(data.pass_date, 'jYYYY/jM/jD').toDate() if data.pass_date
    # if any image provided?
    if data.image
      # store the image file
      $.store_image data, "cd"
      # get the size
      data.image_size = sizeOf(data.image)
    # save the db
    db.save()
    # send the created image to the client
    $.response_success data

module.exports = CDsController
