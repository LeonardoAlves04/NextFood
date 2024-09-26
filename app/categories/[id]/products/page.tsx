import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";

interface CategoriesPageProps {
  params: {
    id: string;
  };
}

const CategoriesPage = async ({ params: { id } }: CategoriesPageProps) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
        take: 20,
      },
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold lg:flex lg:justify-center">
          {category.name}
        </h2>
        <div className="grid grid-cols-2 gap-6 lg:flex lg:flex-wrap lg:justify-center">
          {category?.products.map((product) => (
            <ProductItem
              product={product}
              key={product.id}
              className="min-w-full lg:min-w-20"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
