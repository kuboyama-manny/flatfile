## Returned data
Learn how the returned data is structured when it is uploaded after Flatfile has worked its magic.

### Clean Data
After the user has finished mapping, fixing and reviewing their imported CSV data, they will click the complete button. This action sends the data to your application by resolving the `.load()` promise and triggering a `data` event.
The output is simply a key-value map. Each row of the CSV becomes a javascript object, and the keys you configured are used as keys for the output data.

### Getting the Data

#### Using the data event
```js
importer.on("data", function(data) {
  // do something
})
```
#### Using async/await
```js
const data = await importer.load()
```

### Example
This is an example output for the Robots config used in the other examples.

```js
[
  {
    name: "R32 Jingle Bells",
    shield-color: "red",
    sign: "KLLR",
    helmet-style: "octagonal",
    weapon: "phaser"
  },
  {
    name: "10 Paws",
    shield-color: "fuschia",
    sign: "MAXX",
    helmet-style: "hexagonal",
    weapon: "blaster"
  },
  ...
]
```

### Multi Value Support

>Not yet available in stable release

If you configure a field with `allowMultiple: true`, the value will always be returned as an array. This is helpful when a user wants to do something like map multiple phone number columns to your phone number field.
This also will automatically extract multiple values if more than one exists in a column.

```js
[
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: ["+1 234 567 8901", "+1 901 234 5678"]
  },
  ...
]
```
