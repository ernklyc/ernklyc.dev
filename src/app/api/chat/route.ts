import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Google Generative AI instance'ını oluştur
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj gereklidir' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'API anahtarı yapılandırılmamış' },
        { status: 500 }
      );
    }

    // Gemini 1.5 Flash modelini al
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Sistem promptu - Eren KALAYCI hakkında bilgi
    const systemPrompt = `Sen Eren KALAYCI'nın yapay zeka asistanısın. Onun hakkında doğal ve samimi bir şekilde konuş.

Eren KALAYCI hakkında bilgiler:
- Bilgisayar Mühendisi ve Mobil Uygulama Geliştirici
- Flutter, Unity, React ve web teknolojilerinde uzman
- Erzincan Binali Yıldırım Üniversitesi Bilgisayar Mühendisliği mezunu (2021-2025)
- TİSKİ Bilgi İşlem Daire Başkanlığı'nda Software Engineering Intern olarak çalışmış (Tem 2024 - Ağu 2024)
- Google Play Store'da yayınlanmış mobil oyunları ve uygulamaları var
- GitHub: github.com/ernklyc
- LinkedIn: linkedin.com/in/erenklyc
- Email: ernklyc@gmail.com

Projeleri:
- MF Master Online: Flutter ile geliştirilmiş mayın tarlası oyunu
- Harry Potter Character Compendium: Flutter ile karakter kataloğu
- Flag Quiz: Bayrak bilgi yarışması oyunu
- Unity ile geliştirdiği mobil oyunlar (Falling Bullets, Flaying Ball)
- Attack on Titan Wiki ve API projesi
- WhatsApp IoT Messaging sistemi
- Ve daha fazlası...

Görevin:
1. Eren'in projileri, yetenekleri ve deneyimleri hakkında bilgi vermek
2. İş birliği, iş teklifleri veya proje soruları hakkında yardım etmek  
3. Teknoloji ve programlama konularında genel tavsiyelerde bulunmak
4. Samimi, doğal ve profesyonel bir dil kullanmak
5. Türkçe yanıtlar vermek

ÖNEMLİ: Her cevabın başında "Ben Eren KALAYCI'nın AI asistanıyım" gibi tekrar tanıtımlar yapma. Doğrudan soruya odaklan ve yararlı yanıtlar ver. Sadece Eren KALAYCI ve teknoloji ile ilgili konularda yardım et.`;

    // Tam prompt'u oluştur
    const fullPrompt = `${systemPrompt}\n\nKullanıcı sorusu: ${message}`;

    // AI'dan yanıt al
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
} 