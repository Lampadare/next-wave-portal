import { useRouter } from "next/router";

export default function Product_Details() {
  const router = useRouter();
  const productId = router.query.id;
  return <h1>Deets about the {productId}</h1>;
}
