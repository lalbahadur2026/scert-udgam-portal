import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const total = await prisma.writeup.count();
    const pending = await prisma.writeup.count({ where: { status: 'PENDING' } });
    const returned = await prisma.writeup.count({ where: { status: 'CORRECTION' } });
    const approved = await prisma.writeup.count({ where: { status: 'APPROVED' } });
    const interviewSelected = await prisma.writeup.count({ where: { status: 'INTERVIEW_SELECTED' } });
    const interviewRejected = await prisma.writeup.count({ where: { status: 'INTERVIEW_REJECTED' } });

    // Get district-wise stats for the bar chart
    const districtStatsRaw = await prisma.writeup.groupBy({
      by: ['district'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const districtStats = districtStatsRaw
      .filter(d => d.district !== null)
      .map(d => ({
        name: d.district,
        value: d._count.id
      }));

    // Get all writeups for the Excel-like table
    const recentWriteups = await prisma.writeup.findMany({
      orderBy: { createdAt: 'asc' },
      include: { teacher: true }
    });

    const formattedRecent = recentWriteups.map(w => {
      let statusColor = '#fef3c7';
      let textColor = '#d97706';
      let statusText = 'लंबित समीक्षा';
      
      if (w.status === 'APPROVED') {
        statusColor = '#dcfce7'; textColor = '#16a34a'; statusText = 'स्वीकृत';
      } else if (w.status === 'CORRECTION') {
        statusColor = '#fee2e2'; textColor = '#dc2626'; statusText = 'सुधार हेतु लौटाया';
      } else if (w.status === 'INTERVIEW_SELECTED') {
        statusColor = '#e0e7ff'; textColor = '#4338ca'; statusText = 'इंटरव्यू चयनित';
      } else if (w.status === 'INTERVIEW_REJECTED') {
        statusColor = '#f3f4f6'; textColor = '#4b5563'; statusText = 'इंटरव्यू अस्वीकृत';
      }

      return {
        id: w.id,
        name: w.authorName || w.teacher.name || '',
        school: w.school || '',
        district: w.district || '',
        block: w.block || '',
        mobile: w.mobile || '',
        title: w.title || '',
        category: w.category || '',
        content: w.content || '',
        fileUrl: w.fileUrl || '',
        catBg: '#eff6ff',
        catColor: '#3b82f6',
        status: statusText,
        rawStatus: w.status,
        statusColor,
        textColor
      };
    });

    return NextResponse.json({
      stats: { total, pending, returned, approved, interviewSelected, interviewRejected },
      districtStats,
      recentWriteups: formattedRecent
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
