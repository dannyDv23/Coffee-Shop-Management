const Material = require('../models/material');

// Create a new Material
const createMaterial = async (materialData) => {
    try {
        const material = new Material(materialData);
        await material.save();
        return material;
    } catch (error) {
        throw new Error('Error creating material: ' + error.message);
    }
};

const findMaterialByName = async (name) => {
    return await Material.findOne({ name: name });
};

const updateNewQuantity = async (id, updateData) => {
    return await Material.findByIdAndUpdate(id, updateData, { new: true }); // new: true returns the updated document
};
// Get Active Materials
const getActiveMaterials = async () => {
    try {
        const materials = await Material.find({status: 'Active'});
        return materials;
    } catch (error) {
        throw new Error('Error retrieving materials: ' + error.message);
    }
};

// Get Material by ID
const getMaterialById = async (materialId) => {
    try {
        const material = await Material.findById(materialId);
        if (!material) {
            throw new Error('Material not found');
        }
        return material;
    } catch (error) {
        throw new Error('Error retrieving material: ' + error.message);
    }
};

// Update Material by ID
const updateMaterial = async (materialId, updateData) => {
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(materialId, updateData, { new: true, runValidators: true });
        if (!updatedMaterial) {
            throw new Error('Material not found');
        }
        return updatedMaterial;
    } catch (error) {
        throw new Error('Error updating material: ' + error.message);
    }
};

// Delete Material by ID
const deleteMaterial = async (materialId, updateData) => {
    try {
        // Find the material by ID and update its status to 'Delete'
        const deletedMaterial = await Material.findByIdAndUpdate(
            materialId,
            { $set: updateData },  // Set the status to 'Delete'
            { new: true }  // Return the updated document
        );

        if (!deletedMaterial) {
            throw new Error('Material not found');
        }
        return deletedMaterial;
    } catch (error) {
        throw new Error('Error deleting material: ' + error.message);
    }
};


// Add Import History to Material
const addImportHistoryToMaterial = async (materialId, importData) => {
    try {
        const material = await Material.findById(materialId);
        if (!material) {
            throw new Error('Material not found');
        }
        
        // Add to import history
        material.importHistory.push(importData);
        material.totalQuantity += importData.quantity; // Update totalQuantity
        await material.save();
        return material;
    } catch (error) {
        throw new Error('Error adding import history: ' + error.message);
    }
};

// Add Export History to Material
const addExportHistoryToMaterial = async (materialId, exportData) => {
    try {
        const material = await Material.findById(materialId);
        if (!material) {
            throw new Error('Material not found');
        }

        // Ensure there is enough quantity for export
        if (material.totalQuantity < exportData.quantity) {
            throw new Error('Insufficient quantity for export');
        }

        // Add to export history
        material.exportHistory.push(exportData);
        material.totalQuantity -= exportData.quantity; // Update totalQuantity
        await material.save();
        return material;
    } catch (error) {
        throw new Error('Error adding export history: ' + error.message);
    }
};

module.exports = {
    createMaterial,
    getActiveMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    addImportHistoryToMaterial,
    addExportHistoryToMaterial,
    updateNewQuantity,
    findMaterialByName
};
