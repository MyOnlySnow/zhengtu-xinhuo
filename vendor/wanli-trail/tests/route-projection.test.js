import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRouteProjection } from '../src/map/routeProjection.js'

function createMap(zoom, x, y) {
  return {
    zoom,
    origin: { x, y },
    getZoom() { return this.zoom },
    getPixelOrigin() { return this.origin },
    project({ lat, lng }, level) {
      const scale = 2 ** level
      return { x: lng * scale, y: -lat * scale }
    },
  }
}

function screenPoint(point, reference, current) {
  const scale = 2 ** (current.zoom - reference.zoom)
  return {
    x: (point.x + reference.origin.x) * scale - current.origin.x,
    y: (point.y + reference.origin.y) * scale - current.origin.y,
  }
}

test('route updates stay in the SVG reference frame throughout a camera flight', () => {
  const map = createMap(4, 1000, -400)
  const reference = { zoom: map.zoom, origin: { ...map.origin } }
  const projection = createRouteProjection(map)
  const places = [{ lat: 26, lng: 115 }, { lat: 28, lng: 106 }, { lat: 31, lng: 103 }]
  for (const zoom of [4.25, 4.5, 5, 5.5, 6]) {
    map.zoom = zoom
    map.origin = { x: 1300, y: -700 }
    for (const place of places) {
      const actual = screenPoint(projection.project(place), reference, map)
      const expected = map.project(place, zoom)
      assert.ok(Math.abs(actual.x - (expected.x - map.origin.x)) < 1e-8)
      assert.ok(Math.abs(actual.y - (expected.y - map.origin.y)) < 1e-8)
    }
  }
})

test('renderer refresh captures the new reference without a post-flight jump', () => {
  const map = createMap(4, 1000, -400)
  const projection = createRouteProjection(map)
  const place = { lat: 26.37, lng: 115.41 }
  map.zoom = 6
  map.origin = { x: 6800, y: -1800 }
  projection.capture()
  const world = map.project(place, map.zoom)
  assert.deepEqual(projection.project(place), {
    x: Math.round(world.x) - map.origin.x,
    y: Math.round(world.y) - map.origin.y,
  })
})

test('panning preserves the reference until the renderer refreshes it', () => {
  const map = createMap(5, 2000, -800)
  const reference = { zoom: map.zoom, origin: { ...map.origin } }
  const projection = createRouteProjection(map)
  const place = { lat: 30, lng: 104 }
  map.origin = { x: 2400, y: -900 }
  const screen = screenPoint(projection.project(place), reference, map)
  const world = map.project(place, map.zoom)
  assert.deepEqual(screen, { x: world.x - map.origin.x, y: world.y - map.origin.y })
  projection.capture()
  assert.deepEqual(projection.project(place), screen)
})

test('projection snapshots survive mutable origins and remain isolated between maps', () => {
  const firstMap = createMap(4, 1000, -400)
  const secondMap = createMap(6, 6000, -2000)
  const first = createRouteProjection(firstMap)
  const second = createRouteProjection(secondMap)
  const place = { lat: 26, lng: 115 }
  const firstPoint = first.project(place)
  const secondPoint = second.project(place)
  firstMap.origin.x += 200
  assert.deepEqual(first.project(place), firstPoint)
  first.capture()
  assert.equal(first.project(place).x, firstPoint.x - 200)
  assert.deepEqual(second.project(place), secondPoint)
})
