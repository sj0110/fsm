import app from './app';
import { UserModel } from './models/user.model';
import config from './config';

async function createAdminUser() {
  const adminExists = await UserModel.findOne({ role: 'admin' });
  if (!adminExists) {
    await UserModel.create({
      name: 'Admin',
      email: 'admin@ex.com',
      password: '$2a$10$nzOWXIElTmRVdZEPuLiC2eb/TCY0ULIwUIqP1rt/P/8vqGv6FzUC2', // Password: hp123
      role: 'admin',
    });
    console.log('Admin user created');
  }
}

createAdminUser();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});