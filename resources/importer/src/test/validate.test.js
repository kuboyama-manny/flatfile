/* eslint no-undef: 0 */

import Validate from '../scenes/app/lib/validate'

import columns from './columns'
import validateCellData from './validateCellRows'
import validateTableData from './validateTableRows'

describe('validateCell', () => {
  const { rows, expected } = validateCellData
  const v = new Validate(rows, columns)
  rows.forEach((row, i) => {
    Object.keys(row).forEach((key, j) => {
      test(`${columns[j].name} with ${row[key]}`, () => {
        expect(v.validateCell(i, j, row[key])).toEqual(expected[i][key])
      })
    })
  })
})

describe('validateRow', () => {
  const { rows } = validateCellData
  const v = new Validate(rows, columns)
  rows.forEach((row, i) => {
    test('validateRow should return expected row', () => {
      expect(v.validateRow(v.validationState[i], i)).toEqual(validateTableData[i])
    })
    test('validateRow should update errorRows', () => {
      expect(v.errorRows.filter(c => !c).length).toEqual(i)
    })
  })
})

describe('validateTable', () => {
  const { rows } = validateCellData
  const v = new Validate(rows, columns)
  v.validateTable()
  test('Whole table matches expected results', () => {
    expect(v.validationState).toEqual(validateTableData)
  })
  test('Number of errorRows should be correct', () => {
    expect(v.errorRows).toEqual([true, false, false, false])
  })
})

describe('resetValidationState', () => {
  const { rows } = validateCellData
  const v = new Validate(rows, columns)
  const initialState = JSON.stringify(v.validationState)
  v.validateTable()
  v.resetValidationState(rows)
  test('resetValidationState should reset to initial state', () => {
    expect(JSON.stringify(v.validationState)).toBe(initialState)
  })
})
