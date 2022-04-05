module.exports = {
    port: process.env.PORT || 7081,
    db: {
        database: process.env.DB_NAME || 'contests',
        user: process.env.DB_USER || 'contests',
        password: process.env.DB_PASS || 'contests',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: './contests.sqlite'
        }
    }
}
