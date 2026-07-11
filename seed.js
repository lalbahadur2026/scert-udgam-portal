const writeups = [
  {
    title: 'डिजिटल उपस्थिति प्रणाली',
    district: 'Lucknow',
    category: 'तकनीकी नवाचार',
    content: 'हमने अपने विद्यालय में डिजिटल उपस्थिति के लिए एक नया ऐप बनाया है जिससे शिक्षकों का बहुत समय बचता है।',
  },
  {
    title: 'कचरे से खिलौने बनाना',
    district: 'Varanasi',
    category: 'टीएलएम (TLM)',
    content: 'बच्चों के लिए कबाड़ से टीएलएम बनाए गए हैं, जिससे वे आसानी से गणित सीख रहे हैं।',
  },
  {
    title: 'खेल-खेल में विज्ञान',
    district: 'Kanpur Nagar',
    category: 'विज्ञान नवाचार',
    content: 'विज्ञान के कठिन सिद्धांतों को खेल-खेल में समझाने के लिए विशेष कक्षाएं आयोजित की जा रही हैं।',
  },
  {
    title: 'स्मार्ट लाइब्रेरी',
    district: 'Agra',
    category: 'पठन कौशल',
    content: 'विद्यालय में एक स्मार्ट लाइब्रेरी की स्थापना की गई है जहाँ बच्चे ई-बुक्स पढ़ सकते हैं।',
  },
  {
    title: 'बाल संसद का गठन',
    district: 'Meerut',
    category: 'नेतृत्व क्षमता',
    content: 'बच्चों में नेतृत्व क्षमता विकसित करने के लिए विद्यालय में बाल संसद का चुनाव और गठन किया गया।',
  }
];

async function seed() {
  for (const w of writeups) {
    const formData = new FormData();
    formData.append('title', w.title);
    formData.append('district', w.district);
    formData.append('category', w.category);
    formData.append('content', w.content);
    
    try {
      const res = await fetch('http://localhost:3000/api/writeups', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log(`Added: ${w.title}`, data);
    } catch (e) {
      console.error(e);
    }
  }
}

seed();
