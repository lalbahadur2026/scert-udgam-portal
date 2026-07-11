const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

const writeups = [
  {
    title: 'डिजिटल उपस्थिति प्रणाली',
    district: 'Lucknow',
    category: 'तकनीकी नवाचार',
    content: 'हमने अपने विद्यालय में डिजिटल उपस्थिति के लिए एक नया ऐप बनाया है जिससे शिक्षकों का बहुत समय बचता है।',
    status: 'APPROVED'
  },
  {
    title: 'कचरे से खिलौने बनाना',
    district: 'Varanasi',
    category: 'टीएलएम (TLM)',
    content: 'बच्चों के लिए कबाड़ से टीएलएम बनाए गए हैं, जिससे वे आसानी से गणित सीख रहे हैं।',
    status: 'APPROVED'
  },
  {
    title: 'खेल-खेल में विज्ञान',
    district: 'Kanpur Nagar',
    category: 'विज्ञान नवाचार',
    content: 'विज्ञान के कठिन सिद्धांतों को खेल-खेल में समझाने के लिए विशेष कक्षाएं आयोजित की जा रही हैं।',
    status: 'CORRECTION'
  },
  {
    title: 'स्मार्ट लाइब्रेरी',
    district: 'Agra',
    category: 'पठन कौशल',
    content: 'विद्यालय में एक स्मार्ट लाइब्रेरी की स्थापना की गई है जहाँ बच्चे ई-बुक्स पढ़ सकते हैं।',
    status: 'PENDING'
  },
  {
    title: 'बाल संसद का गठन',
    district: 'Meerut',
    category: 'नेतृत्व क्षमता',
    content: 'बच्चों में नेतृत्व क्षमता विकसित करने के लिए विद्यालय में बाल संसद का चुनाव और गठन किया गया।',
    status: 'PENDING'
  }
];

async function seed() {
  try {
    let teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
    if (!teacher) {
      teacher = await prisma.user.create({
        data: {
          name: 'Demo Teacher',
          email: 'teacher@demo.com',
          password: 'password',
          role: 'TEACHER'
        }
      });
    }

    for (const w of writeups) {
      const writeup = await prisma.writeup.create({
        data: {
          title: w.title,
          district: w.district,
          category: w.category,
          content: w.content,
          status: w.status,
          teacherId: teacher.id
        }
      });
      console.log(`Added: ${writeup.title}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
