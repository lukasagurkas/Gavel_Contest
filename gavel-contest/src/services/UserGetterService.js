import Api from '@/services/Api'

export default {
    getUser (email) {
        return Api().post('getUser', email)
    },
    getUserIsRegistered (email) {
        return Api().post('getUserIsRegistered', email)
    }
}