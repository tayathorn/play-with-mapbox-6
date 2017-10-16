const turf = require('./turf.min.js')

export function convertToGeoJsonPoint(coordinates, properties = {}) {
  let point = turf.point(coordinates, properties)

  return point
}

export function convertToGeoJsonFeatureCollection(data) {
  // let features = [data]
  let features = data
  let featureCollection = turf.featureCollection(features)

  return featureCollection
}