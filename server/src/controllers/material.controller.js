const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { materialService } = require("../services");
const ApiError = require("../utils/ApiError");

// Create a new Material
const createMaterial = catchAsync(async (req, res) => {
    const { name, unit, totalQuantity, pricePerUnit } = req.body;
    const existingMaterial = await materialService.findMaterialByName(name);
    const dateImport = new Date();
    const importEntry = {
        dateImport,
        quantity: totalQuantity,
        price: pricePerUnit,
    };

    if (existingMaterial) {
        if (existingMaterial.unit !== unit) {
            return res.status(400).json({
                message: `Material "${name}" already exists with the unit "${existingMaterial.unit}". Please choose the unit "${existingMaterial.unit}" to import.`,
                existingMaterialUnit: existingMaterial.unit
            });
        }
            return updateExistingMaterial(existingMaterial, totalQuantity, importEntry, res);
    } else {
        return createNewMaterial(name, unit, totalQuantity, pricePerUnit, importEntry, res);
    }
});

const createNewMaterial = async (name, unit, totalQuantity, pricePerUnit, importEntry, res) => {
    const material = await materialService.createMaterial({
        name,
        unit,
        totalQuantity,
        pricePerUnit,
        status: 'Active',
        importHistory: [importEntry],  // Initialize importHistory with the first entry
    });
    return res.status(201).json(material);
};

const updateExistingMaterial = async (existingMaterial, totalQuantity, importEntry, res) => {
    const newTotalQuantity = Number(existingMaterial.totalQuantity) + Number(totalQuantity);
    
    const updatedMaterial = await materialService.updateNewQuantity(existingMaterial._id, {
        totalQuantity: newTotalQuantity,
        $push: { importHistory: importEntry },  // Push the new import entry into the importHistory array
    });
    return res.status(200).json(updatedMaterial);
};


// Get all Materials
const getAllMaterials = catchAsync(async (req, res) => {
    const materials = await materialService.getActiveMaterials();
    res.status(200).json(materials);
});

// Get Material by ID
const getMaterialById = catchAsync(async (req, res) => {
    const materialId = req.params.id;
    const material = await materialService.getMaterialById(materialId);
    res.status(200).json(material);
});

// Update Material by ID
const updateMaterial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedMaterial = await materialService.updateMaterial(id, req.body);
    res.status(200).json(updatedMaterial);
});

// Delete Material by ID
const deleteMaterial = catchAsync(async (req, res) => {
    const { id } = req.params;

    // Update the status of the material to 'Delete'
    const updatedMaterial = await materialService.deleteMaterial(id, { status: 'Delete' });

    if (!updatedMaterial) {
        return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json({ message: 'Material status updated to Delete successfully' });
});


// Add Import History
const addImportHistory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { quantity, price } = req.body;
    const dateImport = new Date();

    const material = await materialService.addImportHistoryToMaterial(id, { dateImport, quantity, price });
    res.status(200).json(material);
});

// Add Export History
const exportMaterial = catchAsync(async (req, res) => {
    const { materialId, quantity, dateExport } = req.body;

    // Find the material by ID
    const material = await materialService.getMaterialById(materialId);
    if (!material) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Material not found');
    }

    // Check if there is enough quantity to export
    if (material.totalQuantity < quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough quantity to export');
    }

    // Update the material's total quantity
    material.totalQuantity -= quantity;

    // Add to export history
    const exportData = {
        dateExport: new Date(dateExport),
        quantity,
        price: material.pricePerUnit * quantity // Example price calculation
    };
    await materialService.addExportHistoryToMaterial(materialId, exportData);

    // Save updated material
    await materialService.updateMaterial(materialId, { totalQuantity: material.totalQuantity });

    res.status(200).json({
        message: 'Material exported successfully',
        material
    });
});

module.exports = {
    createMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    addImportHistory,
    exportMaterial
};
