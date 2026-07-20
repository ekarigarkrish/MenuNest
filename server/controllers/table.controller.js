import { ApiError, asyncHandler } from "../utils/helper.utils.js";
import tableModel from '../model/table.model.js'
import crypto from 'crypto';
import { deleteFile } from '../utils/removeFile.utils.js';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    createTableQRCode: asyncHandler(async (req, res) => {
        const { name } = req.body;

        const isExist = await tableModel.findOne({ where: { name }, raw: true })
        if (isExist) throw ApiError("Table already exists!", 400)

        const response = await tableModel.create({
            name: name,
            qrLogo: req.file?.filename ? req.file.path : null,
            tableToken: `tbl-${crypto.randomBytes(6).toString('hex')}`
        }, { raw: true })
        if (!response) throw ApiError('Table QR Code not created', 400)

        return res.status(200).json({ success: true, message: "Table QR Code created successfully", table: response })
    }, 'createTableQRCode'),

    bulkCreateTableQRCodes: asyncHandler(async (req, res) => {
        let { names } = req.body;
        
        if (typeof names === 'string') {
            try {
                names = JSON.parse(names);
            } catch(e) {
                names = [names];
            }
        }

        if (!Array.isArray(names) || names.length === 0) {
            throw ApiError("Please provide an array of table names", 400);
        }

        const existingTables = await tableModel.findAll({
            where: { name: names },
            raw: true
        });

        const existingNames = existingTables.map(t => t.name);
        const newNames = names.filter(name => !existingNames.includes(name));

        if (newNames.length === 0) {
            throw ApiError("All provided tables already exist", 400);
        }

        const tablesToCreate = newNames.map(name => ({
            name,
            qrLogo: req.file?.filename ? req.file.path : null,
            tableToken: `tbl-${crypto.randomBytes(6).toString('hex')}`
        }));

        const response = await tableModel.bulkCreate(tablesToCreate);
        if (!response) throw ApiError("Failed to create tables in bulk", 400);

        return res.status(200).json({ 
            success: true, 
            message: `${response.length} table(s) created successfully`, 
            skipped: existingNames,
            tables: response 
        });
    }, 'bulkCreateTableQRCodes'),


    getAllTablesData: asyncHandler(async (req, res) => {
        const response = await tableModel.findAll({ raw: true })
        return res.status(200).json({ success: true, message: "Table QR Code fetched successfully", data: response })
    }, 'getAllTablesData'),

    downloadTableQRCode: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const response = await tableModel.findByPk(id, { raw: true })
        if (!response) throw ApiError('Table QR Code not found', 404)

        res.download(imagePath)
    }, 'downloadTableQRCode'),

    deleteTable: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const table = await tableModel.findByPk(id, { raw: true });
        if (!table) throw ApiError('Table not found', 404);

        if (table.qrLogo) {
            await deleteFile(table.qrLogo);
        }

        await tableModel.destroy({ where: { id } });

        return res.status(200).json({ success: true, message: "Table deleted successfully" });
    }, 'deleteTable'),

    updateTable: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, removeLogo } = req.body;

        const table = await tableModel.findByPk(id, { raw: true });
        if (!table) throw ApiError('Table not found', 404);

        const updates = { name };

        if (req.file) {
            updates.qrLogo = req.file.path;
            if (table.qrLogo) {
                await deleteFile(table.qrLogo);
            }
        } else if (removeLogo === 'true' || removeLogo === true) {
            updates.qrLogo = null;
            if (table.qrLogo) {
                await deleteFile(table.qrLogo);
            }
        }

        await tableModel.update(updates, { where: { id } });
        const updatedTable = await tableModel.findByPk(id, { raw: true });

        return res.status(200).json({ success: true, message: "Table updated successfully", table: updatedTable });
    }, 'updateTable'),

    downloadQRCode: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const table = await tableModel.findByPk(id, { raw: true });
        if (!table) throw ApiError('Not Found!', 404);

        const url = `${req.headers.origin}/menu?tableToken=${table.tableToken}`;

        try {
            let qrBuffer = await QRCode.toBuffer(url, {
                type: 'png',
                margin: 2,
                width: 400,
                errorCorrectionLevel: 'H'
            });

            if (table.qrLogo) {
                try {
                    const logoPath = path.join(__dirname, '..', table.qrLogo);
                    if (fs.existsSync(logoPath)) {
                        const canvas = createCanvas(400, 400);
                        const ctx = canvas.getContext('2d');

                        const qrImage = await loadImage(qrBuffer);
                        ctx.drawImage(qrImage, 0, 0, 400, 400);

                        const logoImage = await loadImage(logoPath);

                        const logoSize = 400 * 0.25;
                        const x = (400 - logoSize) / 2;
                        const y = (400 - logoSize) / 2;

                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

                        ctx.drawImage(logoImage, x, y, logoSize, logoSize);

                        qrBuffer = canvas.toBuffer('image/png');
                    }
                } catch (overlayError) {
                    console.error("Error overlaying logo on QR code:", overlayError);
                }
            }

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename="table-${table.tableToken}-qr.png"`);
            return res.status(200).send(qrBuffer);
        } catch (error) {
            throw ApiError('Failed to generate QR Code', 500);
        }
    }, 'downloadQRCode')
}