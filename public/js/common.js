'use strict'

var recieve = function(response, success, catch) {
  var status = response.status
  if (status === 'success')
    return success(response.data)
  else
    return catch(response.data)
}