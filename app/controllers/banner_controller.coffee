require("#{app_path}/helpers/include_all")

class BannerController extends BaseController
  constructor: (args) ->
    super()

  list_action: (args) ->

  create_action: (data) ->
    require('fs').writeFileSync("out1.png", data["image"], 'base64')
    "USER #{JSON.stringify(data)} created"
    sizeOf = require('image-size');
    console.log(sizeOf('out1.png'))
    # () ->
      # window.location = "#{_g('app_path')}/views/home/shity.ejs"


module.exports = BannerController
