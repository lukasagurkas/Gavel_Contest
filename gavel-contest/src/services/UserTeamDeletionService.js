import Api from '@/services/Api'

export default {
    delete(email) {
        return Api().post('deleteUserTeam', email)
    }
}