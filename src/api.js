import axios from 'axios'
const baseUrl = 'https://condor-backend-django.herokuapp.com'
export default {
  async get_option_data (ticker) {
    var endpoint = baseUrl + '/api/v1/get_option_data/' + ticker + '/'
    console.log(endpoint)
    console.log(ticker)
    console.log('inside get_option data!')
    console.log(endpoint)
    var response = await axios.get(endpoint)
    console.log(response)
    console.log(response.data)
    return response.data
  },
  async get_condors (ticker, expiration) {
    var endpoint = baseUrl + '/api/v1/condors/'
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    console.log(response)
    return response.data
  }
}
