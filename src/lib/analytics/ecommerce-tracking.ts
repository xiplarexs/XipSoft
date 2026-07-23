// ===================================// E-Commerce Analytics Tracking
// ===================================// Tracks product views, cart additions, and purchases
// Phase 3.6: Analytics tracking module
// Requirement 14: Analytics tracking

import pool from '@/lib/database'

export interface AnalyticsEvent {
  eventType: 'product_viewed' | 'add_to_cart' | 'purchase'
  productId?: string
  orderId?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

/**
 * Track a product view and increment view count
 * Requirement 14.1: Product view tracking
 */
export async function trackProductView(productId: string, sessionId?: string) {
  try {
    const client = await pool.connect()
    try {
      await client.query('BEgIN')

      // Increment product view count
      await client.query(
        'UPDATE products SET view_count = view_count + 1 WHERE id = $1',
        [productId],
      )

      // Log event
      await client.query(
        `INSERT INTO ecommerce_events 
         (event_type, product_id, session_id, metadata)
         VALUES ($1, $2, $3, $4)`,
        [
          'product_viewed',
          productId,
          sessionId,
          {
            ip: 'client_ip_will_be_added',
            timestamp: new Date().toISOString(),
          },
        ],
      )

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to track product view:', error)
    // Fail silently for analytics - don't break main flow
  }
}
