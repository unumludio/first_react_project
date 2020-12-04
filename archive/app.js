const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/processes', require('./routes/processes.routes'))
app.use('/api/roles', require('./routes/roles.routes'))




const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('baseLink'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => { console.log(`App has been started on port ${PORT}...`) })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

