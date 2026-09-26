import { IndexPage, indexMetadata } from "@/components/articles/routes";

export const generateMetadata = () => indexMetadata("news");

export default function Page() {
  return <IndexPage kind="news" />;
}
