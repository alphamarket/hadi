global.root_path = __dirname
global.app_path  = root_path + "/app"
global.assets_path  = app_path + "/assets"
global.node_modules_path = root_path + "/node_modules"

require('coffeescript').register();
require(app_path + '/controllers/main')
