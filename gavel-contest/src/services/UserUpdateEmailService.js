import Api from '@/services/Api'

export default {
    getUser () {
        return Api().post('updateUserEmail')
    }
}