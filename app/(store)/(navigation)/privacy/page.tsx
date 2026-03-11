import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { PrivacyContent } from "./content";
import ErrorBoundary from "@/components/error-boundary/error-boundary";

export const dynamic = "force-dynamic";

const PrivacyPolicy = async () => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.privacy({ lang });
  
  return (
    <ErrorBoundary>
      <PrivacyContent data={terms} />
    </ErrorBoundary>
  );
};

export default PrivacyPolicy;
