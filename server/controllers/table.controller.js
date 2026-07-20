import { asyncHandler } from "../utils/helper.utils.js";

export default {
    createTableQRCode:asyncHandler(async (req,res) => {
        const {name ,capacity} = req.body;
        
        
        return res.status(200).json({message:"Table QR Code created successfully"})
    },'createTableQRCode')
}