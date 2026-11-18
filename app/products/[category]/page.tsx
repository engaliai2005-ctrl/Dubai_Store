import { INITIAL_CATEGORIES } from "../../../lib/seed-data";
import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return INITIAL_CATEGORIES.map(({ id }) => ({ category: id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryClient categoryParam={category} />;
}
