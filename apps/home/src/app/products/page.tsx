import { Navbar } from "@fakestore/shared/components/navbar";
import { Footer } from "@/components/app/footer";
import { Product } from "@fakestore/shared/types/product";
import { ProductList } from "@/components/app/product-list";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.products");

  return {
    title: t("title"),
    description: t("description"),
  };
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
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

async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

interface ProductsPageProps {
  searchParams: Promise<{
    categories?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const [allProducts, allCategories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  // Parse URL parameters
  const selectedCategories = params.categories
    ? params.categories.split(",")
    : [];
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const sortBy = params.sort || "default";

  // Filter products
  let filteredProducts = [...allProducts];

  // Category filter
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  // Price filter
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;
  filteredProducts = filteredProducts.filter(
    (product) => product.price >= min && product.price <= max
  );

  // Sort
  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Navbar />
      <ProductList
        products={filteredProducts}
        categories={allCategories}
        selectedCategories={selectedCategories}
        sortBy={sortBy}
      />
      <Footer />
    </>
  );
}
