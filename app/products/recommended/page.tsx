import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProductsPage = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 20,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold lg:text-center lg:text-2xl">
          Pedidos Recomendados
        </h2>
        <div className="lg: grid grid-cols-2 gap-6 lg:ml-[50px] lg:flex lg:flex-wrap">
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.id}
              className="min-w-full lg:min-w-[10rem]"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProductsPage;
