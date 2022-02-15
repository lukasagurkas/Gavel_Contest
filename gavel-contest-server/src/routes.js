module.exports = (app) => {
    app.post('/register', (req, res) => {
        res.send({
            message: `The user ${req.body.name} with email ${req.body.email} registered!`
        })
    })
}
