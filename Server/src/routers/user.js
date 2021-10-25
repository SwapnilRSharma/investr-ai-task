const express = require('express')
const router = new express.Router()

router.post('/login', async(req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
            message: e.message
        })
    }
})

router.post('/register', async(req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(5).max(1024).required(),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        const isExist = await User.findOne({ email: req.body.email })
        if(isExist) return res.status(401).send({message: "Email id already used."})

        const user = new User({name: req.body.name, email: req.body.email, password: req.body.password})
        await user.save()
        const token = user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
            message: e.message
        })
    }
})

module.exports = router