import { standardRegexes } from './validators'
import { precisionRound } from './functions'
import difference from 'lodash/difference'
import './polyfills'

export default class Settings {
  constructor (settings) {
    this.settings = settings
  }

  set settings (settings) {
    this._settings = this.initSettings(settings)
  }

  set errors (errors) {
    this._errors = errors
  }

  get errors () {
    return this._errors
  }

  get settings () {
    return Object.assign({allowCustom: false, fuzziness: 0.4, type: 'Record', allowInvalidSubmit: false, managed: false}, this._settings)
  }

  validate () {
    this.testSettings(this._settings)
    return !this._errors.length
  }

  initSettings (settings) {
    return Object.keys(settings).reduce((acc, val) => {
      if (val === 'fields' && Array.isArray(settings[val])) {
        acc[val] = settings[val].reduce((a, field) => {
          a.push(this.normalizeFieldValues(field))
          return a
        }, [])
      } else if (val === 'fuzziness' && typeof settings.fuzziness === 'number') { // if NaN pass it along to be caught in validation
        acc.fuzziness = this.normalizeFuzziness(acc.fuzziness)
      } else {
        acc[val] = settings[val]
      }
      return acc
    }, {})
  }

  normalizeFuzziness (fuz) {
    const round = Math.min(precisionRound(fuz, 1), 10)
    return Math.max(round > 1 ? Math.floor(round) / 10 : round, 0.1)
  }

  normalizeFieldValues (field) {
    field = this.bootstrapSingularValidators(field)
    if (!field.label && field.key) {
      field.label = field.key
    }
    if (!field.description) {
      field.description = ''
    }
    field.validators = Array.isArray(field.validators) ? field.validators : []
    field.validators = field.validators.map(v => {
      if (typeof v === 'object' && v.validate) {
        if (v.validate === 'regex_matches' && this.discernValidatorType(v.regex) === 'standard_regex') {
          v.regex = standardRegexes[v.regex]
        }
        return v
      } else {
        return this.expandSimpleValidator(v)
      }
    })
    field.validators = this.stripDuplicateAndEmptyValidators(field.validators)
    return field
  }

  stripDuplicateAndEmptyValidators (validators) {
    return validators.reduce((acc, val) => {
      if (!!val.validate && acc.findIndex(v => v.validate === val.validatte) < 0) {
        acc.push(val)
      }
      return acc
    }, [])
  }

  expandSimpleValidator (validator) {
    const validatorType = this.discernValidatorType(validator)
    switch (validatorType) {
      case 'regex':
        return { validate: 'regex_matches', regex: validator }
      case 'standard_regex':
        return { validate: 'regex_matches', regex: standardRegexes[validator] }
      case 'regex_excludes':
        return { validate: 'regex_excludes', regex: validator.regex_excludes }
      case 'isRequired':
        return { validate: 'required' }
      case 'required_without':
      case 'required_without_all':
      case 'required_with_all':
      case 'required_with':
        return { validate: validatorType, fields: validator[validatorType] }
      case null:
      default:
        return { validate: null }
    }
  }

  discernValidatorType (validator) {
    if (validator instanceof RegExp) {
      return 'regex'
    } else if (typeof validator === 'string' && standardRegexes[validator]) {
      return 'standard_regex'
    } else if (typeof validator === 'object' && validator.regex_excludes) {
      return 'regex_excludes'
    } else if (typeof validator === 'object' && validator.isRequired) {
      return 'isRequired'
    } else if (typeof validator === 'object' && validator.required_without) {
      return 'required_without'
    } else if (typeof validator === 'object' && validator.required_without_all) {
      return 'required_without_all'
    } else if (typeof validator === 'object' && validator.required_with_all) {
      return 'required_with_all'
    } else if (typeof validator === 'object' && validator.required_with) {
      return 'required_with'
    } else {
      return null
    }
  }

  bootstrapSingularValidators (field) {
    const validators = field.validators || []
    if (field.validator) {
      if (typeof field.validator === 'object' && field.validator.validate) {
        validators.push(field.validator)
      } else {
        validators.push(this.expandSimpleValidator(field.validator))
      }
    }
    if (field.isRequired && Array.isArray(validators) && validators.filter(v => v.validate === 'required').length === 0) {
      validators.push({ validate: 'required' })
    }
    delete field.isRequired
    delete field.validator
    field.validators = validators
    return field
  }

