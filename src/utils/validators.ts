import { Response } from 'express';

export const validateRequiredFields = (
    res: Response,
    fields: { [key: string]: any },
    fieldNames: string[]
): boolean => {
    for (const fieldName of fieldNames) {
        if (!fields[fieldName]) {
            res.status(400).json({
                message: `${fieldName} is required`,
                field: fieldName
            });
            return false;
        }
    }
    return true;
};

export const validateNumber = (
    res: Response,
    value: any,
    fieldName: string
): boolean => {
    if (!value || typeof value !== 'number') {
        res.status(400).json({
            message: `Invalid ${fieldName}`,
            field: fieldName
        });
        return false;
    }
    return true;
}; 