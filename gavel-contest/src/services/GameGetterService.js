import Api from '@/services/Api'

export default {
    getAll () {
        return Api().get('getAllGames')
    },

    getCipher (name) {
        return Api().post('getCipher', name)
    }
}