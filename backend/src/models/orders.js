import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pendiente", "en_ruta", "entregado", "cancelado"],
    default: "pendiente"
  },
}, { timestamps: true }) // createdAt y updatedAt automáticos

export default mongoose.model("Order", orderSchema);