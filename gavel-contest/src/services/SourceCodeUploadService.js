import Api from '@/services/Api'

export default {
    uploadFile (data) {
        return Api().post('uploadFile', data)
    }
}