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

      const title = row['नवाचारकाशीर्षक'] || row['इनोवेशनकाशीर्षक(innovationtitle)'] || row['title'] || row['नवाचारकाशीर्षक(innovationtitle)'] || row['इन्नोवेशनकाशीर्षक'] || 'Untitled Innovation';
      const category = row['नवाचारकीश्रेणी'] || row['category'] || row['नवाचारकीश्रेणी(categoryofinnovation)'] || 'सामान्य नवाचार';
      const district = row['जिला'] || row['जनपद'] || row['जनपद(district)'] || row['district'] || 'Unknown';
      const block = row['विकासखंड'] || row['block'] || row['विकासखंड(block)'] || '';
      const school = row['विद्यालय'] || row['विद्यालयकानाम'] || row['विद्यालयकानाम(schoolname)'] || row['school'] || '';
      const content = row['विस्तृतराइट-अप'] || row['विस्तृतराइटअप'] || row['विस्तृतराइट-अप(detailedwrite-up)'] || row['content'] || row['write-up'] || 'No content provided';
      const mobileRaw = row['मोबाइलनंबर'] || row['मोबाइलनंबर(mobilenumber)'] || row['mobile'] || row['mobilenumber'] || '';
      const mobile = mobileRaw ? String(mobileRaw) : '';
      const teacherName = row['शिक्षककानाम'] || row['पूरानाम'] || row['पूरानाम(fullname)'] || row['teachername'] || row['name'] || '';
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
