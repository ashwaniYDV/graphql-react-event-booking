const express = require('express')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const path = require('path')

const { DB_URI } = require('./configs/config')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middlewares/is-auth')

const app = express()
let server = require('http').Server(app)

// Connecting to database
mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Mongodb connected.'))
    .catch((err) => console.log(err))
mongoose.Promise = global.Promise

// body-parser middleware
app.use(express.json())

// cors handler middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
})

// auth middleware hits before grapgql api
app.use(isAuth)

// graphql server middleware
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 4500
server.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
})