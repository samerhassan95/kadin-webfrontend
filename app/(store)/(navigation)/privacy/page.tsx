import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import ErrorBoundary from "@/components/error-boundary/error-boundary";
import { PrivacyContent } from "./content";

export const dynamic = "force-dynamic";

const PrivacyPolicy = async () => {
  const lang = cookies().get("lang")?.value;
  const params = lang ? { lang } : {};
  const terms = await infoService.privacy(params);

  return (
    <ErrorBoundary>
      <PrivacyContent data={terms} />
    </ErrorBoundary>
  );
};

export default PrivacyPolicy;
