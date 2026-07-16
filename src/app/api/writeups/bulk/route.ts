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
