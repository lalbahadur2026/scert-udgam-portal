import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Papa from 'papaparse';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch CSV from the provided URL' }, { status: 400 });
    }

    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const data = parsed.data;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data found in the CSV' }, { status: 400 });
    }

    let teacher = await prisma.user.findFirst({ where: { role: 'TEACHER', email: 'import@udgam.com' } });
    if (!teacher) {
      teacher = await prisma.user.create({
        data: { name: 'Bulk Import User', email: 'import@udgam.com', password: 'password', role: 'TEACHER' }
      });
    }

    let addedCount = 0;

    for (const rawRow of data) {
      const row: any = {};
      for (const key of Object.keys(rawRow as any)) {
        const cleanKey = key.trim().replace(/\s+/g, '').toLowerCase();
        row[cleanKey] = (rawRow as any)[key];
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

      // Duplicate check: if a writeup with exact same title and teacher name exists, skip it
      const exists = await prisma.writeup.findFirst({
        where: {
          title: title,
          authorName: teacherName
        }
      });

      if (!exists && title !== 'Untitled Innovation') {
        await prisma.writeup.create({
          data: {
            title, category, district, block, school, content, mobile, authorName: teacherName, fileUrl, status: 'PENDING', teacherId: teacher.id
          }
        });
        addedCount++;
      }
    }

    return NextResponse.json({ success: true, count: addedCount, totalFound: data.length });
  } catch (error: any) {
    console.error('Sync API Error:', error);
    return NextResponse.json({ error: 'Failed to sync: ' + error.message }, { status: 500 });
  }
}
