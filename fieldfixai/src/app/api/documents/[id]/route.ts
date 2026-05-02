import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete associated chunks first (cascaded by database)
    const { error: deleteError } = await supabaseServer
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting document:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete document: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
