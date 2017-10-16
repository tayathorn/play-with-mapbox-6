const turf = require('./turf.min.js')

export function convertToGeoJsonPoint(coordinates, properties = {}) {
  var point = turf.point(coordinates, properties)

  return point
}