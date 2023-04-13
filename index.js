import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'

import routes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api/v1', routes)

// Connecting to Database
const port = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Connected to MongoDB successfully & Server is running on port ${port}`)
        })
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
