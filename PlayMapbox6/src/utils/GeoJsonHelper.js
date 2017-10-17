// const turf = require('./turf.min.js')
import * as turf from '@turf/helpers'

export function convertToGeoJsonPoint(coordinates, properties = {}, bbox = null, id = null) {
  let point = turf.point(coordinates, properties, bbox, id)

  return point
}

export function convertToGeoJsonFeatureCollection(features) {
  let featureCollection = turf.featureCollection(features)

  return featureCollection
}