import plantsModel from "../models/supplier.js";
import { v2 as cloudinary } from "cloudinary";

const supplierController = {};

supplierController.getAll = async (req, res) => {
    try {
        const suppliers = await plantsModel.find();
        res.status(200).json(suppliers);
    } catch (error) {
        console.log("error getAll:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

supplierController.create = async (req, res) => {
    try {
        const { name, email, phone, address, company } = req.body;

        let imgPath = null;
        let publicId = null;

        if (req.file) {
            imgPath = req.file.path;
            publicId = req.file.filename;
        }

        const newSupplier = new plantsModel({
            name,
            email,
            phone,
            image: imgPath,
            address,
            company,
            isVerified: true,
            public_id: publicId,
        });

        await newSupplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
    } catch (error) {
        console.log("ERROR DETALLADO:", error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

supplierController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const suppliersToDelete = await plantsModel.findById(id);

        if (!suppliersToDelete) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        if (suppliersToDelete.public_id) {
            await cloudinary.uploader.destroy(suppliersToDelete.public_id);
        }
        await plantsModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.log("error delete:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

supplierController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, company } = req.body;
        const suppliersToUpdate = await plantsModel.findById(id);

        if (!suppliersToUpdate) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        let updatedData = { name, email, phone, address, company };

        if (req.file) {
            if (suppliersToUpdate.public_id) {
                await cloudinary.uploader.destroy(suppliersToUpdate.public_id);
            }
            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        await plantsModel.findByIdAndUpdate(id, updatedData, { new: true });
        return res.status(200).json({ message: "Supplier updated" });
    } catch (error) {
        console.log("error update:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default supplierController;