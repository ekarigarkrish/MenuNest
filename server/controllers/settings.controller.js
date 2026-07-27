import { asyncHandler, ApiError } from '../utils/helper.utils.js'
import restaurantModel from '../model/restaurant.model.js'
import { deleteFile } from '../utils/removeFile.utils.js'

// Singleton ID — the app always has exactly one restaurant record
const RESTAURANT_ID = '00000000-0000-0000-0000-000000000001'

const getOrCreateRestaurant = async () => {
    const [restaurant] = await restaurantModel.findOrCreate({
        where: { id: RESTAURANT_ID },
        defaults: {
            id: RESTAURANT_ID,
            name: 'My Restaurant',
            description: '',
            logo: null,
            contactEmail: '',
            contactPhone: ''
        }
    })
    return restaurant
}

export default {

    getRestaurant: asyncHandler(async (req, res) => {
        const restaurant = await getOrCreateRestaurant()

        const plain = restaurant.get({ plain: true })
        if (plain.logo) {
            plain.logo = `${req.protocol}://${req.get('host')}/${plain.logo}`
        }
        plain.gst_rate = parseFloat(plain.gst_rate)
        // console.log(plain);

        return res.status(200).json({ success: true, restaurant: plain })
    }, 'getRestaurant'),

    updateRestaurant: asyncHandler(async (req, res) => {
        const { name, description, contactEmail, contactPhone, removeLogo, gst_enabled, gst_type, gst_rate } = req.body

        const restaurant = await getOrCreateRestaurant()

        let logoValue = restaurant.logo

        // Explicit removal requested
        if (removeLogo === 'true' || removeLogo === true) {
            if (restaurant.logo) await deleteFile(restaurant.logo)
            logoValue = null
        }

        // New file uploaded — replace existing
        if (req.file?.path) {
            if (restaurant.logo) await deleteFile(restaurant.logo)
            logoValue = req.file.path
        }

        await restaurant.update({
            name: name ?? restaurant.name,
            description: description !== undefined ? description : restaurant.description,
            contactEmail: contactEmail !== undefined ? contactEmail : restaurant.contactEmail,
            contactPhone: contactPhone !== undefined ? contactPhone : restaurant.contactPhone,
            logo: logoValue,
            gst_enabled: gst_enabled !== undefined ? (gst_enabled === 'true' || gst_enabled === true) : restaurant.gst_enabled,
            gst_type: gst_type !== undefined ? gst_type : restaurant.gst_type,
            gst_rate: gst_rate !== undefined ? parseFloat(gst_rate) : restaurant.gst_rate
        })

        const updatedPlain = restaurant.get({ plain: true })
        if (updatedPlain.logo) {
            updatedPlain.logo = `${req.protocol}://${req.get('host')}/${updatedPlain.logo}`
        }

        return res.status(200).json({
            success: true,
            message: 'Restaurant settings updated successfully',
            restaurant: updatedPlain
        })
    }, 'updateRestaurant')
}
