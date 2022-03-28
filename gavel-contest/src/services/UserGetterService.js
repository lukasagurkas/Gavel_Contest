import Api from '@/services/Api'

export default {
    getUser () {
        return Api().get('getUser')
    },

    getUserIsRegistered (email) {
        return Api().post('getUserIsRegistered', email)
    }
}