db.route_to = (path, meta = false, raw_path = false) ->
  if not raw_path
    splits = path.split("/").filter (e) -> e.length
    if meta
      path = "#{splits[0]}/meta"
    else
      path = "#{splits[0]}/data/#{splits.slice(1).join('/')}"
    path = db.normalize_path(path)
  path

db.normalize_path = (path) ->
  path.replace(/^\/*/gi, "/").replace(/\/*$/gi, "")

db.collection = (path) ->
  db.getData(db.route_to(path))

db.meta = (path, read_only = true) ->
  meta = db.getData(db.route_to(path, true))
  meta = $.clone(meta) if read_only
  meta

db.is_read_only = (path) ->
  return false if not db.exists(db.route_to(path, true))
  meta = db.meta(path)
  meta.read_only or meta.solid_read_only

db.make_read_only = (path) ->
  meta = db.meta(path)
  meta.read_only = true
  db.push(db.route_to(path, true), meta)

db.count = (path) ->
  db.collection(path).length

db.last = (path) ->
  db.collection(path)[-1..][0]

db.first = (path) ->
  db.collection(path)[0]

db.iterate_over = (path, callback) ->
  collection = db.collection(db.route_to(path))
  for key, value of collection
    callback(value, key, collection, path)

db.select = (path, where) ->
  out = []
  collection = db.collection(path)
  if not where
    out = collection
  else
    for key, data of collection
      out.push(data) if(where($.clone(data), key))
  out

db.update = (path, where, update) ->
  return if db.is_read_only(path)
  db.select(path, where).forEach (item, key) ->
    update(item, key);
    item.updated_at = new Date()

db.insert = (path, data) ->
  return if db.is_read_only(path)
  path = db.normalize_path(path)
  db.push(path, { meta: { count: 0 }, data: [] }) if not db.exists(path)
  collection = db.collection(path)
  meta = db.meta(path, false)
  [data]
    .flat()
    .forEach((item, index) ->
      item.created_at = new Date();
      item.updated_at = new Date();
      collection.push(item)
      item.id = (++meta.count)
    )

db.delete = (path, where) ->
  return if not db.exists(db.route_to(path)) or db.is_read_only(path)
  out = []
  where = (() -> true) if not where
  db.push db.route_to(path), db.collection(path).filter (data, key, collection) ->
    cond = where(data, key)
    out.push(data) if(cond)
    !cond
  out
