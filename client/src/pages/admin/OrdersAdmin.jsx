import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { orders as ordersApi } from "../../api/client";
import { formatPrice } from "../../lib/format";
import Stamp from "../../components/Stamp";

const STATUSES = ["New", "Confirmed", "In Delivery", "Delivered", "Cancelled"];

export default function OrdersAdmin() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    ordersApi
      .list(statusFilter || undefined)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl md:text-3xl">{t("admin.orders.title")}</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-stone-line bg-paper px-4 py-2 text-sm font-mono"
        >
          <option value="">{t("admin.orders.allStatuses")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`orderStatus.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-stone">{t("admin.orders.loading")}</p>}
      {!loading && error && (
        <p className="text-oxblood">{t("admin.orders.errorLoading", { error })}</p>
      )}
      {!loading && !error && orders.length === 0 && (
        <p className="text-stone">{t("admin.orders.noOrders")}</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/admin/orders/${o._id}`}
              className="py-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-4 hover:bg-panel/50 transition-colors -mx-2 px-2"
            >
              {/* Mobile: top line — order number + status */}
              <div className="flex items-center justify-between md:hidden">
                <span className="font-mono text-sm">{o.orderNumber}</span>
                <Stamp tone={o.status === "Cancelled" ? "stone" : "ink"}>
                  {t(`orderStatus.${o.status}`)}
                </Stamp>
              </div>

              {/* Mobile: second line — name + date + price */}
              <div className="flex items-center justify-between gap-3 md:hidden">
                <span className="text-sm truncate">
                  {o.customer?.firstName} {o.customer?.lastName}
                </span>
                <span className="text-xs text-stone font-mono whitespace-nowrap">
                  {new Intl.DateTimeFormat(i18n.language, { dateStyle: "short" }).format(
                    new Date(o.createdAt),
                  )}
                </span>
                <span className="font-mono text-sm whitespace-nowrap">
                  {formatPrice(o.total, i18n.language)}
                </span>
              </div>

              {/* Desktop row */}
              <span className="hidden md:inline font-mono text-sm w-28">
                {o.orderNumber}
              </span>
              <span className="hidden md:inline flex-1 text-sm">
                {o.customer?.firstName} {o.customer?.lastName}
              </span>
              <span className="hidden md:inline text-xs text-stone font-mono w-32">
                {new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(
                  new Date(o.createdAt),
                )}
              </span>
              <span className="hidden md:inline font-mono text-sm w-24 text-right">
                {formatPrice(o.total, i18n.language)}
              </span>
              <span className="hidden md:flex w-32 justify-end">
                <Stamp tone={o.status === "Cancelled" ? "stone" : "ink"}>
                  {t(`orderStatus.${o.status}`)}
                </Stamp>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
