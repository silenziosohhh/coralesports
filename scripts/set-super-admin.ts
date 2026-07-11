import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setSuperAdmin() {
  try {
    // Get all users to see who exists
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        discordTag: true,
        role: true,
      },
    });

    console.log('\n📋 Utenti esistenti:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.discordTag || user.email} - Ruolo: ${user.role}`);
    });

    if (users.length === 0) {
      console.log('\n❌ Nessun utente trovato nel database.');
      return;
    }

    // Update the first user to SUPER_ADMIN (or you can modify this to target a specific user)
    const userToUpdate = users[0];
    
    const updated = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { role: 'SUPER_ADMIN' },
    });

    console.log(`\n✅ Utente aggiornato a SUPER_ADMIN:`);
    console.log(`   Email: ${updated.email}`);
    console.log(`   Discord: ${updated.discordTag}`);
    console.log(`   Ruolo: ${updated.role}`);
    console.log('\n⚠️  IMPORTANTE: Devi fare LOGOUT e LOGIN di nuovo per aggiornare la sessione!');
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setSuperAdmin();
