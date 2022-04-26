import axios from 'axios'

export default () => {
    return axios.create({
        //baseURL: `/contest/visualizer/`
        baseURL: `http://localhost:8000/` //TODO
    })
}