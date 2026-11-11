import L from 'leaflet'
import { createRouteProjection } from './routeProjection.js'

export function createRouteLines(map) {
  const renderer = map.getRenderer(L.polyline([]))
  const projection = createRouteProjection(map)
  renderer.on('update', projection.capture)
  map.on('zoomend', projection.capture)

  const RouteLine = L.Polyline.extend({
    onAdd(map) {
      this._routeRedraw = true
      try {
        return L.Polyline.prototype.onAdd.call(this, map)
      } finally {
        this._routeRedraw = false
      }
    },
    redraw() {
      this._routeRedraw = true
      try {
        return L.Polyline.prototype.redraw.call(this)
      } finally {
        this._routeRedraw = false
      }
    },
    _projectLatlngs(latlngs, result, bounds) {
      if (!this._routeRedraw) {
        return L.Polyline.prototype._projectLatlngs.call(this, latlngs, result, bounds)
      }
      if (latlngs[0] instanceof L.LatLng) {
        const ring = []
        for (const latlng of latlngs) {
          const point = projection.project(latlng)
          ring.push(point)
          bounds.extend(point)
        }
        result.push(ring)
      } else {
        for (const part of latlngs) this._projectLatlngs(part, result, bounds)
      }
    },
  })

  return (latlngs, options) => new RouteLine(latlngs, { ...options, renderer })
}
