import React, { useState, useTransition } from "react";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import useAddressStore from "@/global-store/address";
import { City, Country } from "@/types/global";
import { deleteCookie, setCookie } from "cookies-next";
import { AsyncSelect } from "@/components/async-select";
import useCartStore from "@/global-store/cart";
import { useRouter } from "next/navigation";
import { useSearchAddress } from "@/hook/use-search-address";
import { addressService } from "@/services/address";
import { error } from "@/components/alert";

const CountrySelect = ({ onSelect }: { onSelect: () => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedCountry = useAddressStore((state) => state.country);
  const updateCountry = useAddressStore((state) => state.updateCountry);
  const selectedCity = useAddressStore((state) => state.city);
  const updateCity = useAddressStore((state) => state.updateCity);
  const [tempCountry, setTempCountry] = useState(selectedCountry);
  const [tempCity, setTempCity] = useState(selectedCity);
  const clearLocalCart = useCartStore((state) => state.clear);
  const [isPending, startTransition] = useTransition();
  const [isDetecting, setIsDetecting] = useState(false);
  const { mutate: searchAddress } = useSearchAddress();

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        searchAddress(
          { lat, lng },
          {
            onSuccess: async (res) => {
              if (res.status !== "OK") {
                error("Failed to detect location from Google");
                setIsDetecting(false);
                return;
              }
              const countryComp = res?.results
                ?.flatMap((r: any) => r.address_components)
                ?.find((c: any) => c.types.includes("country"));

              const cityNameComp = res?.results
                ?.flatMap((r: any) => r.address_components)
                ?.find((c: any) => c.types.includes("locality") || c.types.includes("administrative_area_level_2"));

              if (countryComp) {
                const countriesRes = await addressService.getCountries({
                  has_price: true,
                });
                const matchedCountry = countriesRes.data.find(
                  (c) =>
                    c.translation?.title.toLowerCase() === countryComp.long_name.toLowerCase() ||
                    c.code?.toLowerCase() === countryComp.short_name.toLowerCase()
                );

                if (matchedCountry) {
                  setTempCountry(matchedCountry);
                  if (cityNameComp) {
                    const citiesRes = await addressService.getCities({
                      country_id: matchedCountry.id,
                      has_price: true,
                    });
                    const matchedCity = citiesRes.data.find(
                      (c) => c.translation?.title.toLowerCase() === cityNameComp.long_name.toLowerCase()
                    );
                    if (matchedCity) {
                      setTempCity(matchedCity);
                    }
                  }
                } else {
                  error("Could not match your country with supported locations");
                }
              }
              setIsDetecting(false);
            },
            onError: () => {
              error("Failed to detect location address");
              setIsDetecting(false);
            },
          }
        );
      },
      () => {
        error("Permission denied or location unavailable");
        setIsDetecting(false);
      }
    );
  };

  const handleSaveAddress = () => {
    if (tempCountry) {
      updateCountry(tempCountry);
      setCookie("country_id", tempCountry.id);
      clearLocalCart();
    }
    if (tempCity) {
      updateCity(tempCity);
      setCookie("city_id", tempCity.id);
    } else {
      updateCity(null);
      deleteCookie("city_id");
    }

    startTransition(() => onSelect());
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <AsyncSelect
        label="select.country"
        onSelect={(value) => {
          setTempCountry(value);
          setTempCity(null);
        }}
        extractTitle={(option) => option?.translation?.title as string}
        extractKey={(option) => option?.id}
        queryKey="v1/rest/countries"
        queryParams={{ country_id: tempCountry?.id, has_price: true }}
        size="medium"
        value={tempCountry as Country}
      />
      {tempCountry?.cities_count !== 0 && typeof tempCountry?.cities_count !== "undefined" && (
        <AsyncSelect
          label="select.city"
          onSelect={(value) => setTempCity(value)}
          extractTitle={(option) => option?.translation?.title as string}
          extractKey={(option) => option?.id}
          queryKey="v1/rest/cities"
          size="medium"
          queryParams={{ country_id: tempCountry?.id, has_price: true }}
          value={tempCity as City}
        />
      )}
      <div className="flex flex-col gap-2">
        <Button
          loading={isDetecting}
          onClick={handleAutoDetect}
          fullWidth
          size="small"
          color="blackOutlined"
        >
          {t("detect.location")}
        </Button>
        <Button
          loading={isPending}
          onClick={handleSaveAddress}
          fullWidth
          size="small"
          color="black"
        >
          {t("save.address")}
        </Button>
      </div>
    </div>
  );
};

export default CountrySelect;
