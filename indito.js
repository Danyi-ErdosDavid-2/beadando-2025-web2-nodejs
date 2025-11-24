require('dotenv').config();
const app = require('./app');
const { ensureAdminUser } = require('./models/userModel');

const PORT = process.env.PORT || 4117;

async function start() {
  try {
    await ensureAdminUser({
      username: process.env.DEFAULT_ADMIN_USER || 'admin',
      password: process.env.DEFAULT_ADMIN_PASS || 'admin123',
    });
    app.listen(PORT, () => {
      console.log(`Szerver elindult: http://143.47.98.96/app117`);
    });
  } catch (err) {
    console.error('Nem sikerült elindítani az alkalmazást:', err);
    process.exit(1);
  }
}

start();
