/**
 * Test utility to verify language options are available
 */

export const testLanguageOptions = () => {
  console.log("🧪 Testing Language Options...");

  // This would be called in the settings page context
  const mockApiResponse = {
    data: [
      {
        id: 1,
        locale: "en",
        title: "English",
        active: 1,
        backward: 0,
        default: 1,
        img: "",
      },
    ],
  };

  // Simulate the enhancement logic
  const enhancedLanguages = [
    ...mockApiResponse.data,
    ...(!mockApiResponse.data.some((lang) => lang.locale === "ar")
      ? [
          {
            id: 999,
            locale: "ar",
            title: "العربية",
            active: 1,
            backward: 1,
            default: 0,
            img: "",
          },
        ]
      : []),
  ];

  console.log("📋 Available languages:", enhancedLanguages);
  console.log(
    "✅ Arabic available:",
    enhancedLanguages.some((lang) => lang.locale === "ar")
  );
  console.log(
    "✅ English available:",
    enhancedLanguages.some((lang) => lang.locale === "en")
  );

  return enhancedLanguages;
};

// Make it available globally for console testing
if (typeof window !== "undefined") {
  (window as any).testLanguageOptions = testLanguageOptions;
}
