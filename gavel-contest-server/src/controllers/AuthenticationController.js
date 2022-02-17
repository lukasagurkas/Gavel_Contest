const db = require('../models')

module.exports = {
    async register (req, res) {
        await db.user.findOne({where: {email:req.body.email}}).then(async function(user){
            if (user == null) {
                try {
                    const user = await db.user.create(req.body)
                    res.send(user.toJSON())
                } catch (err) {
                    res.status(400).send({
                        error: err
                    })
                    console.log("Error", err.message);
                }
            }
            
        }).catch(function(error){
            console.log(error)
        });
        
        
    }
}