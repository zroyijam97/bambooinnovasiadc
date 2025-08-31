import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch VCard from backend using the public endpoint
    const response = await fetch(`${BACKEND_URL}/v/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'VCard not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const vcard = await response.json();
    return NextResponse.json(vcard);
  } catch (error) {
    console.error('Error fetching VCard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VCard' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Temporarily bypass Clerk authentication for testing
    // TODO: Implement proper Clerk authentication in production
    
    // Use the same hardcoded credentials as POST endpoint for consistency
    const userData = {
      id: 'test-user-id',
      email: 'test-frontend@example.com',
      name: 'Test User Frontend',
      password: 'test123456',
      emailVerified: true,
    };

    const syncResponse = await fetch(`${BACKEND_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!syncResponse.ok) {
      const error = await syncResponse.text();
      console.error('Backend sync error:', error);
      return NextResponse.json(
        { error: 'Failed to sync user' },
        { status: syncResponse.status }
      );
    }

    const syncResult = await syncResponse.json();
    const { access_token } = syncResult;

    const { slug: id } = params; // The slug parameter actually contains the ID for PATCH requests
    const body = await request.json();
    
    // Transform frontend data to match backend DTO (same as POST endpoint)
    const requestBody = {
      slug: body.slug || `${body.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      templateId: body.templateId || 'classic',
      title: body.cardName || body.title,
      name: body.name,
      jobTitle: body.jobTitle,
      company: body.company,
      bio: body.bio,
      avatar: body.avatar,
      banner: body.banner,
      phone: body.phone,
      email: body.email,
      website: body.website,
      address: body.address,
      themeConfig: body.themeConfig,
      fontId: body.fontId,
      publishStatus: body.publishStatus || 'PUBLISHED',
      businessHours: body.businessHours,
      services: body.services,
      socialLinks: body.socialLinks,
      testimonials: body.testimonials,
    };

    // Update VCard via backend API
    const response = await fetch(`${BACKEND_URL}/vcards/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: 'Failed to update VCard' },
        { status: response.status }
      );
    }

    const updatedVCard = await response.json();
    
    // Regenerate HTML file for the updated VCard
    try {
      const htmlResponse = await fetch(`${request.nextUrl.origin}/api/vcards/generate-html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: updatedVCard.slug }),
      });
      
      if (htmlResponse.ok) {
        console.log(`HTML file regenerated for updated VCard: ${updatedVCard.slug}`);
      } else {
        console.warn(`Failed to regenerate HTML file for VCard: ${updatedVCard.slug}`);
      }
    } catch (htmlError) {
      console.error('Error regenerating HTML file:', htmlError);
      // Don't fail the main request if HTML generation fails
    }
    
    return NextResponse.json(updatedVCard);
  } catch (error) {
    console.error('Error updating VCard:', error);
    return NextResponse.json(
      { error: 'Failed to update VCard' },
      { status: 500 }
    );
  }
}