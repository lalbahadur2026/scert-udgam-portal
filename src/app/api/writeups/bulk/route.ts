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

    const writeupsToCreate = data.map((row: any) => {
      // Map exact Hindi/English column names from Google Form Excel to our DB fields
      const title = row['इनोवेशन का शीर्षक (Innovation Title)'] || row['title'] || row['Title'] || row['नवाचार का शीर्षक (Innovation Title)'] || row['इन्नोवेशन का शीर्षक'] || 'Untitled Innovation';
      const category = row['category'] || row['Category'] || row['नवाचार की श्रेणी (Category of Innovation)'] || 'सामान्य नवाचार';
      const district = row['जनपद (District)'] || row['district'] || row['District'] || row['जनपद'] || 'Unknown';
      const block = row['block'] || row['Block'] || row['विकासखंड (Block)'] || row['विकासखंड'] || '';
      const school = row['विद्यालय का नाम (School Name)'] || row['school'] || row['School'] || row['विद्यालय'] || '';
      const content = row['विस्तृत राइट-अप (Detailed Write-up)'] || row['content'] || row['Content'] || row['Write-up'] || 'No content provided';
      const mobileRaw = row['मोबाइल नंबर (Mobile Number)'] || row['mobile'] || row['Mobile'] || row['Mobile Number'] || '';
      const mobile = mobileRaw ? String(mobileRaw) : '';
      const teacherName = row['पूरा नाम (Full Name)'] || 'Unknown Teacher';
      const fileUrl = row['डॉक्यूमेंट अपलोड करें (.docx, .pdf)'] || null;

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
