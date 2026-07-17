import userModel from '../model/user.model.js';

async () => {
    const admin = await userModel.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
        await userModel.create({
            name: 'Admin',
            email: 'admin@admin.com',
            password: '123456', // Your model hooks will hash this automatically!
            role: 'admin'
        });
        console.log('Admin user created successfully!');
    }

    return;
}