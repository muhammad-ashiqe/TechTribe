import express from 'express'
import { healthCheck } from '../controllers/helthCheckController.js'

export const healthCheckRouter = express.Router()


healthCheckRouter.get('/health',healthCheck)