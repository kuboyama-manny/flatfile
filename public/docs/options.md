# Options Overview
Overview of the options configuration

---

The following is a list of options that can be passed to `FlatfileImporter` when instantiating a new instance.


<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
    <th>Docs</th>
  </tr>
  <tr>
    <td>`type`</td>
    <td>Type of record that is being imported. eg. "User", "Transaction"</td>
    <td>[Go &rarr;](#type)</td>
  </tr>
  <tr>
    <td>`fuzziness`</td>
    <td>Level of fuzziness to use when matching. We recommend leaving this alone.</td>
    <td>[Go &rarr;](#fuzziness)</td>
  </tr>
  <tr>
    <td>`allowCustom`</td>
    <td>Whether or not to allow importing extra fields that you have not specified in your target field map.</td>
    <td>[Go &rarr;](#allowcustom)</td>
  </tr>
  <tr>
    <td>`allowInvalidSubmit`</td>
    <td>Whether or not to allow submitting data that still has invalid cells in it.</td>
    <td>[Go &rarr;](#allowinvalidsubmit)</td>
  </tr>
  <tr>
    <td>`fields`</td>
    <td>Configure the fields to map the uploaded data to. Easily setup validation, format hinting and more.</td>
    <td>[Go &rarr;](https://developers.flatfile.io/docs/field-config)</td>
  </tr>
</table>


```js
{
  type: 'Robot',
  fuzziness: 0.2,
  allowCustom: true,
  fields: [{...}]
}
```

### type
The `type` property sets the name for the type of units your data refers to. It will be automatically pluralized as needed in Flatfile's user interface.
- **Required?** `no`
- **Default:** `Record`

### fuzziness
The `fuzziness` property defines the strictness of the matching algorithm. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
- **Required?** `no`
- **Default:** `0.4`

### allowCustom
In some use-cases you might want to be able to add new columns on the fly when matching. If `allowCustom` is set to true Flatfile will accommodate this. New columns will then be able to be input during the Column Match stage.
New columns created this way will be made available in the `_custom` key of the response object. For example:

```json
{
  name: "John Doe",
  email: "john.doe@example.com",
  _custom: {
    "Favorite Color": "Fuschia"
  }
}
```

- **Required?** `no`
- **Default:** `false`

### allowInvalidSubmit
Sometimes you want to allow submission of data that still has not passed your validation checks. If `allowInvalidSubmit` is set to `true` Flatfile will allow this.
- **Required?** `no`
- **Default:** `false`
