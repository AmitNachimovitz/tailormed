const router = require('express').Router()
const Program = require('../models/AssistanceProgram')

//GET
//The endpoint returns list of assistance programs
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({})
        res.json({
            programs,
        })
    } catch (err) {
        console.error(err)
    }
})

module.exports = router
