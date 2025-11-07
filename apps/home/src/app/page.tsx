import { Navbar } from "@fakestore/shared/components/navbar";
import { Footer } from "@/components/app/footer";
import { PageTitle } from "@fakestore/shared/components/page-title";
import { ProductCard } from "@/components/app/product-card";
import { Product } from "@fakestore/shared/types/product";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.home");

  return {
    title: t("title"),
    description: t("description"),
  };
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=4", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const t = await getTranslations("homePage");
  const products = await getFeaturedProducts();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-4rem)]">
        {products.length > 0 && (
          <section>
            <PageTitle>{t("featuredProducts")}</PageTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
