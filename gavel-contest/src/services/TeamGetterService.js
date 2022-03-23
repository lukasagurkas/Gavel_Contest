import Api from '@/services/Api'

export default {
    getAll () {
        return Api().get('getAllTeams')
    },

    getUserTeam (email) {
        return Api().post('getUserTeam', email)
    },

    getPassword (email) {
        return Api().post('getPassword', email)
    },
    
    getUserInTeam (email) {
        return Api().post('getUserInTeam', email)
    }
}