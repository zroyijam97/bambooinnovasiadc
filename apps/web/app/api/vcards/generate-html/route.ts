import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateVCardHTML } from '@/lib/html-generator'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001/api/v1'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Fetch VCard data from backend using the public endpoint
    const response = await fetch(`${BACKEND_URL}/v/${slug}`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'VCard not found' },
        { status: 404 }
      )
    }

    const vcard = await response.json()
    
    // Generate HTML content
    const htmlContent = generateVCardHTML(vcard)
    
    // Ensure the /hi directory exists
    const hiDir = join(process.cwd(), 'public', 'hi')
    await mkdir(hiDir, { recursive: true })
    
    // Write HTML file
    const filePath = join(hiDir, `${slug}.html`)
    await writeFile(filePath, htmlContent, 'utf8')
    
    return NextResponse.json({
      success: true,
      message: `HTML file generated for ${slug}`,
      path: `/hi/${slug}.html`
    })
    
  } catch (error) {
    console.error('Error generating HTML:', error)
    return NextResponse.json(
      { error: 'Failed to generate HTML file' },
      { status: 500 }
    )
  }
}

// Generate HTML for all VCards
export async function GET() {
  try {
    // Fetch all VCards from backend
    const response = await fetch(`${BACKEND_URL}/vcards`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch VCards' },
        { status: 500 }
      )
    }

    const vcards = await response.json()
    
    // Ensure the /hi directory exists
    const hiDir = join(process.cwd(), 'public', 'hi')
    await mkdir(hiDir, { recursive: true })
    
    const results = []
    
    // Generate HTML for each VCard
    for (const vcard of vcards) {
      try {
        const htmlContent = generateVCardHTML(vcard)
        const filePath = join(hiDir, `${vcard.slug}.html`)
        await writeFile(filePath, htmlContent, 'utf8')
        
        results.push({
          slug: vcard.slug,
          success: true,
          path: `/hi/${vcard.slug}.html`
        })
      } catch (error) {
        console.error(`Error generating HTML for ${vcard.slug}:`, error)
        results.push({
          slug: vcard.slug,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Generated HTML files for ${results.filter(r => r.success).length} VCards`,
      results
    })
    
  } catch (error) {
    console.error('Error generating HTML files:', error)
    return NextResponse.json(
      { error: 'Failed to generate HTML files' },
      { status: 500 }
    )
  }
}