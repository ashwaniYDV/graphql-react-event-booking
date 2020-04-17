const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        _id: ID
        email: String!
        password: String
        name: String!
        createdEvents: [Event!]
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        user: User!
    }

    type Event {
        _id: ID
        title: String!
        description: String!
        price: Float!
        date: String!
        createdBy: User!
        createdAt: String!
        updatedAt: String!
    }

    type Booking {
        _id: ID
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    input UserInput {
        email: String!
        password: String!
        name: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event
    }

    schema {
        query: RootQuery 
        mutation: RootMutation
    }
`)