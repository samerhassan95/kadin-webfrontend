import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import React, { useState } from "react";
import { CartTotal } from "@/components/cart-total";
import { saveAs } from "file-saver";
import { error } from "@/components/alert";
import useSettingsStore from "@/global-store/settings";
import { OrderDetailCollapse } from "./order-detail-collapse";

const OrderDetail = ({ id, onRepeat }: { id?: number | null; onRepeat?: () => void }) => {
  const { t } = useTranslation();
  const [isDownLoading, setIsDownLoading] = useState(false);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data } = useQuery(["order", id], () => orderService.get(id, { lang: language?.locale }), {
    suspense: true,
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
  const orderDetail =
    data?.data?.find((orderItem) => typeof orderItem.parent_id === "undefined") || data?.data?.[0];
  const grandTotal = data?.data.reduce((acc, curr) => acc + curr.total_price, 0);

  const handleDownload = () => {
    setIsDownLoading(true);
    orderService
      .downloadInvoice(orderDetail?.id)
      .then(async (res) => {
        const stream = await res.blob();
        const blob = new Blob([stream], {
          type: "application/octet-stream",
        });
        const filename = "download.pdf";
        saveAs(blob, filename);
      })
      .catch(() => {
        error(t("cant.download.the.invoice"));
      })
      .finally(() => {
        setIsDownLoading(false);
      });
  };

  return (
    <div className="md:px-5 py-5 px-2">
      <div className="text-xl font-bold">
        #{data?.data ? data?.data.map((detail) => detail.id).join("-") : ""}
      </div>
      <div className="flex items-center justify-between px-5 py-[18px] bg-white bg-opacity-30 rounded-2xl mt-5 mb-2.5">
        <span className="text-sm font-medium">{orderDetail?.delivery_type}</span>

        <div className="w-1 h-1 rounded-full bg-gray-field" />
        <span className="text-sm font-medium">
          {dayjs(orderDetail?.delivery_date).format("MMM DD, YYYY - HH:mm")}
        </span>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={!isDownLoading ? handleDownload : undefined}
            className="inline-flex items-center gap-2.5 text-sm text-blue-link"
          >
            {isDownLoading ? t("downloading...") : t("download.invoice")}
          </button>
        </div>
      </div>
      {data?.data.map((orderItem) => (
        <OrderDetailCollapse order={orderItem} onRepeat={onRepeat} />
      ))}
      {data?.data.length !== 1 && (
        <div className="mt-4">
          <CartTotal totals={{ total_price: grandTotal }} couponStyle={false} />
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
