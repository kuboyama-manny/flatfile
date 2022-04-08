import validateCellData from './validateCellRows'
const { rows, expected } = validateCellData
export { rows }
export default expected.map((row, i) => {
  return Object.keys(row).map((key, j) => {
    return { value: rows[i][key], errors: row[key], col: j }
  })
})
