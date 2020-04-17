const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'event',
            autopopulate: true
        }
    ]
}, {
    timestamps: true
})

userSchema.plugin(autopopulate)

module.exports = mongoose.model('user', userSchema)