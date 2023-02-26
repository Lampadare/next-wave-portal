import { useRouter } from "next/router";

export default function Docs() {
  const router = useRouter();
  const { params = [] } = router.query;
  console.log(params);

  if (params.length === 2) {
    return (
      <h1>
        Docs for feature {params[0]} and concept {params[1]}{" "}
      </h1>
    );
  } else if (params.length === 1) {
    return <h1>Docs for feature {params[0]}, please select a concept</h1>;
  }

  return <h1>the docs home page</h1>;
}
