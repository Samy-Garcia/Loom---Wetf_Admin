import orderModel from "../models/orders.js"
import Product from "../models/product.js"

const orderController = {}

// GET /api/orders
orderController.getAll = async (req, res) => {
  try {
    const { limit } = req.query
    let query = orderModel.find()
      .populate("client", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })

    if (limit) query = query.limit(Number(limit))

    const orders = await query
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos" })
  }
}

// GET /api/orders/:id
orderController.getById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
      .populate("client", "name email")
      .populate("items.product", "name images price")
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" })
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedido" })
  }
}

// POST /api/orders
orderController.create = async (req, res) => {
  try {
    const { client, items } = req.body
    // Calcular total desde los productos reales
    let total = 0
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) return res.status(404).json({ message: `Producto ${item.product} no encontrado` })
      total += product.price * item.quantity
    }

    const newOrder = new orderModel({ client, items, total })
    await newOrder.save()
    res.status(201).json({ message: "Pedido creado", order: newOrder })
  } catch (error) {
    res.status(500).json({ message: "Error al crear pedido", error: error.message })
  }
}

// PUT /api/orders/:id — actualizar status
orderController.updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" })
    res.status(200).json({ message: "Estado actualizado", order })
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar pedido" })
  }
}

// DELETE /api/orders/:id
orderController.delete = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" })
    res.status(200).json({ message: "Pedido eliminado" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar pedido" })
  }
}

// GET /api/orders/stats — para el dashboard Analisis
orderController.getStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [ventasHoy, ventasMes, pedidosEnRuta, totalMesAnterior] = await Promise.all([
      // Suma de totales de hoy
      orderModel.aggregate([
        { $match: { createdAt: { $gte: startOfDay }, status: { $ne: "cancelado" } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      // Suma de totales del mes
      orderModel.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: "cancelado" } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      // Pedidos en ruta
      orderModel.countDocuments({ status: "en_ruta" }),
      // Mes anterior para calcular crecimiento
      orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
              $lt: startOfMonth
            },
            status: { $ne: "cancelado" }
          }
        },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ])
    ])

    const mesActual = ventasMes[0]?.total || 0
    const mesAnterior = totalMesAnterior[0]?.total || 0
    const crecimiento = mesAnterior > 0
      ? Math.round(((mesActual - mesAnterior) / mesAnterior) * 100)
      : 0

    res.status(200).json({
      ventasHoy: ventasHoy[0]?.total || 0,
      ventasMes: mesActual,
      pedidosEnRuta,
      crecimientoMes: crecimiento
    })
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas" })
  }
}

// GET /api/orders/sales?period=day|week|month — datos para gráfica de ventas
orderController.getSalesChart = async (req, res) => {
  try {
    const { period = "month" } = req.query
    const now = new Date()

    let startDate
    if (period === "day") startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    else if (period === "week") startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
    else startDate = new Date(now.getFullYear(), now.getMonth(), 1)

    const data = await orderModel.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelado" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          valor: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, fecha: "$_id", valor: 1 } }
    ])

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas" })
  }
}

// GET /api/orders/revenue?period=day|week|month — datos para gráfica de ingresos
orderController.getRevenueChart = async (req, res) => {
  try {
    const { period = "month" } = req.query
    const now = new Date()

    let startDate
    if (period === "day") startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    else if (period === "week") startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
    else startDate = new Date(now.getFullYear(), now.getMonth(), 1)

    const data = await orderModel.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelado" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          ingresos: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, fecha: "$_id", ingresos: 1 } }
    ])

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ingresos" })
  }
}

export default orderController