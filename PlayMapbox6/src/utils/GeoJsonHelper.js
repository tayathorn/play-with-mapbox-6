const turf = require('./turf.min.js')
// import * as turf from '@turf/helpers'

export function convertToGeoJsonPoint(coordinates, properties = {}, bbox = null, id = null) {
  let point = turf.point(coordinates, properties, bbox, id)

  return point
}

export function convertToGeoJsonFeatureCollection(features) {
  let featureCollection = turf.featureCollection(features)

  return featureCollection
}

export function createCirclePolygon(center, radius, steps = 64, units = 'kilometers', properties = {}) {
  let circle = turf.circle(center, radius, steps, units, properties)

  return circle
}

export function findWithin(points, within) {
  
  // let searchWithin = turf.featureCollection([geoJsonPolygon])
  // let points = turf.featureCollection(geoJsonPoints)

  let pointsWithin = turf.within(points, within)

  // console.log('[findWithin] -- pointsWithin : ', pointsWithin)

  // pointsWithin = getGeomEach(pointsWithin)

  return pointsWithin

}