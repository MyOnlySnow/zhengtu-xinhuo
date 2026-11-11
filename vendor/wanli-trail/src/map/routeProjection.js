export function createRouteProjection(map) {
  let zoom
  let originX
  let originY

  function capture() {
    zoom = map.getZoom()
    const origin = map.getPixelOrigin()
    originX = origin.x
    originY = origin.y
  }

  capture()

  return {
    capture,
    project(latlng) {
      const point = map.project(latlng, zoom)
      point.x = Math.round(point.x) - originX
      point.y = Math.round(point.y) - originY
      return point
    },
  }
}
