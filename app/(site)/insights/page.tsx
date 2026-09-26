import { IndexPage, indexMetadata } from "@/components/articles/routes";

export const generateMetadata = () => indexMetadata("insight");

export default function Page() {
  return <IndexPage kind="insight" />;
}
