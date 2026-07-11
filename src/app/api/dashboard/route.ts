import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const total = await prisma.writeup.count();
    const pending = await prisma.writeup.count({ where: { status: 'PENDING' } });
    const returned = await prisma.writeup.count({ where: { status: 'CORRECTION' } });
    const approved = await prisma.writeup.count({ where: { status: 'APPROVED' } });

    // Get district-wise stats for the bar chart
    const districtStatsRaw = await prisma.writeup.groupBy({
      by: ['district'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6, // Top 6 districts for the chart
    });

    const districtStats = districtStatsRaw
      .filter(d => d.district !== null)
      .map(d => ({
        name: d.district,
        value: d._count.id
      }));

    // Get 5 recent writeups for the table
    const recentWriteups = await prisma.writeup.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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
      }

      return {
        id: w.id,
        name: w.teacher.name,
        school: w.school || 'N/A',
        district: w.district || 'N/A',
        title: w.title,
        category: w.category || 'नवाचार',
        content: w.content,
        fileUrl: w.fileUrl,
        catBg: '#eff6ff',
        catColor: '#3b82f6',
        status: statusText,
        statusColor,
        textColor
      };
    });

    return NextResponse.json({
      stats: { total, pending, returned, approved },
      districtStats,
      recentWriteups: formattedRecent
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
