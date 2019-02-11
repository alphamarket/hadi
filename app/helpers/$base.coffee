module.exports = {
  random_str: (length) ->
    i = 0
    text = ''
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    while i++ < length
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    text

  trim: (str, complete = false) ->
    str = str.replace(/^[\n\t\r ]*/g, "").replace(/[\n\t\r ]*$/g, "")
    str = str.replace(/[\n\t\r ]+/g, " ") if complete
    str

  image_extension: (image) ->
    switch image.charAt(0)
      when '/' then 'jpg'
      when 'i' then 'png'
      when 'R' then 'gif'
      when 'U' then 'webp'

  map: (data, callback) ->
    if Array.isArray(data)
      data.map(callback)
    else
      for key of data
        if typeof(data[key]) is "object"
          data[key] = @map(data[key], callback)
        else
          data[key] = callback(data[key])
      data

  response_success: (resp) ->
    {
      status: "ok",
      response: resp
    }

  response_fail: (resp) ->
    {
      status: "failed",
      response: resp
    }

  bench_mark: (callback) ->
    millisec_to_s = (millisec) ->
      seconds = (millisec / 1000).toFixed(0)
      minutes = Math.floor(seconds / 60)
      hours = ''
      if minutes > 59
        hours = Math.floor(minutes / 60)
        hours = if hours >= 10 then hours else '0' + hours
        minutes = minutes - (hours * 60)
        minutes = if minutes >= 10 then minutes else '0' + minutes
      seconds = Math.floor(seconds % 60)
      seconds = if seconds >= 10 then seconds else '0' + seconds
      if hours != ''
        return hours + ':' + minutes + ':' + seconds
      minutes + ':' + seconds
    t0 = new Date();
    callback()
    t1 = new Date() - t0;
    [millisec_to_s(t1), t1]

  clone: (obj) ->
    if not obj? or typeof obj isnt 'object'
      return obj
    if obj instanceof Date
      return new Date(obj.getTime())
    if obj instanceof RegExp
      flags = ''
      flags += 'g' if obj.global?
      flags += 'i' if obj.ignoreCase?
      flags += 'm' if obj.multiline?
      flags += 'y' if obj.sticky?
      return new RegExp(obj.source, flags)
    newInstance = new obj.constructor()
    for key of obj
      newInstance[key] = @clone obj[key]
    return newInstance
}
