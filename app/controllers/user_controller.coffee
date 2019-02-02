class UserController extends BaseController
  constructor: (args) ->
    super()

  fuck_action: (data) ->
    () ->
      window.location = "#{_g('app_path')}/views/home/shity.ejs"


module.exports = UserController
