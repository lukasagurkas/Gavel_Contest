import Api from '@/services/Api'

export default {
    uploadGame (info) {
        return Api().post('uploadGame', info)
    }
}