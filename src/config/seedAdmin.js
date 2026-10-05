const bcrypt = require('bcryptjs');
const AdminModel = require('../models/admin.model.js');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@school.com';
    const adminPassword = 'Admin@12345';

    const existingAdmin = await AdminModel.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const DEFAULT_ADMIN = {
      firstName: 'Ernest',
      lastName: 'Acheiver',
      photo: 'default-admin.jpg',
      password: hashedPassword,
      email: adminEmail,
      phone: '9999999999',
      role: 'admin',
      isActive: true,
    };

    await AdminModel.create(DEFAULT_ADMIN);

    console.log('Default admin created successfully');
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    throw error;
  }
};

module.exports = seedAdmin;