import { serializeJsonLd } from "@/lib/jsonld";

/**
 * One JSON-LD block. Takes schema.org nodes and wraps them in an @graph;
 * serialisation is escaped for the <script> context (lib/jsonld.ts), so
 * CMS text can never close the tag.
 */
export default function JsonLd({ nodes }: { nodes: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({ "@context": "https://schema.org", "@graph": nodes }),
      }}
    />
  );
}
