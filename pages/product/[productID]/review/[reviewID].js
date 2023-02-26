import { useRouter } from "next/router";

export default function Product_Details() {
  const router = useRouter();
  const { productID, reviewID } = router.query;
  return (
    <h1>
      Review {reviewID} about the {productID}
    </h1>
  );
}
