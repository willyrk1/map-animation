import {expect, test} from "vitest";
import {joinShapes, positionsMatch, safeGet} from "./utility.ts";
import {Position} from "geojson";

function verifyResults(coordinates: Array<Position>) {
    let index = coordinates.findIndex((pos: Position) => positionsMatch(pos, [100, 100]))
    const direction = positionsMatch(safeGet(coordinates, index + 1), [101, 101]) ? 1 : -1
    expect(safeGet(coordinates, index += direction)).toEqual([101, 101])
    expect(safeGet(coordinates, index += direction)).toEqual([102, 102])
    expect(safeGet(coordinates, index += direction)).toEqual([103, 103])
    expect(safeGet(coordinates, index += direction)).toEqual([104, 104])
    expect(safeGet(coordinates, index += direction)).toEqual([105, 105])
    expect(safeGet(coordinates, index += direction)).toEqual([400, 400])
    expect(safeGet(coordinates, index += direction)).toEqual([205, 205])
    expect(safeGet(coordinates, index += direction)).toEqual([204, 204])
    expect(safeGet(coordinates, index += direction)).toEqual([203, 203])
    expect(safeGet(coordinates, index += direction)).toEqual([202, 202])
    expect(safeGet(coordinates, index += direction)).toEqual([201, 201])
    expect(safeGet(coordinates, index += direction)).toEqual([200, 200])
    expect(safeGet(coordinates, index += direction)).toEqual([805, 805])
    expect(safeGet(coordinates, index += direction)).toEqual([804, 804])
    expect(safeGet(coordinates, index += direction)).toEqual([803, 803])
    expect(safeGet(coordinates, index += direction)).toEqual([802, 802])
    expect(safeGet(coordinates, index += direction)).toEqual([801, 801])
    expect(safeGet(coordinates, index += direction)).toEqual([800, 800])
    expect(safeGet(coordinates, index += direction)).toEqual([404, 404])
    expect(safeGet(coordinates, index += direction)).toEqual([700, 700])
    expect(safeGet(coordinates, index += direction)).toEqual([701, 701])
    expect(safeGet(coordinates, index += direction)).toEqual([702, 702])
    expect(safeGet(coordinates, index += direction)).toEqual([703, 703])
    expect(safeGet(coordinates, index + direction)).toEqual([704, 704])
}

test('joinShapes works when shared boundary is in the middle of both lists', () => {
    const coordinates = joinShapes([
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
    ], [
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is in the middle of both lists, and path 1 ends duplicate', () => {
    const coordinates = joinShapes([
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
    ], [
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is in the middle of both lists, and path 1 and 2 ends duplicate', () => {
    const coordinates = joinShapes([
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
    ], [
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is in the middle of both lists, and path 2 is reverse', () => {
    const coordinates = joinShapes([
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
    ], [
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
    ].reverse())
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of the first list', () => {
    const coordinates = joinShapes([
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
    ], [
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of the first list and second list reversed', () => {
    const coordinates = joinShapes([
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
    ], [
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
    ].reverse())
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of the second list', () => {
    const coordinates = joinShapes([
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
    ], [
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of the second list which is reversed', () => {
    const coordinates = joinShapes([
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
    ], [
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
    ].reverse())
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of both lists', () => {
    const coordinates = joinShapes([
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
    ], [
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
    ])
    verifyResults(coordinates)
})

test('joinShapes works when shared boundary is at the beginning of both lists and the second is reversed', () => {
    const coordinates = joinShapes([
        [401, 401],
        [402, 402],
        [403, 403],
        [404, 404],
        [700, 700],
        [701, 701],
        [702, 702],
        [703, 703],
        [704, 704],
        [100, 100],
        [101, 101],
        [102, 102],
        [103, 103],
        [104, 104],
        [105, 105],
        [400, 400],
    ], [
        [403, 403],
        [404, 404],
        [800, 800],
        [801, 801],
        [802, 802],
        [803, 803],
        [804, 804],
        [805, 805],
        [200, 200],
        [201, 201],
        [202, 202],
        [203, 203],
        [204, 204],
        [205, 205],
        [400, 400],
        [401, 401],
        [402, 402],
    ].reverse())
    verifyResults(coordinates)
})
