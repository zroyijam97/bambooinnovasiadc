import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001/api/v1';

export async function POST(request: NextRequest) {
  try {
    // Get authentication token (cached)
    const access_token = await getAuthToken();

    const body = await request.json();
    
    // Transform frontend data to match backend DTO
    const requestBody = {
      slug: body.slug || `${body.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, // Generate unique slug if not provided
      templateId: body.templateId || 'classic', // Use classic template as default
      title: body.cardName || body.title, // Map cardName to title
      name: body.name,
      jobTitle: body.jobTitle, // Use jobTitle directly
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
      publishStatus: body.publishStatus || 'DRAFT',
      businessHours: body.businessHours,
      services: body.services,
      socialLinks: body.socialLinks,
      testimonials: body.testimonials,
    };

    const response = await fetch(`${BACKEND_URL}/vcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Use proper JWT token
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend error:', error);
      return NextResponse.json(
        { error: 'Failed to create VCard' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Generate HTML file for the created VCard
    try {
      const htmlResponse = await fetch(`${request.nextUrl.origin}/api/vcards/generate-html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: result.slug }),
      });
      
      if (htmlResponse.ok) {
        console.log(`HTML file generated for VCard: ${result.slug}`);
      } else {
        console.warn(`Failed to generate HTML file for VCard: ${result.slug}`);
      }
    } catch (htmlError) {
      console.error('Error generating HTML file:', htmlError);
      // Don't fail the main request if HTML generation fails
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('VCard creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // Get authentication token (cached)
    const access_token = await getAuthToken();

    // Delete the card from backend
    const response = await fetch(`${BACKEND_URL}/vcards/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete VCard' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'VCard deleted successfully' });
  } catch (error) {
    console.error('VCard deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cache for authentication token to avoid repeated sync calls
let cachedToken: { token: string; expires: number } | null = null;

async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token;
  }

  // Temporarily bypass authentication for testing
  const userId = 'test-user-id';
  const userData = {
    id: userId,
    email: 'test-frontend@example.com',
    name: 'Test User Frontend',
    password: 'clerk_managed',
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
    throw new Error(`Failed to sync user: ${syncResponse.status}`);
  }

  const syncResult = await syncResponse.json();
  const { access_token } = syncResult;

  // Cache the token for 5 minutes
  cachedToken = {
    token: access_token,
    expires: Date.now() + 5 * 60 * 1000
  };

  return access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // Get authentication token (cached)
    const access_token = await getAuthToken();
    
    // If checking for slug availability
    if (slug) {
      const response = await fetch(`${BACKEND_URL}/vcards?slug=${encodeURIComponent(slug)}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (response.status === 404) {
        return NextResponse.json({ available: true }, { status: 404 });
      } else if (response.ok) {
        return NextResponse.json({ available: false }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: 'Failed to check slug' },
          { status: response.status }
        );
      }
    }
    
    // Regular GET request for all vcards
    const response = await fetch(`${BACKEND_URL}/vcards`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch VCards' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('VCard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}