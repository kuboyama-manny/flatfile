# JavaScript API Docs

## Create and Get Models

```javascript
import DataModel from 'api/data-model'

const myModel = await DataModel.create({
  "name": "Test Model",
  "type": "Test",
  "team_id": 2 // update this to the appropriate team id
})

console.log(myModel)

/*
{
  "id": "3ed1a000-f4c7-11e7-9cc3-adb8a61ba381",
  "name": "Test Model",
  "description": "",
  "type": "Test",
  "type_plural": null,
  "fuzziness": null,
  "allow_custom": false,
  "team_id": 2,
  "auto_generated": false,
  "created_at": "2018-01-08 22:57:04",
  "updated_at": "2018-01-08 22:57:04",
  "deleted_at": null
}
*/

const myModelReloaded = await DataModel.get(myModel.id)

console.log(myModelReloaded) // same output as above
```

## Update and Delete Models

```javascript
const myModelUpdated = await DataModel.update({ ...myModel, description: 'Hello World' })

console.log(myModelUpdated)

/*
{
 "id": "3ed1a000-f4c7-11e7-9cc3-adb8a61ba381",
 "name": "Test Model",
 "description": "Hello World",
 "type": "Test",
 "type_plural": null,
 "fuzziness": null,
 "allow_custom": false,
 "team_id": 2,
 "auto_generated": false,
 "created_at": "2018-01-08 22:57:04",
 "updated_at": "2018-01-08 23:13:21",
 "deleted_at": null
}
*/

const wasDeleted = await DataModel.delete(myModel.id)

console.log(wasDeleted)

/*
true
*/
```

## List Models with ResultSet

```javascript
const resultSet = await DataModel.list({ ... query params here ... })

console.log(resultSet.records)

/*
[
  {
    "id": "3ed1a000-f4c7-11e7-9cc3-adb8a61ba381",
    "name": "Test Model",
    "description": "Hello World",
    "type": "Test",
    "type_plural": null,
    "fuzziness": null,
    "allow_custom": false,
    "team_id": 2,
    "auto_generated": false,
    "created_at": "2018-01-08 22:57:04",
    "updated_at": "2018-01-08 23:13:21",
    "deleted_at": null
  },
  ...
]
*/

console.log(resultSet.currentPage)    // 1
console.log(resultSet.lastPage)       // 2
console.log(resultSet.pageSize)       // 20
console.log(resultSet.totalCount)     // 25
console.log(resultSet.range)          // [1, 20]

console.log(resultSet.hasNextPage)    // true
console.log(await resultSet.nextPage) // ResultSet[21, 25]

console.log(resultSet.hasPrevPage)    // false
console.log(await resultSet.prevPage) // Error: Out of bounds

console.log(resultSet.hasPage(2))     // true
console.log(await resultSet.page(2))  // ResultSet[21, 25]

console.log(resultSet.hasPage(3))     // false
console.log(await resultSet.page(3))  // Error: Out of bounds
```
