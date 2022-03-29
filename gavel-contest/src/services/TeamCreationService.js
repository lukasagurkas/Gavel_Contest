import Api from '@/services/Api'

export default {
    create (info) {
        return Api().post('createTeam', info)
    },

    join (info) {
        return Api().post('joinTeam', info)
    },

    delete () {
        return Api().delete('deleteUserTeams')
    }
}