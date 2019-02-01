global.root_path = __dirname
global.app_path  = __dirname + "/app"
require('coffeescript').register();
require(app_path + '/controllers/main')
