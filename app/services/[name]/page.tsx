import { getServiceComparisons } from "@/lib/data";
import ServiceComparisonClient from "@/components/ServiceComparisonClient";

interface PageProps {
  params: { name: string };
  searchParams: Promise<{ city?: string }>;
}

export default async function ServiceComparisonPage({ params, searchParams }: PageProps) {
  const serviceName = decodeURIComponent(params.name);
  const sp = await searchParams;
  const cityFilter = sp.city || "All Cities";
  const city = cityFilter === "All Cities" ? null : cityFilter;

  const comparisons = await getServiceComparisons(serviceName, city);

  return (
    <ServiceComparisonClient
      serviceName={serviceName}
      cityFilter={cityFilter}
      initialComparisons={comparisons}
    />
  );
}
