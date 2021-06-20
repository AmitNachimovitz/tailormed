const mongoose = require('mongoose')

const AssistanceProgramSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    eligible_treatments: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        required: true,
    },
    grant_amount: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Program', AssistanceProgramSchema)
