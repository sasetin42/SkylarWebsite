const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ofjorojhrnfakwkozvib.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mam9yb2pocm5mYWt3a296dmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTM5MjMsImV4cCI6MjA5NzE2OTkyM30.OEzTbd_JJtGDWAQwq7TEMkIYGfxU07tp3xc5hLKJusU';

const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
});

export interface ContactSubmission {
  name: string;
  email: string;
  mobile?: string;
  message: string;
}

export const supabaseClient = {
  async getAll(): Promise<{ key: string; value: any }[]> {
    if (!SUPABASE_ANON_KEY) return [];
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/system_data`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      return await response.json();
    } catch (e) {
      console.error('Supabase getAll error:', e);
      return [];
    }
  },

  async get(key: string): Promise<any | null> {
    if (!SUPABASE_ANON_KEY) return null;
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/system_data?key=eq.${encodeURIComponent(key)}&limit=1`,
        { method: 'GET', headers: getHeaders() }
      );
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const rows = await response.json();
      return rows.length > 0 ? rows[0].value : null;
    } catch (e) {
      console.error('Supabase get error:', e);
      return null;
    }
  },

  async upsert(key: string, value: any): Promise<boolean> {
    if (!SUPABASE_ANON_KEY) return false;
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/system_data`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ key, value })
      });
      return response.ok;
    } catch (e) {
      console.error('Supabase upsert error:', e);
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    if (!SUPABASE_ANON_KEY) return false;
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/system_data?key=eq.${key}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return response.ok;
    } catch (e) {
      console.error('Supabase delete error:', e);
      return false;
    }
  },

  /**
   * Save a contact form submission to the dedicated contact_submissions table.
   * Returns the created record id or null on failure.
   */
  async saveContactSubmission(data: ContactSubmission): Promise<string | null> {
    if (!SUPABASE_ANON_KEY) return null;
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Contact submission failed: ${errText}`);
      }
      const result = await response.json();
      return result[0]?.id ?? null;
    } catch (e) {
      console.error('Supabase contact submission error:', e);
      return null;
    }
  }
};
