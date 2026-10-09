import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { orders as ordersApi } from "../../api/client";
import { formatPrice } from "../../lib/format";
import Stamp from "../../components/Stamp";

const STATUSES = ["New", "Confirmed", "In Delivery", "Delivered", "Cancelled"];

export default function OrderDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    ordersApi
      .get(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(e) {
    const status = e.target.value;
    setUpdating(true);
    setUpdateError(null);
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrder(updated);
    } catch (err) {
      const code = err.code;
      setUpdateError(
        code ? t(`errors.${code}`, { defaultValue: err.message }) : err.message,
      );
    } finally {
      setUpdating(false);
    }
  }

  function resolveItemName(item) {
    if (typeof item.name === "object") {
      return item.name?.[i18n.language] || item.name?.sq || "";
    }
    return item.name || "";
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-10">
        <p className="text-stone">{t("admin.orderDetail.loading")}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-10">
        <p className="text-oxblood">
          {t("admin.orderDetail.errorLoading", {
            error: error ? `: ${error}` : ".",
          })}
        </p>
        <Link
          to="/admin/orders"
          className="mt-4 inline-block text-sm hover:text-oxblood"
        >
          {t("admin.orderDetail.backToOrders")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-10">
      <Link
        to="/admin/orders"
        className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood"
      >
        {t("admin.orderDetail.backToOrders")}
      </Link>

      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="font-display text-2xl md:text-3xl">
          {order.orderNumber}
        </h1>
        <Stamp tone={order.status === "Cancelled" ? "stone" : "oxblood"}>
          {t(`orderStatus.${order.status}`)}
        </Stamp>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="stamp text-ink mb-3">{t("admin.orderDetail.customerLabel")}</div>
          <p className="text-sm">
            {order.customer?.firstName} {order.customer?.lastName}
          </p>
          <p className="text-sm text-stone mt-1">{order.customer?.phone}</p>
          <p className="text-sm text-stone mt-1">
            {order.customer?.address}, {order.customer?.city}
          </p>
          {order.customer?.notes && (
            <p className="text-sm text-stone mt-2 italic">
              "{order.customer.notes}"
            </p>
          )}
        </div>

        <div>
          <div className="stamp text-ink mb-3">{t("admin.orderDetail.updateStatus")}</div>
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="border border-stone-line bg-paper px-4 py-2 text-sm font-mono w-full disabled:opacity-50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`orderStatus.${s}`)}
              </option>
            ))}
          </select>
          {updating && (
            <p className="text-xs text-stone mt-2">{t("admin.orderDetail.saving")}</p>
          )}
          {updateError && (
            <p className="text-xs text-oxblood mt-2">{updateError}</p>
          )}
        </div>
      </div>

      <div className="stamp text-ink mb-3">{t("admin.orderDetail.itemsLabel")}</div>
      <div className="divide-y divide-stone-line border-y border-stone-line">
        {order.items?.map((item, i) => {
          const name = resolveItemName(item);
          return (
            <div
              key={i}
              className="py-4 flex items-baseline justify-between text-sm"
            >
              <div>
                <p>{name}</p>
                {item.variant && (item.variant.size || item.variant.color) && (
                  <p className="text-xs text-stone font-mono uppercase tracking-stamp mt-0.5">
                    {item.variant.size
                      ? t("admin.orderDetail.sizeLabel", { size: item.variant.size })
                      : ""}
                    {item.variant.size && item.variant.color ? " / " : ""}
                    {item.variant.color ?? ""} × {item.quantity}
                  </p>
                )}
              </div>
              <span className="font-mono">
                {formatPrice(item.price * item.quantity, i18n.language)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-stamp text-stone">
          {t("admin.orderDetail.total")}
        </span>
        <span className="font-display text-2xl">
          {formatPrice(order.total, i18n.language)}
        </span>
      </div>
    </div>
  );
}
