export default [
  {
    'key': 'required',
    'name': 'Required Column',
    'validators': [
      {
        'validate': 'required'
      }
    ]
  }, {
    'key': 'required_without',
    'name': 'Required Without First Column',
    'validators': [
      {
        'validate': 'required_without',
        'fields': ['required']
      }
    ]
  }, {
    'key': 'required_without_all',
    'name': 'Required Without First Column and Second Column',
    'validators': [
      {
        'validate': 'required_without_all',
        'fields': ['required', 'required_without']
      }
    ]
  }, {
    'key': 'required_with_all',
    'name': 'Required With Tenth Column and Eleventh Column',
    'validators': [
      {
        'validate': 'required_with_all',
        'fields': ['multiple', 'required_without_multiple']
      }
    ]
  }, {
    'key': 'required_with',
    'name': 'Required With Tenth Column or Eleventh Column',
    'validators': [
      {
        'validate': 'required_with',
        'fields': ['multiple', 'required_without_multiple']
      }
    ]
  }, {
    'key': 'error',
    'name': 'Column With Error',
    'validators': [
      {
        'validate': 'required',
        'error': 'Must contain something'
      }
    ]
  }, {
    'key': 'numeric',
    'name': 'Numeric Regex Column',
    'validators': [
      {
        'validate': 'regex_matches',
        'regex': /^-?\d*(\.|,)?\d*$/
      }
    ]
  }, {
    'key': 'email',
    'name': 'Email Regex Column',
    'validators': [
      {
        'validate': 'regex_matches',
        'regex': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape
      }
    ]
  }, {
    'key': 'regex',
    'name': '4 Char Regex Column',
    'validators': [
      {
        'validate': 'regex_matches',
        'regex': /^\w{4}$/
      }
    ]
  }, {
    'key': 'regex_excludes',
    'name': 'Regex Column Not To Contain Numbers',
    'validators': [
      {
        'validate': 'regex_excludes',
        'regex': /\d+/,
        'error': 'Must not contain a number'
      },
      {
        'validate': 'regex_excludes',
        'regex': /[A-Z]+/,
        'error': 'Must not contain an uppercase letter'
      }
    ]
  }, {
    'key': 'multiple',
    'name': 'Multiple Validators Column',
    'validators': [
      {
        'validate': 'regex_matches',
        'regex': /^\w{4}$/,
        'error': 'Must have exactly 4 characters'
      }, {
        'validate': 'required',
        'error': 'Must have a value'
      }, {
        'validate': 'regex_matches',
        'regex': /test/,
        'error': 'Must contain the word "test"'
      }
    ]
  }, {
    'key': 'required_without_multiple',
    'name': 'Required Without Multiple Columns',
    'validators': [
      {
        'validate': 'required_without',
        'fields': ['required', 'multiple', 'no_validation'],
        'error': 'Must contain a value if "required", "multiple", & "no_validation" are empty'
      }
    ]
  }, {
    'key': 'no_validation',
    'name': 'No Validation Column',
    'validators': []
  }
]
