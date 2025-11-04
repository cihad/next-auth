import { Navbar } from "@/components/app/navbar";
import { PageTitle } from "@/components/app/page-title";
import { ProductCard } from "@/components/app/product-card";
import { Product } from "@/types/product";
import { getTranslations } from "next-intl/server";

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 && (
          <section>
            <PageTitle className="mb-8">{t("featuredProducts")}</PageTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
