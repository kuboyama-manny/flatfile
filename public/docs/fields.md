# Fields
Configure the fields to map the uploaded data to. Easily setup validation, format hinting and more.

---

This reference covers the `fields` configuration object

```js
{
  ...
  fields: [
    {
      label: "Full Name",
      key: "name",
      hints: ["nom"],
      validators: [{...}]
    }
  ]
}
```

<table>
  <tr>
    <th>Setting</th>
    <th>Format</th>
    <th>Information</th>
    <th>Required</th>
  </tr>
  <tr>
    <td>`key`</td>
    <td>**string**</td>
    <td>The JSON key you want to map the data to in the final output.</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>`label`</td>
    <td>**string**</td>
    <td>This is displayed in the table header when entering, editing, and reviewing data.</td>
    <td>No</td>
  </tr>
  <tr>
    <td>`description`</td>
    <td>**string**</td>
    <td>This is a short description of the field which will be displayed as a tooltip in the header of the associated column.</td>
    <td>No</td>
  </tr>
  <tr>
    <td>`hints`</td>
    <td>**array[string]**</td>
    <td>This is an array of strings that will help hint at the matching of the column. For example you may include `nom` as a hint for a `name` column.</td>
    <td>No</td>
  </tr>
  <tr>
    <td>`validator`</td>
    <td>**object|string|regex**</td>
    <td>A single validator</td>
    <td>No</td>
  </tr>
  <tr>
    <td>`validators`</td>
    <td>**[object|string|regex]**</td>
    <td>This is an array of validators</td>
    <td>No</td>
  </tr>
</table>

### Hints
Hints are a powerful way to increase the accuracy of the automatic column matching. While Flatfile learns from experience, hints will increase the match confidence and allow you to provide a more accurate match to your customers.

### Validators
Each field can have one or more validators associated with it. Each validator must be an object with the following minimal format: `{validate: "validator_name"}`. Additional settings an options for certain validators are detailed below.
```js
validators: [
  {
    validate: 'regex_matches',
    regex: /^[\w ]+$/,
    error: 'Must only contain alphanumeric characters or spaces'
  },
  {
    validate: 'required'
  },
  {
    validate: 'required_without',
    fields: ['id', 'surname']
  }
]
```

All validator objects support the following parameters.

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>`validate`</td>
    <td>`error`</td>
  </tr>
  <tr>
    <td>*required* The value you provide here must be the name of one of the following validators.</td>
    <td>The message to display in the tooltip if this validation fails. Default: `Field failed validation`</td>
  </tr>
</table>

### `regex_matches`
The field under validation must match the given regular expression.

<table>
  <tr>
    <th>Custom Option</th>
    <th>Example</th>
    <th>Information</th>
  </tr>
  <tr>
    <td>`regex`</td>
    <td>/^[0-9]+$/</td>
    <td>A valid regular expression to compare the field against.</td>
  </tr>
</table>

### `regex_excludes`
The field under validation must *not* match the given regular expression.

(see `regex` option above)

### `required`
The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the following conditions are true:

- The value is not provided.
- The value is an empty string.
- The value is an uploaded file with no path.

### `required_with`
The field under validation must be present and not empty only if any of the other specified fields are present.

<table>
  <tr>
    <th>Custom Option</th>
    <th>Example</th>
    <th>Information</th>
  </tr>
  <tr>
    <td>`fields`</td>
    <td>["field_key"]</td>
    <td>An array of valid field keys from the configuration object.</td>
  </tr>
</table>


### `required_with_all`
The field under validation must be present and not empty only if all of the other specified fields are present.

(see `fields` option above)

### `required_without`
The field under validation must be present and not empty only when any of the other specified fields are not present.

(see `fields` option above)

### `required_without_all`
The field under validation must be present and not empty only when all of the other specified fields are not present.

(see `fields` option above)

> We're working on building out more robust validation tools that will also clean and format data for you. In the meantime, you can research and provide your own regexes for any validation you need.

### Email
We use this awesome regex from http://emailregex.com/ for testing email validity.
```js
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```
