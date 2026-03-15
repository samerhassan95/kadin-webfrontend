import { ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Story } from "@/types/story";
import { getSupportedLang } from "@/utils/get-supported-lang";

const storyService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Story[][]>(buildUrlQueryParams(`v1/rest/stories/paginate`, finalParams));
  },
};

export default storyService;