  regexToString (key, value) {
    if (value instanceof RegExp) {
      return value.toString()
    }
    return value
  }

  testSettings (settings) {
    let errors = []
    if (!window.FF_LICENSE_KEY) {
      errors.push('The provided license is invalid')
    }
    errors = [...errors, ...this.validateOptions(settings)]
    errors = [...errors, ...this.validateFields(settings.fields)]
    this.errors = errors.filter(v => v)
  }

  validateOptions (settings) {
    const errors = []
    const invalidOptions = difference(Object.keys(settings), ['fields', 'type', 'allowCustom', 'fuzziness', 'allowInvalidSubmit', 'managed'])
    if (invalidOptions.length) {
      errors.push(`Unrecognized extra setting(s) present: ${JSON.stringify(invalidOptions, this.regexToString, 4)}`)
    }
    if (settings.type && typeof settings.type !== 'string') {
      errors.push("'type' option must be a string")
    }
    if (typeof settings.allowCustom !== 'boolean' && typeof settings.allowCustom !== 'undefined') {
      errors.push("'allowCustom' option must be boolean")
    }
    if (typeof settings.allowInvalidSubmit !== 'boolean' && typeof settings.allowInvalidSubmit !== 'undefined') {
      errors.push("'allowInvalidSubmit' option must be boolean")
    }
    if (typeof settings.managed !== 'boolean' && typeof settings.managed !== 'undefined') {
      errors.push("'managed' option must be boolean")
    }
    if (settings.fields && !Array.isArray(settings.fields)) {
      errors.push('Fields should be in an array')
    }
    if (settings.fields && Array.isArray(settings.fields) && !settings.fields.length) {
      errors.push('Fields array should have at least one field')
    }
    if (!settings.fields) {
      errors.push('Array of fields must be present')
    }
    if (settings.fuzziness && settings.fuzziness.isNaN()) {
      errors.push("'fuzziness' settings must be a number")
    }
    return errors
  }

  validateFields (fields) {
    let errors = []
    if (fields && Array.isArray(fields)) {
      fields.forEach((field) => {
        if (typeof field === 'object') {
          errors = [...errors, ...this.validateKeys(Object.keys(field), field)]
          errors = [...errors, ...this.validateStringKeys(field.label, field.key, field.description, field)]
          if (field.alternates) {
            errors = [...errors, ...this.validateAlternates(field.alternates, field)]
          }
          if (field.validators) {
            errors = [...errors, ...this.validateValidators(field.validators, field, fields)]
          }
        } else {
          errors.push(`Fields should be objects: ${JSON.stringify(field, this.regexToString, 4)}`)
        }
      })
      const keyCount = fields.reduce((a, b) =>
        Object.assign(a, {[b.key]: (a[b.key] || 0) + 1}), {})
      const duplicateKeys = Object.keys(keyCount).filter(v => keyCount[v] > 1)
      if (duplicateKeys.length) {
        errors.push(`Fields must have unique keys. Check fields with keys: ${duplicateKeys.join(', ')}`)
      }
    }
    return errors
  }

  validateKeys (keys, field) {
    const errors = []
    const extraKeys = difference(keys, ['label', 'key', 'description', 'validators', 'alternates'])
    if (extraKeys.length) {
      errors.push(`Extra keys found in field: ${extraKeys.join(', ')}`)
    }
    if (keys.indexOf('key') < 0) {
      errors.push('A key is required for all fields')
    }
    return errors
  }

  validateStringKeys (label, key, description, field) {
    const errors = []
    if (typeof label !== 'string') {
      errors.push(`Labels must be strings in field: ${JSON.stringify(field, null, 4)}`)
    }
    if (typeof key !== 'string') {
      errors.push(`Keys must be strings in field: ${JSON.stringify(field, null, 4)}`)
    }
    if (typeof description !== 'string') {
      errors.push(`Descriptions must be strings in field: ${JSON.stringify(field, null, 4)}`)
    }
    return errors
  }

  validateAlternates (alternates, field) {
    const errors = []
    if (!Array.isArray(alternates)) {
      errors.push(`Alternates must be in arrays in field: ${JSON.stringify(field, null, 4)}`)
      return errors
    }
    if (!alternates.every(v => typeof v === 'string')) {
      errors.push(`Alternates must all be strings in field: ${JSON.stringify(field, null, 4)}`)
    }
    return errors
  }

