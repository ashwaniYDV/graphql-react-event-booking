const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'event',
        autopopulate: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
    }
},{
    timestamps: true
})

bookingSchema.plugin(autopopulate)

module.exports = mongoose.model('booking', bookingSchema)