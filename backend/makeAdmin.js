const prisma = require('./src/prisma');

// Este script é para promover um usuário comum a ADMIN.
// Basta rodar dentro da pasta backend: docker-compose exec node makeAdmin.js

async function promoteToAdmin() {
  const emailDoAdmin = 'samuelaquiar0@gmail.com'; // COLOQUE AQUI O EMAIL DA SUA CONTA
  try {
    const user = await prisma.user.update({
      where: { email: emailDoAdmin },
      data: { role: 'ADMIN' }
    });
    
    console.log(`🎉 Sucesso! O usuário ${user.name} (${user.email}) agora é um ADMIN!`);
  } catch (error) {
    console.error("Erro ao atualizar usuário. Verifique se o e-mail está correto.", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

promoteToAdmin();