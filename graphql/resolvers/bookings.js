const Event = require('../../models/event')
const Booking = require('../../models/booking')


module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!')
        }
        const { userId } = req
        try {
            let bookings = await Booking.find({user: userId})
            bookings = bookings.map(booking => {
                return { ...booking._doc }
            })
            return bookings
        } catch(err) {
            throw err
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!')
        }
        const { userId } = req

        const { eventId } = args
        try {
            const check = await Booking.findOne({user: userId, event: eventId})
            if (check) {
                throw new Error('Event already booked!')
            }
            const event = await Event.findOne({_id: eventId})
            let booking = new Booking({
                event,
                user: userId
            })
            booking = await booking.save()
            return { ...booking._doc }
        } catch(err) {
            throw err
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!')
        }
        const { userId } = req
        const { bookingId } = args
        try {
            const booking = await Booking.findById(bookingId)
            if (!booking) {
                throw new Error('No booking found!')
            }
            if (booking.user.id !== userId) {
                throw new Error('Unauthorized request!')
            }
            const event = { ...booking.event._doc }
            await Booking.deleteOne({_id: bookingId})
            return event
        } catch(err) {
            throw err
        }
    },
}