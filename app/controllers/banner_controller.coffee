fs = require('fs')
crypto = require('crypto')
moment = require('moment-jalaali')

require("#{app_path}/helpers/include_all")

class BannerController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->
    $.response_success db.select 'banners'

  create_action: (data) ->
    # prepare the data values
    data = $.map(data, (el) -> $.trim(el, true))
    # init the unit if not set
    data.unit ||= ""
    # fetch the image
    image = data["image"]
    # fetch the image md5 hash
    image_hash = crypto.createHash('md5').update(image).digest("hex") if image
    # insert the data into database and get the references object to the inserted data
    data = db.insert 'banners', data
    # update the image file path considering the data & image details
    data.image = "#{upload_path}/banner-#{data.id}-#{image_hash}.#{$.image_extension(image)}" if image
    # convert persian date to date object
    data.return_date = moment(data.return_date, 'jYYYY/jM/jD').toDate() if data.return_date
    # convert persian date to date object
    data.pass_date = moment(data.pass_date, 'jYYYY/jM/jD').toDate() if data.pass_date
    # write the image to the target file
    fs.writeFileSync(data.image, image, 'base64') if image
    # save the db
    db.save()
    # send the created image to the client
    $.response_success data

module.exports = BannerController
