import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function diagnose() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing!');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Connected to:', MONGODB_URI.split('@')[1]);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name).join(', '));

    const rolesCol = db.collection('roles');
    const rolesCount = await rolesCol.countDocuments();
    console.log('🛡️ Roles found:', rolesCount);

    const roles = await rolesCol.find({}).toArray();
    console.log('📝 Roles content:', JSON.stringify(roles.map(r => ({ id: r.id, name: r.name })), null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

diagnose();
