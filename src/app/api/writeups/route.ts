import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // We will hardcode teacherId for now since there's no real auth yet.
    // In a real app, you get this from the session.
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

    const title = formData.get('title') as string;
    const district = formData.get('district') as string;
    const category = formData.get('category') as string || 'सामान्य नवाचार';
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    if (!title || !district || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (title.length > 200 || content.length > 5000) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }

    if (title.includes('<script>') || content.includes('<script>')) {
      return NextResponse.json({ error: 'Invalid characters detected' }, { status: 400 });
    }

    let fileUrl = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      // Note: in production, save this to a cloud bucket like S3 or Vercel Blob
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      
      // Ensure directory exists (you might need to create it manually once)
      await writeFile(filepath, buffer).catch(() => console.error("Failed to save file. Ensure public/uploads exists."));
      fileUrl = `/uploads/${filename}`;
    }

    const writeup = await prisma.writeup.create({
      data: {
        title,
        district,
        category,
        content,
        fileUrl,
        status: 'PENDING',
        teacherId: teacher.id
      }
    });

    return NextResponse.json({ success: true, writeup });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
