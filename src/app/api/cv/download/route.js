import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { decompressCV } from '@/lib/firestore';
import { decompressPDF, generatePDF } from '@/lib/pdf-generator';
import { requireAuth, assertSameUserOrAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');
    const format = searchParams.get('format') || 'html'; // 'html' or 'pdf'

    if (!cvId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing cvId' 
      }, { status: 400 });
    }

    // Fetch CV from Firestore
    const cvDoc = await db.collection('cvStorage').doc(cvId).get();

    if (!cvDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'CV not found' 
      }, { status: 404 });
    }

    const cvData = cvDoc.data();
    assertSameUserOrAdmin(decodedToken, cvData.userId);
    
    // Handle PDF download (generate on the fly if missing)
    if (format === 'pdf') {
      try {
        let pdfBuffer = null;

        if (cvData.compressedPdf) {
          pdfBuffer = decompressPDF(Buffer.from(cvData.compressedPdf, 'base64'));
        } else if (cvData.pdfBase64) {
          const base64 = (cvData.pdfBase64 || '').replace(/^data:application\/pdf;base64,/, '');
          pdfBuffer = Buffer.from(base64, 'base64');
        } else {
          // Generate PDF from stored HTML
          let htmlContent = cvData.compressedHtml || cvData.htmlContent || '';
          if (htmlContent && !htmlContent.startsWith('<!DOCTYPE')) {
            try {
              htmlContent = decompressCV(htmlContent);
            } catch (decompressError) {
              console.error('Decompression failed while generating PDF:', decompressError);
              htmlContent = cvData.htmlContent || '';
            }
          }

          if (!htmlContent) {
            return NextResponse.json({ success: false, error: 'PDF not available for this CV' }, { status: 404 });
          }

          pdfBuffer = await generatePDF(htmlContent, cvData.title || 'CV');
          const pdfBase64 = pdfBuffer.toString('base64');
          // Persist PDF for future downloads (best-effort)
          cvDoc.ref.update({ pdfBase64 }).catch(() => {});
        }

        cvDoc.ref.update({
          lastAccessed: new Date().toISOString(),
          downloadCount: (cvData.downloadCount || 0) + 1
        }).catch(() => {});

        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${cvData.title || 'CV'}.pdf"`,
            'Content-Length': pdfBuffer.length.toString(),
          },
        });
      } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to process PDF' 
        }, { status: 500 });
      }
    }
    
    // Handle HTML download (original code)
    // Decompress HTML if it's compressed
    let htmlContent = cvData.compressedHtml || cvData.htmlContent || '';
    if (htmlContent && !htmlContent.startsWith('<!DOCTYPE')) {
      try {
        // Try to decompress if it looks compressed
        htmlContent = decompressCV(htmlContent);
      } catch (decompressError) {
        console.error('Decompression failed, using raw content:', decompressError);
        // If decompression fails, use HTML content as fallback
        htmlContent = cvData.htmlContent || '';
      }
    }

    // Update last accessed time and download count
    try {
      await cvDoc.ref.update({
        lastAccessed: new Date().toISOString(),
        downloadCount: (cvData.downloadCount || 0) + 1
      });
    } catch (updateError) {
      console.warn('Warning: Could not update download stats:', updateError);
      // Don't fail the request if stats update fails
    }

    return NextResponse.json({
      success: true,
      html: htmlContent,
      title: cvData.title,
      template: cvData.template,
      industry: cvData.industry
    });

  } catch (error) {
    console.error('Error downloading CV:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({
      success: false,
      error: 'Failed to download CV'
    }, { status: 500 });
  }
}
