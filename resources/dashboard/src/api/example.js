import Authentication from 'logic/authentication'

export default class ExampleAPI {
  static async posts(id) {
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`

    const response = await fetch(url)

    if (response.status === 401 || id === 3) { // force post #3 to pretend our access token has expired
      Authentication.invalidateAccessToken()
      throw new Error('Access token expired')
    }

    if (response.status !== 200) {
      throw new Error('Error loading post')
    }

    return await response.json()
  }
}
