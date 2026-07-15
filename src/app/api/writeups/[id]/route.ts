import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, comment } = await req.json();
    const { id } = await params;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the write-up status
    const writeup = await prisma.writeup.update({
      where: { id },
      data: { status }
    });

    // If there is a comment (e.g., when returning for correction), save it
    if (comment && comment.trim() !== '') {
      // Hardcode a reviewer ID for now
      let reviewer = await prisma.user.findFirst({ where: { role: 'REVIEWER' } });
      if (!reviewer) {
        reviewer = await prisma.user.create({
          data: {
            name: 'Admin Reviewer',
            email: 'admin@demo.com',
            password: 'password',
            role: 'REVIEWER'
          }
        });
      }

      await prisma.comment.create({
        data: {
          content: comment,
          writeupId: id,
          reviewerId: reviewer.id
        }
      });
    }

    return NextResponse.json({ success: true, writeup });

  } catch (error) {
    console.error('Update API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
