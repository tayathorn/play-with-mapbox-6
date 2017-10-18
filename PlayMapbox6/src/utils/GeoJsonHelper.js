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
  
  let pointsWithin = turf.within(points, within)
  return pointsWithin

}

export function getIdFeatureEach(featureCollection) {

  let result = []

  turf.featureEach(featureCollection, (currentFeature, index) => {
    result.push(currentFeature.id)
    // console.log('currentFeature.id : ', currentFeature.id)
  })

  return result
}