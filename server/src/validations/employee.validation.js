const Joi = require("joi");
const {password, objectId} = require("./custom.validation");

const createEmployeeSchema = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        username: Joi.string().required(),
        password: Joi.custom(password).required(),
        retypePassword: Joi.custom(password).required(),
        position: Joi.string().required(),
        salary: Joi.number().greater(0).required(),
        address: Joi.string().trim(),
        avatar: Joi.object().keys({
            url: Joi.string().required().allow(null, ''),
            imageKey: Joi.string().required().allow(null, ''),
        }),
        phoneNumber: Joi.string()
            .pattern(/^0[3-9]\d{8}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "Phone number must start with 0 and have 10 digits.",
            }),
    }),
};

const updateEmployeeSchema = {
    body: Joi.object().keys({
        name: Joi.string().trim(),
        password: Joi.custom(password),
        username: Joi.string().required(),
        retypePassword: Joi.custom(password),
        position: Joi.string().valid("Barista", "Waitstaff", "Cashier", "Shift Supervisor").messages({
            "any.only": "Position must be one of the following: Barista, Waitstaff, Cashier, Shift Supervisor.",
        }),
        avatar: Joi.object().keys({
            url: Joi.string().required().allow(null, ''),
            imageKey: Joi.string().required().allow(null, ''),
        }),
        salary: Joi.number().greater(0).messages({
            "number.greater": "Salary must be greater than 0.",
        }),
        address: Joi.string().trim(),
        phoneNumber: Joi.string()
            .pattern(/^0[3-9]\d{8}$/)
            .messages({
                "string.pattern.base":
                    "Phone number must start with 0 and have 10 digits.",
            }),
    }),
};

const deleteEmployeeSchema = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    deleteEmployeeSchema,
};
