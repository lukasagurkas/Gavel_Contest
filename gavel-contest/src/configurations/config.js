let VERIFY_EMAIL_PATH // used in ../components/Auth.vue
let UPLOAD_FILE_PATH // used in ../components/AuthSuccess.vue
let VISUALIZE_GAME_PATH // used in ../components/AuthSuccess.vue
let ROUTER_BASE_PATH // used in ../router.js
let API_BASE_PATH // used in ../services/Api.js
let VISUALIZER_BASE_PATH // used in ../services/ApiVisualizer.js'
let PUBLIC_PATH // used in ../../vue.config.js

if (process.env.NODE_ENV=="production") {
    VERIFY_EMAIL_PATH = "/contest/verifyEmail"
    UPLOAD_FILE_PATH = "/contest/api/uploadFile"
    VISUALIZE_GAME_PATH = "/contest/visualizer/?game="
    ROUTER_BASE_PATH = '/contest/'
    API_BASE_PATH = '/contest/api/'
    VISUALIZER_BASE_PATH = '/contest/visualizer/'
    PUBLIC_PATH = '/contest/'
} else if (process.env.NODE_ENV=="development") {
    VERIFY_EMAIL_PATH = "/verifyEmail"
    UPLOAD_FILE_PATH = "http://localhost:7081/uploadFile"
    VISUALIZE_GAME_PATH = "http://localhost:8000/?game="
    ROUTER_BASE_PATH = ''
    API_BASE_PATH = 'http://localhost:7081/'
    VISUALIZER_BASE_PATH = 'http://localhost:8000/'
    PUBLIC_PATH = ''
}

module.exports = {
    verify_email_path: VERIFY_EMAIL_PATH,
    upload_file_path: UPLOAD_FILE_PATH,
    visualize_game_path: VISUALIZE_GAME_PATH,
    router_base_path: ROUTER_BASE_PATH,
    api_base_path: API_BASE_PATH,
    visualizer_base_path: VISUALIZER_BASE_PATH,
    public_path: PUBLIC_PATH
}