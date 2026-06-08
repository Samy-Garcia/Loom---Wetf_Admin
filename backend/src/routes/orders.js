import { Router } from "express"
import orderController from "../controllers/ordersController.js"

const router = Router()

router.get("/stats", orderController.getStats)
router.get("/sales", orderController.getSalesChart)
router.get("/revenue", orderController.getRevenueChart)
router.get("/", orderController.getAll)
router.post("/", orderController.create)
router.get("/:id", orderController.getById)
router.put("/:id", orderController.updateStatus)
router.delete("/:id", orderController.delete)

export default router