  validateValidators (validators, field, fields) {
    let errors = []
    if (Array.isArray(validators)) {
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i]
        if (typeof validator.validate === 'string') {
          switch (validator.validate) {
            case 'regex_matches':
              errors = [...errors, ...this.validateRegexMatches(validator, field)]
              break
            case 'regex_excludes':
              errors = [...errors, ...this.validateRegexExcludes(validator, field)]
              break
            case 'required':
              errors = [...errors, ...this.validateRequired(validator, field)]
              break
            case 'required_without':
            case 'required_without_all':
            case 'required_with_all':
            case 'required_with':
              errors = [...errors, ...this.validateRequiredFields(validator, field, fields)]
              break
            default:
              errors.push(`Unkown validator method ${validator.validate} in field: ${JSON.stringify(field, null, 4)}`)
          }
        } else {
          errors.push(`'${field.key}' requires validate method in field: ${JSON.stringify(field, null, 4)}`)
        }
      }
    } else {
      errors.push(`'${field.key}' requires validators to be in an array in field: ${JSON.stringify(field, null, 4)}`)
    }
    return errors
  }

  validateRegexMatches (validator, field) {
    const errors = []
    if (!validator.regex) {
      errors.push(`'regex_matches' validator requires a 'regex' field in: ${JSON.stringify(field, null, 4)}`)
    }
    if (!(validator.regex instanceof RegExp)) {
      errors.push(`'regex' field in 'regex_matches' validator must be a RegExp object in: ${JSON.stringify(field, null, 4)}`)
    }
    const invalidFields = difference(Object.keys(validator), ['validate', 'regex', 'error'])
    if (invalidFields.length) {
      errors.push(`'regex_matches' validator has unexpected field(s) "${invalidFields.join(', ')}" in: ${JSON.stringify(field, null, 4)}`)
    }
    errors.push(this.validateErrorField(validator, field))
    return errors
  }

  validateRegexExcludes (validator, field) {
    const errors = []
    if (!validator.regex) {
      errors.push(`'regex_excludes' validator requires a 'regex' field in: ${JSON.stringify(field, null, 4)}`)
    }
    if (!(validator.regex instanceof RegExp)) {
      errors.push(`'regex' field in 'regex_excludes' validator must be a RegExp object in: ${JSON.stringify(field, null, 4)}`)
    }
    const invalidFields = difference(Object.keys(validator), ['validate', 'regex', 'error'])
    if (invalidFields.length) {
      errors.push(`'regex_excludes' validator has unexpected field(s) "${invalidFields.join(', ')}" in: ${JSON.stringify(field, null, 4)}`)
    }
    errors.push(this.validateErrorField(validator, field))
    return errors
  }

  validateRequired (validator, field) {
    const errors = []
    const invalidFields = difference(Object.keys(validator), ['validate', 'error'])
    if (invalidFields.length) {
      errors.push(`'required' validator has unexpected field(s) "${invalidFields.join(', ')}" in: ${JSON.stringify(field, null, 4)}`)
    }
    errors.push(this.validateErrorField(validator, field))
    return errors
  }

  validateRequiredFields (validator, field, fields) {
    const errors = []
    const invalidFields = difference(Object.keys(validator), ['validate', 'fields', 'error'])
    if (invalidFields.length) {
      errors.push(`${validator.validate} validator has unexpected field(s) "${invalidFields.join(', ')}" in: ${JSON.stringify(field, null, 4)}`)
    }
    errors.push(this.validateErrorField(validator, field))
    if (!validator.fields) {
      errors.push(`${validator.validate} validator requires a 'fields' field in: ${JSON.stringify(field, null, 4)}`)
    }
    if (!Array.isArray(validator.fields)) {
      errors.push(`'fields' field in ${validator.validate} validator must be an array in: ${JSON.stringify(field, null, 4)}`)
    }
    if (!validator.fields.every(v => fields.findIndex(f => f.key === v) > -1 && v !== field.key)) {
      errors.push(`'fields' field in ${validator.validate} validator must only contain keys of other fields in: ${JSON.stringify(field, null, 4)}`)
    }
    return errors
  }

  validateErrorField (validator, field) {
    if (validator.error && typeof validator.error !== 'string') {
      return `'error' field must be a string in ${validator.validate} in field: ${JSON.stringify(field, null, 4)}`
    }
  }
}
