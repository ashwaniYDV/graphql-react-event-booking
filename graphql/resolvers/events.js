const Event = require('../../models/event')
const User = require('../../models/user')


module.exports = {
    events: async () => {
        try {
            let events = await Event.find({})
            events = events.map(event => {
                return { ...event._doc }
            })
            return events
        } catch(err) {
            throw err
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!')
        }
        const { userId } = req
        const { eventInput: { title, description, price, date }} = args

        try {
            let user = await User.findById(userId)
            if (!user) {
                throw new Error('User not found!')
            }
            
            let event = new Event({
                title,
                description,
                price: +price,
                date,
                createdBy: userId
            })
            event = await event.save()

            user.createdEvents.push(event)
            await user.save()

            return { ...event._doc }
        } catch(err) {
            throw err
        }
    },
}