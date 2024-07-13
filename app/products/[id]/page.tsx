interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = ({ params: { id } }: ProductPageProps) => {
  return <div>Product Page {id}</div>;
};

export default ProductPage;
