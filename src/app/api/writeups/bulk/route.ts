import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Default teacher to associate imported writeups
    let teacher = await prisma.user.findFirst({ where: { role: 'TEACHER', email: 'import@udgam.com' } });
    if (!teacher) {
      teacher = await prisma.user.create({
        data: {
          name: 'Bulk Import User',
          email: 'import@udgam.com',
          password: 'password',
          role: 'TEACHER'
        }
      });
    }

    const writeupsToCreate = data.map((rawRow: any, index: number) => {
      if (index === 0) {
        console.log("EXCEL HEADERS:", Object.keys(rawRow));
      }
      
      // Normalize all keys to handle invisible spaces or variations
      const row: any = {};
      for (const key of Object.keys(rawRow)) {
        const cleanKey = key.trim().replace(/\s+/g, '').toLowerCase();
        row[cleanKey] = rawRow[key];
      }

      const titleKey = Object.keys(row).find(k => k.includes('शीर्षक') || k.includes('title') || k.includes('नवाचार') || k.includes('innovation') || k.includes('topic'));
      const title = titleKey ? row[titleKey] : 'Untitled Innovation';
      
      const categoryKey = Object.keys(row).find(k => k.includes('श्रेणी') || k.includes('category'));
      const category = categoryKey ? row[categoryKey] : 'सामान्य नवाचार';
      
      const districtKey = Object.keys(row).find(k => k.includes('जिला') || k.includes('जनपद') || k.includes('district'));
      const district = districtKey ? row[districtKey] : 'Unknown';
      
      const blockKey = Object.keys(row).find(k => k.includes('विकासखंड') || k.includes('block'));
      const block = blockKey ? row[blockKey] : '';
      
      const schoolKey = Object.keys(row).find(k => k.includes('विद्यालय') || k.includes('school'));
      const school = schoolKey ? row[schoolKey] : '';
      
      const contentKey = Object.keys(row).find(k => k.includes('विस्तृत') || k.includes('राइट') || k.includes('write') || k.includes('content') || k.includes('विवरण'));
      const content = contentKey ? row[contentKey] : 'No content provided';
      
      const mobileKey = Object.keys(row).find(k => k.includes('मोबाइल') || k.includes('mobile') || k.includes('number'));
      const mobile = mobileKey && row[mobileKey] ? String(row[mobileKey]) : '';
      
      const nameKey = Object.keys(row).find(k => k.includes('नाम') || k.includes('name') || k.includes('शिक्षक'));
      const teacherName = nameKey ? row[nameKey] : '';
      
      const fileKey = Object.keys(row).find(k => k.includes('डॉक्यूमेंट') || k.includes('upload') || k.includes('file') || k.includes('link') || k.includes('pdf'));
      const fileUrl = fileKey ? row[fileKey] : null;

      return {
        title,
        category,
        district,
        block,
        school,
        content,
        mobile,
        authorName: teacherName,
        fileUrl,
        status: 'PENDING',
        teacherId: teacher.id
      };
    });

    const result = await prisma.writeup.createMany({
      data: writeupsToCreate
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    console.error('Bulk API Error:', error);
    return NextResponse.json({ error: 'Failed to process bulk upload: ' + error.message }, { status: 500 });
  }
}
