const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const Bree = require('bree')
const connectDB = require('./config/db')

//Load config
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()
app.use(cors())

//Bodyparser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Logging
app.use(morgan('dev'))

//Routes
app.use('/api/programs', require('./routes/assitPrograms'))

//Jobs
const bree = new Bree({
    jobs: [
        {
            name: 'scraper',
            interval: 'every 5 minute',
        },
    ],
})

bree.start()

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server run on port ${process.env.PORT}`))
