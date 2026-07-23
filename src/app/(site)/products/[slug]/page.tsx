import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Globe, Shield, Zap, ShoppingCart } from 'lucide-react'
import { getProductBySlug } from '@/lib/db-products'
import { trackProductView } from '@/lib/analytics/ecommerce-tracking'

export const revalidate = 3600;

interface ProductDetailPageProps { params: Promise<{ slug: string }> }

export async function generateMetadata(
  { params }: ProductDetailPageProps,
): Promise<Metadata> {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    
    if (!product) {
      return {
        title: 'urun Bulunamadı',
        description: 'Istediginiz urun bulunamadı',
      }
    }

    return {
      title: `${product.name} - XipSoft`,
      description: product.description || `${product.name} - ${product.base_price}₺`,
      alternates: { canonical: `https://xipsoft.net/products/${slug}` },
      robots: { index: true, follow: true },
      opengraph: {
        title: product.name,
        description: product.description ?? undefined,
        type: 'website',
        url: `https://xipsoft.net/products/${slug}`,
      },
      twitter: { card: "summary_large_image", images: [`https://xipsoft.net/media/logo.webp`] },
    }
  } catch (error) {
    return {
      title: 'urun Detayı',
      description: 'XipSoft urunu',
    }
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  await trackProductView(String(product.id)).catch(() => undefined)

  const features = Array.isArray(product.features) ? product.features : []

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `https://xipsoft.net/products/${slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@id': 'https://xipsoft.net', name: 'Ana Sayfa' } },
          { '@type': 'ListItem', position: 2, item: { '@id': 'https://xipsoft.net/products', name: 'Ürünler' } },
          { '@type': 'ListItem', position: 3, item: { '@id': `https://xipsoft.net/products/${slug}`, name: product.name } },
        ],
      },
      {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        offers: {
          '@type': 'Offer',
          price: product.base_price.toString(),
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>urunlere geri Dön</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-purple-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <Globe className="w-24 h-24 text-purple-300 opacity-50" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-start space-y-8">
              {/* Title and Price */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-prism-gradient bg-clip-text text-transparent mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-lg">
                  Versiyon: {product.version || 'v1.0'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ₺{Number(product.base_price).toLocaleString('tr-TR')}
                </span>
                <span className="text-xl text-gray-400">/bir kez</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              {features && features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Özellikler
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <Link
                  href={`/odeme?product=${encodeURIComponent(product.name)}&price=${product.base_price}&id=${product.id}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(167,139,250,0.4)]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Satın Al — ₺{Number(product.base_price).toLocaleString('tr-TR')}
                </Link>
              </div>

              {/* Additional Info */}
              <div className="pt-8 border-t border-purple-500/20 space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Subdomain veya kisisel domain seçilebilir</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Ödeme sonrası anında deploy edilir</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>SSL sertifikası dahildir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
