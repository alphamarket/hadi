glob = require( 'glob' )

global.$ ||= {}

glob.sync( "#{__dirname}/*" ).forEach (file) ->
  return if file is __filename
  Object.assign($, require(file))
