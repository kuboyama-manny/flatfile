exports.expectedMatch = {
  fuzzy: {
    header: 'Bulk Add 4 Robots',
    colBodies: [
      {
        suggestedMatch: 'Robot Name',
        sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
        description: 'The designation of the robot',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: 'All values pass validation for this field'
      }, {
        suggestedMatch: 'Shield Color',
        sampleCols: ['red', 'blue', 'black'],
        description: 'Chromatic value',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: 'All values pass validation for this field'
      }, {
        suggestedMatch: 'Call Sign',
        sampleCols: ['Killer', 'R2D2', 'Snarlz'],
        description: '',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: '75% of rows fail validation (repair on next step)'
      }, {
        suggestedMatch: 'Robot Helmet Style',
        sampleCols: ['octagonal', 'square', 'triangle'],
        description: '',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: ''
      }
    ]
  },
  headerless: { // fix columnfill
    header: 'Bulk Add 5 Robots',
    colBodies: [
      {
        suggestedMatch: 'Robot Name',
        sampleCols: ['name', 'R32 Jingle Bells', '9 Sixty'],
        description: 'The designation of the robot',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: 'All values pass validation for this field'
      }, {
        suggestedMatch: 'Shield Color',
        sampleCols: ['color', 'red', 'blue'],
        description: 'Chromatic value',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: 'All values pass validation for this field'
      }, {
        suggestedMatch: 'Robot Helmet Style',
        sampleCols: ['nick', 'Killer', 'R2D2'],
        description: '',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: ''
      }, {
        suggestedMatch: 'Call Sign',
        sampleCols: ['helmet', 'octagonal', 'square'],
        description: '',
        percentFill: '100% of your rows have a value for this column',
        duplicate: '',
        validatePreview: '100% of rows fail validation (repair on next step)'
      }
    ]
  }
}
