import express from "express"
import TicketController from "../controllers/TicketController.js"
import Auth from  "../common/auth.js"
const router = express.Router()

//user route
router.post('/create',Auth.validate,TicketController.createTicket)
router.get('/user',Auth.validate, TicketController.getTicketsByUserId)
router.put('/edit/:id',Auth.validate, TicketController.editTicket)
router.get('/:id',Auth.validate, TicketController.getTicketById)

//admin route
router.put('/status/:id/:status',Auth.validate,Auth.adminGaurd, TicketController.updateTicketStatus)
router.get('/',Auth.validate,Auth.adminGaurd, TicketController.getAllTickets)
router.get('/ptickets', Auth.validate, Auth.adminGaurd, TicketController.getAllPendingTickets);




export default router