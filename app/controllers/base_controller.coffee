electron = require('electron')
`const { ipcMain } = electron;`

class BaseController
  ;
global.BaseController = BaseController

global.register_controller = (_class) ->
  get_actions = (obj) ->
    hasMethod = (obj, name) ->
      desc = Object.getOwnPropertyDescriptor(obj, name)
      ! !desc and typeof desc.value == 'function'

    array = []
    proto = Object.getPrototypeOf(obj)
    while proto
      Object.getOwnPropertyNames(proto).forEach (name) ->
        match = name.match(/^([A-Z][A-Z0-9]*)_action$/ig)
        if match?
          if hasMethod(proto, name)
            array.push name.replace /_action$/, ''
        return
      proto = Object.getPrototypeOf(proto)
    array

  if typeof _class is 'function'
    ins = eval "new #{_class}"
  else if typeof _class is 'object'
    ins = _class
  else
    throw "undefined argument type of `#{typeof _class}`"
  # compute & convert the base url
  base_path = ins.constructor.name
                .replace(/\.?([A-Z]+)/g, (x, y) -> "_" + y.toLowerCase())
                .replace(/^_/, "")
                .toLowerCase()
                .replace(/(_\/|\/_)/, "/")
                .replace(/[_]+/gi, '/')
                .replace(/\/controller$/gi, '')
                
  module.exports = eval(ins.constructor.name)
