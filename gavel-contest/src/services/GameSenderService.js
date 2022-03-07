import Api from '@/services/ApiVisualizer'

export default {
    sendGame (json) {
        return Api().post('sendGame', json)
    }
}