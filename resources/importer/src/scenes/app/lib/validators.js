export const standardRegexes = {
  numeric: /^-?\d*(\.|,)?\d*$/, // eslint-disable-line no-useless-escape
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape
}

export default [
  {
    callback: (value) => {

    },
    struct: [],
    error: ''
  }
]
