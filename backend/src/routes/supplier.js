import express from "express";
import supplierController from "../controllers/supplierController.js";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

// Rutas para los proveedores
router.route("/")
    .get(supplierController.getAll) // Obtener todos los proveedores
    .post(upload.single("image"), supplierController.create); // Crear un nuevo proveedor con imagen

router.route("/:id")
    .delete(supplierController.delete) // Eliminar un proveedor por ID
    .put(upload.single("image"), supplierController.update); // Actualizar un proveedor por ID
export default router;