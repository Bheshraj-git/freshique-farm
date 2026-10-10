import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/market/ProductCard";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

const FALLBACK_PRODUCTS: ProductCardType[] = [
  {
    id: "bd6c712a-5371-4730-8841-87b886b98009",
    name: "Grapes - Red Globe",
    slug: "grapes-red-globe",
    price: 40,
    unit: "gram (250g)",
    city: "Bhavnagar",
    category_name: "Fruits",
    category_slug: "fruits",
    primary_image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ead3fa8e-9456-45b1-ae98-38bd5b98e8c0",
    name: "Banana",
    slug: "banana",
    price: 79.97,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Fruits",
    category_slug: "fruits",
    primary_image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ed315aed-1283-4477-9a84-771bfb1c75ad",
    name: "Apple Kashmir",
    slug: "apple-kashmir",
    price: 99.99,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Fruits",
    category_slug: "fruits",
    primary_image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4164eeda-7881-442d-9c34-90dd5d97576b",
    name: "Red Dragonfruit Indian",
    slug: "red-dragonfruit-indian",
    price: 74.99,
    unit: "pieces",
    city: "Bhavnagar",
    category_name: "Fruits",
    category_slug: "fruits",
    primary_image:
      "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4f96fbaf-6c8e-4bcc-86f8-40a993df18e0",
    name: "Oranges",
    slug: "oranges",
    price: 110,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Fruits",
    category_slug: "fruits",
    primary_image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ed69e54d-5c9a-4bde-9149-363c3a0e1214",
    name: "Papaya",
    slug: "papaya",
    price: 45,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Vegetables",
    category_slug: "vegetables",
    primary_image:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "15b702a3-3d88-45b3-aba7-adeac1a81e0f",
    name: "Sweet Corn",
    slug: "sweet-corn",
    price: 30,
    unit: "pieces",
    city: "Bhavnagar",
    category_name: "Vegetables",
    category_slug: "vegetables",
    primary_image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "89237b3c-38b0-4901-b2de-a6ec8c964732",
    name: "Zucchini - Green",
    slug: "zucchini-green",
    price: 35,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Vegetables",
    category_slug: "vegetables",
    primary_image:
      "https://images.unsplash.com/photo-1563252722-6434563a985d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "f85e3b53-8f6d-4c55-87d0-2ae8db383f28",
    name: "Ghee",
    slug: "ghee",
    price: 900,
    unit: "kg",
    city: "Bhavnagar",
    category_name: "Dairy",
    category_slug: "dairy",
    primary_image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "604815d7-fd0b-4e0a-9692-0652922e97d0",
    name: "Paneer",
    slug: "paneer",
    price: 85,
    unit: "gram (250g)",
    city: "Bhavnagar",
    category_name: "Dairy",
    category_slug: "dairy",
    primary_image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e202f20c-b91a-484e-b1fa-7ac488b116bc",
    name: "Panner",
    slug: "panner-136p",
    price: 60,
    unit: "250",
    city: "Bhavnagar",
    category_name: "Dairy",
    category_slug: "dairy",
    primary_image:
      "https://sbyjxxjwmzihbrrostxk.supabase.co/storage/v1/object/public/product-images/b9325565-8537-4097-b9ff-f5ae8a90cd83/e202f20c-b91a-484e-b1fa-7ac488b116bc/main.jpg?v=1790768642769",
  },
];

interface CategoryMeta {
  title: string;
  subtitle: string;
  gradientText: string;
  gradientBar: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryMeta> = {
  fruits: {
    title: "Fresh Fruits",
    subtitle: "Direct from verified orchards • Freshly harvested & sweet",
    gradientText: "bg-gradient-to-r from-orange-600 via-red-600 to-pink-600",
    gradientBar: "bg-gradient-to-r from-orange-400 to-red-500",
  },
  vegetables: {
    title: "Farm Vegetables",
    subtitle: "Organically grown • Harvested daily at dawn",
    gradientText: "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700",
    gradientBar: "bg-gradient-to-r from-green-500 to-emerald-600",
  },
  dairy: {
    title: "Pure Dairy",
    subtitle: "Farm fresh A2 dairy • Traditional quality guaranteed",
    gradientText: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700",
    gradientBar: "bg-gradient-to-r from-blue-400 to-indigo-600",
  },
};

interface Props {
  products?: ProductCardType[];
  favoritedIds?: Set<string>;
}

export default function CategoryProductsSection({
  products,
  favoritedIds = new Set(),
}: Props) {
  const productList =
    products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  // Group products by category_slug
  const categoriesToRender: {
    slug: string;
    meta: CategoryMeta;
    items: ProductCardType[];
  }[] = [
    {
      slug: "fruits",
      meta: CATEGORY_CONFIGS.fruits,
      items: productList.filter((p) => p.category_slug === "fruits"),
    },
    {
      slug: "vegetables",
      meta: CATEGORY_CONFIGS.vegetables,
      items: productList.filter((p) => p.category_slug === "vegetables"),
    },
    {
      slug: "dairy",
      meta: CATEGORY_CONFIGS.dairy,
      items: productList.filter((p) => p.category_slug === "dairy"),
    },
  ].filter((cat) => cat.items.length > 0);

  return (
    <section className="bg-gradient-to-b from-lime-50/50 via-white to-lime-50/30 py-10 sm:py-14 md:py-16 border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 md:space-y-12">
        {categoriesToRender.map(({ slug, meta, items }) => (
          <div key={slug} className="space-y-5 sm:space-y-6">
            {/* Category Heading matching the aesthetic */}
            <div className="text-center">
              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-black text-center bg-clip-text text-transparent ${meta.gradientText} tracking-tight`}
              >
                {meta.title}
              </h2>
              <div
                className={`h-1.5 w-20 sm:w-24 mx-auto mt-2.5 sm:mt-3 ${meta.gradientBar} rounded-full`}
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-500 font-medium">
                {meta.subtitle}
              </p>
            </div>

            {/* Products Grid using our existing ProductCard component */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  initialFavorited={favoritedIds.has(product.id)}
                  showAddToCart={false}
                />
              ))}
            </div>

            {/* Category link to market */}
            <div className="flex justify-center pt-1">
              <Link
                href={`/market?category=${slug}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
              >
                View all {meta.title.toLowerCase()} in Market
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
