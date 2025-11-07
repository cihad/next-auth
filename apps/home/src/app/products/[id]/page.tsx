import { Navbar } from "@fakestore/shared/components/navbar";
import { Footer } from "@/components/app/footer";
import { Product } from "@fakestore/shared/types/product";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/app/add-to-cart-button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { formatPrice } from "@fakestore/shared/lib/utils";
import { Rating } from "@fakestore/shadcn/components/rating";
import { getTranslations } from "next-intl/server";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | FakeStore`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const t = await getTranslations("productDetailPage");

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t("backToProducts")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <Link
                href={`/products?categories=${product.category}`}
                className="text-sm text-muted-foreground capitalize hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Rating rating={product.rating.rate} showValue size="lg" />
              <span className="text-sm text-muted-foreground">
                ({product.rating.count} {t("reviews")})
              </span>
            </div>

            <div className="border-t border-b py-4">
              <p className="text-sm text-muted-foreground mb-1">{t("price")}</p>
              <p className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <AddToCartButton product={product} />

            <div>
              <h2 className="text-lg font-semibold mb-3">{t("description")}</h2>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
