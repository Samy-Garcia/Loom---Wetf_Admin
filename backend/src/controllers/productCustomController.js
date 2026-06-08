import productCustom from "../models/productCustom.js";

const productCustomController = {};

//SELECT

productCustomController.getProductsCustom = async (req, res) => {
    try {
        const productsCustom = await productCustom.find();
        res.status(200).json(productsCustom);
    } catch (error) {
        console.log("Error al obtener los productos personalizados:", error);
        res.status(500).json({ message: "Error al obtener los productos personalizados" });
    }
};

//INSERT

productCustomController.createProductCustom = async (req, res) => {
    try {
        const { name, product_type, sub_type, color, price, stock } = req.body;
        const images = req.files.map(file => ({
            image: file.path,
            public_id: file.filename
        }));
        const newProductCustom = new productCustom({
            name,
            images,
            product_type,
            sub_type,
            color,
            price,
            stock
        });
        await newProductCustom.save();
        res.status(201).json({
            message: "Producto personalizado creado exitosamente",
            productCustom: newProductCustom
        });
    } catch (error) {
        console.log("Error al crear el producto personalizado:", error);
        res.status(500).json({ message: "Error al crear el producto personalizado" });
    }
};

//DELETE
productCustomController.deleteProductCustom = async (req, res) => {
    try {
        const { id } = req.params;
        const productDeleted = await productCustom.findByIdAndDelete(id);
        if (!productDeleted) {
            return res.status(404).json({ message: "Producto personalizado no encontrado" });
        }

        // Eliminar la imagen de Cloudinary
        if (productDeleted.images && productDeleted.images.length > 0) {
            for (const image of productDeleted.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }

        } else {
            console.log("No se encontraron imágenes para eliminar en Cloudinary.");
        }
        res.status(200).json({ message: "Producto personalizado eliminado exitosamente" });
    } catch (error) {
        console.log("Error al eliminar el producto personalizado:", error);
        res.status(500).json({ message: "Error al eliminar el producto personalizado" });
    }
};

//UPDATE
productCustomController.updateProductCustom = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, product_type, sub_type, color, price, stock } = req.body;
        const images = req.files.map(file => ({
            image: file.path,
            public_id: file.filename
        }));
        const productUpdated = await productCustom.findByIdAndUpdate(id, {
            name,
            images,
            product_type,
            sub_type,
            color,
            price,
            stock
        }, { new: true });
        if (!productUpdated) {
            return res.status(404).json({ message: "Producto personalizado no encontrado" });
        }
        res.status(200).json({
            message: "Producto personalizado actualizado exitosamente",
            productCustom: productUpdated
        });
    } catch (error) {
        console.log("Error al actualizar el producto personalizado:", error);
        res.status(500).json({ message: "Error al actualizar el producto personalizado" });
    }
};

export default productCustomController;