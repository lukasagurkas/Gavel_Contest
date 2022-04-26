import axios from 'axios'
const config = require('../configurations/config.js')

export default () => {
    return axios.create({
        baseURL: config.visualizer_base_path
    })
}