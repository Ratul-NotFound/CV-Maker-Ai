import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * Cleans and optimizes HTML for better PDF rendering
 * @param {string} html - Raw HTML content
 * @returns {string} Optimized HTML
 */
function optimizeHTMLForPDF(html) {
  // Remove markdown code blocks if present
  let cleaned = html.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  
  // Ensure proper doctype
  if (!cleaned.trim().toLowerCase().startsWith('<!doctype html>')) {
    cleaned = '<!DOCTYPE html>\n' + cleaned;
  }
  
  // Add print-optimized CSS if not present
  if (!cleaned.includes('@media print') && !cleaned.includes('@page')) {
    const printCSS = `
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    </style>
    `;
    cleaned = cleaned.replace('</head>', printCSS + '</head>');
  }
  
  return cleaned;
}

/**
 * Generates a PDF from HTML content using Puppeteer
 * Works in both local development and Vercel serverless environment
 * 
 * @param {string} htmlContent - The HTML string to convert to PDF
 * @param {string} title - The title for the PDF (optional)
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generatePDF(htmlContent, title = 'CV') {
  let browser = null;

  try {
    // Optimize HTML for PDF rendering
    const optimizedHTML = optimizeHTMLForPDF(htmlContent);
    // Determine if we're in production (Vercel) or local development
    const isProduction = process.env.NODE_ENV === 'production';

    // Configure browser options
    const browserOptions = isProduction
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        }
      : {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
                          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          headless: true,
        };

    // Launch browser
    browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();

    // Set viewport for high quality rendering - A4 at 96 DPI
    await page.setViewport({
      width: 794, // A4 width in pixels (210mm at 96 DPI)
      height: 1123, // A4 height in pixels (297mm at 96 DPI)
      deviceScaleFactor: 1, // 1x for accurate scaling (prevents oversized rendering)
    });

    // Set content and wait for it to fully load and render
    await page.setContent(optimizedHTML, {
      waitUntil: ['load', 'domcontentloaded'],
      timeout: 30000, // 30 second timeout
    });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Give additional time for final rendering
    await page.waitForTimeout(500);

    // Generate PDF with A4 format and high quality settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true, // Use @page CSS margins (15mm from templates)
      displayHeaderFooter: false,
      scale: 1.0, // Perfect 1:1 scale - no zoom
      // Tagged PDF for accessibility
      tagged: true,
      // Outline disabled for cleaner output
      outline: false,
    });

    return pdfBuffer;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generates a PDF and returns it as a base64 string
 * Useful for storing in database or sending over network
 * 
 * @param {string} htmlContent - The HTML string to convert to PDF
 * @param {string} title - The title for the PDF (optional)
 * @returns {Promise<string>} Base64 encoded PDF
 */
export async function generatePDFBase64(htmlContent, title = 'CV') {
  const pdfBuffer = await generatePDF(htmlContent, title);
  return pdfBuffer.toString('base64');
}

/**
 * Compresses PDF buffer using gzip
 * Useful for storing PDFs in Firestore with size limits
 * 
 * @param {Buffer} pdfBuffer - The PDF buffer to compress
 * @returns {Buffer} Compressed buffer
 */
export function compressPDF(pdfBuffer) {
  const zlib = require('zlib');
  return zlib.gzipSync(pdfBuffer);
}

/**
 * Decompresses a gzip-compressed PDF buffer
 * 
 * @param {Buffer} compressedBuffer - The compressed PDF buffer
 * @returns {Buffer} Decompressed PDF buffer
 */
export function decompressPDF(compressedBuffer) {
  const zlib = require('zlib');
  return zlib.gunzipSync(compressedBuffer);
}
