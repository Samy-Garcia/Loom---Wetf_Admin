import product from "../models/product.js";

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { name, product_type, sub_type, color, price, stock } = req.body;

        const images = req.files.map(file => ({
            image: file.path,
            public_id: file.filename
        }));

        const newProduct = new product({
            name,
            images,
            product_type,
            sub_type,
            color,
            price,
            stock
        });

        await newProduct.save();

        res.status(201).json({
            message: "Producto creado exitosamente",
            product: newProduct
        });

    } catch (error) {
        console.log("Error al crear el producto:", error);
        res.status(500).json({
            message: "Error al crear el producto"
        });
    }
};

productController.getProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

productController.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const productFound = await product.findById(id);
        if (!productFound) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(productFound);
    }
        catch (error) {
        console.log("Error al obtener el producto:", error);
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productDeleted = await product.findByIdAndDelete(id);
        if (!productDeleted) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

         // Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(productDeleted.images[0].public_id);

        res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.log("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};

//actualizar producto
productController.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, product_type, sub_type, color, price, stock } = req.body;

        const productFound = await product.findById(id);

        if (!productFound) {
            return res.status(404).json({ message: "Producto not found" });
        }

        const updateData = {
            name,
            product_type,
            sub_type,
            color,
            price,
            stock
        };

        const updatedProduct = await product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.log("Error al actualizar el producto:", error);
        res.status(500).json({
            message: "Error al actualizar el producto"
        });
    }
};

export default productController;