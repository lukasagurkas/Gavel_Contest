import Api from '@/services/Api'

export default {
    getGames () {
        return Api().get('getGamesList')
    }
}