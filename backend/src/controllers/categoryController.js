import categoryModel from "../models/category.js";
import productModel from "../models/product.js";

const categoryController = {};

// GET /api/categories - lista todas las categorías con el conteo de productos que las usan
categoryController.getAll = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ name: 1 });

        // conteo de productos por categoría (product_type)
        const counts = await productModel.aggregate([
            { $group: { _id: "$product_type", total: { $sum: 1 } } }
        ]);
        const countMap = {};
        counts.forEach(c => { countMap[c._id] = c.total; });

        const result = categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            subcategories: cat.subcategories,
            productCount: countMap[cat.name] || 0,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt
        }));

        res.status(200).json(result);
    } catch (error) {
        console.log("Error al obtener categorías:", error);
        res.status(500).json({ message: "Error al obtener las categorías" });
    }
};

// GET /api/categories/:id
categoryController.getById = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
        res.status(200).json(category);
    } catch (error) {
        console.log("Error al obtener categoría:", error);
        res.status(500).json({ message: "Error al obtener la categoría" });
    }
};

// POST /api/categories
categoryController.create = async (req, res) => {
    try {
        const { name, subcategories } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
        }

        const existing = await categoryModel.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
        }

        const newCategory = new categoryModel({
            name: name.trim(),
            subcategories: Array.isArray(subcategories) ? subcategories.filter(Boolean) : []
        });

        await newCategory.save();
        res.status(201).json({ message: "Categoría creada exitosamente", category: newCategory });
    } catch (error) {
        console.log("Error al crear categoría:", error);
        res.status(500).json({ message: "Error al crear la categoría" });
    }
};

// PUT /api/categories/:id - también actualiza en cascada los productos que usan el nombre anterior
categoryController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subcategories } = req.body;

        const category = await categoryModel.findById(id);
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

        const oldName = category.name;

        if (name && name.trim() && name.trim() !== oldName) {
            const existing = await categoryModel.findOne({ name: name.trim(), _id: { $ne: id } });
            if (existing) {
                return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
            }
            category.name = name.trim();
            // Renombrar en cascada los productos que usaban el nombre anterior
            await productModel.updateMany({ product_type: oldName }, { $set: { product_type: category.name } });
        }

        if (Array.isArray(subcategories)) {
            category.subcategories = subcategories.filter(Boolean);
        }

        await category.save();
        res.status(200).json({ message: "Categoría actualizada", category });
    } catch (error) {
        console.log("Error al actualizar categoría:", error);
        res.status(500).json({ message: "Error al actualizar la categoría" });
    }
};

// DELETE /api/categories/:id - no se permite eliminar si hay productos usándola
categoryController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

        const productsUsingIt = await productModel.countDocuments({ product_type: category.name });
        if (productsUsingIt > 0) {
            return res.status(400).json({
                message: `No se puede eliminar: ${productsUsingIt} producto(s) usan esta categoría`
            });
        }

        await categoryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
        console.log("Error al eliminar categoría:", error);
        res.status(500).json({ message: "Error al eliminar la categoría" });
    }
};

export default categoryController;
