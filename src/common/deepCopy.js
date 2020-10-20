export  function deepCopy(obj) {
  if(obj === null) return null
  if(typeof obj !== 'object') return obj
  if(obj.constructor === Date) return new Date(obj)
  var newObj = new obj.constructor()
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      var val = obj[key]
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val;
    }
  }
  return newObj
}