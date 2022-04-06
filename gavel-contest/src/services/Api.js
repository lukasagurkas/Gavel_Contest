import axios from 'axios'

export default () => {
    return axios.create({
        baseURL: `/contest/api/`
        //baseURL: `http://localhost:7081/` TODO
    })
}