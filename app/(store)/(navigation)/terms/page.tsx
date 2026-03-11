import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { Metadata } from "next";
import ErrorBoundary from "@/components/error-boundary/error-boundary";

export const generateMetadata = async (): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.terms({ lang });
  return {
    title: terms?.data.translation?.title,
  };
};

const TermsPage = async () => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.terms({ lang });
  
  return (
    <ErrorBoundary>
      <div className="xl:container px-2 md:px-4">
        <h1 className="md:text-[26px] text-xl font-semibold">{terms?.data?.translation?.title}</h1>
        <div className="mt-4">
          <p>Terms content (temporarily simplified for debugging)</p>
          <p>If this loads without error, the issue is with HTML content rendering.</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TermsPage;
