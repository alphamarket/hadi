class UserController extends BaseController
  constructor: (args) ->
    super()

  fuck_action: (data) ->
    console.log(data)
    {
      respose: 'fucking working!!'
    }

  create_action: (data) ->
    console.log(["creating a user with: ", data])
    "USER #{JSON.stringify(data)} created"
    # () ->
      # window.location = "#{_g('app_path')}/views/home/shity.ejs"


module.exports = UserController
