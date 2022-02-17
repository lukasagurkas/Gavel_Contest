import Api from '@/services/Api'

export default {
    create (info) {
        return Api().post('createTeam', info)
    }
}