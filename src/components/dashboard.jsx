import {BarChart} from "@mui/x-charts/BarChart";
import {useEffect, useState} from "react";
import getTopSalesProducts from "../utils/dashboard/topSellingProducts";
import getSalesToday from "../utils/dashboard/salesToday";
import {getSalesByDay} from "@/utils/dashboard/saleBySpecificDay";
import {getSalesThisMonth} from "../utils/dashboard/salesMonthly";
import getTotalInventoryValue from "../utils/dashboard/totalInventoryValue";
import {Toaster, toast} from "sonner";
import {Loader2} from "lucide-react";

export default function Dashboard() {
  const [dataset, setDataset] = useState(null);
  const [salesToday, setSalesToday] = useState(null);
  const [salesThisMonth, setSalesThisMonth] = useState(null);
  const [salesYesterday, setSalesYesterday] = useState(null);
  const [lastMonthSales, setLastMonthSales] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);

  useEffect(() => {
    async function getProducts() {
      const response = await getTopSalesProducts();

      if (response.success) {
        setDataset(response.data);
      } else {
        toast.error("Error with the products");
      }
    }

    async function getTodaysSales() {
      const response = await getSalesToday();

      if (response && response.success) {
        setSalesToday(response.data);
      } else {
        toast.error("Error al obtener las ventas de hoy");
      }
    }

    async function getYesterdaysSales() {
      const today = new Date();
      const yesterday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1
      );

      const yearYesterday = yesterday.getFullYear();
      const monthYesterday = String(yesterday.getMonth() + 1);
      const dayYesterday = String(yesterday.getDate());

      const yesterdayDate = `${yearYesterday}-${monthYesterday}-${dayYesterday}`;

      const response = await getSalesByDay(yesterdayDate);

      if (response.success) {
        setSalesYesterday(response.data);
      } else {
        toast.error("Error el obtener la ventas de ayer");
      }
    }

    async function getLastMonthSales() {
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate);

      lastMonthDate.setMonth(lastMonthDate.getMonth());

      const previousMonth = lastMonthDate.getMonth();
      const year = lastMonthDate.getFullYear();
      const date = new Date();
      const today = date.getDate();

      const targetDate = `${year}-${previousMonth}-${today}`;

      const response = await getSalesThisMonth(targetDate);

      if (response.success) {
        setLastMonthSales(response.data);
      } else {
        toast.error("Error el obtener las ventas del mes pasado");
      }
    }

    async function getThisMonthSales() {
      const response = await getSalesThisMonth();

      if (response && response.success) {
        setSalesThisMonth(response.data);
      } else {
        toast.error("Error al obtener las ventas del mes");
      }
    }

    async function getInventoryValue() {
      const response = await getTotalInventoryValue();

      if (response && response.success) {
        setInventoryValue(response.data);
      } else {
        toast.error("Error al obtener el valor del inventario");
      }
    }

    getProducts();
    getTodaysSales();
    getThisMonthSales();
    getYesterdaysSales();
    getLastMonthSales();
    getInventoryValue();
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center">
          <div className="flex justify-between items-center w-full">
            <h3 className="m-0 mb-2.5 text-gray-700 text-lg font-semibold">
              Ventas de Hoy
            </h3>
            {salesYesterday !== null &&
            salesToday !== null &&
            salesYesterday !== 0 ? (
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${
                  ((salesToday - salesYesterday) / salesYesterday) * 100 >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {((salesToday - salesYesterday) / salesYesterday) * 100 >= 0
                  ? "+"
                  : ""}
                {(
                  ((salesToday - salesYesterday) / salesYesterday) *
                  100
                ).toFixed(1)}
                %
              </span>
            ) : (
              <span className="text-xs text-gray-400">Sin datos</span>
            )}
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1.5">
            {salesToday !== null ? (
              `$${salesToday.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-500">Total vendido hoy</div>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center">
          <div className="flex justify-between items-center w-full">
            <h3 className="m-0 mb-2.5 text-gray-700 text-lg font-semibold">
              Ventas del Mes
            </h3>
            {salesThisMonth !== null &&
            lastMonthSales !== null &&
            lastMonthSales > 0 ? (
              ((salesThisMonth - lastMonthSales) / lastMonthSales) * 100
            ) : (
              <span className="text-xs text-gray-400">Sin datos</span>
            )}
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1.5">
            {salesThisMonth !== null ? (
              `$${salesThisMonth.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-500">Total vendido este mes</div>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center">
          <div className="flex justify-between items-center w-full">
            <h3 className="m-0 mb-2.5 text-gray-700 text-lg font-semibold">
              Valor del Inventario
            </h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1.5">
            {inventoryValue !== null ? (
              `$${inventoryValue.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-500">Valor total en inventario</div>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center w-full">
        <h3 className="m-0 mb-5 text-gray-700 text-lg font-semibold">
          Productos Más Vendidos
        </h3>
        {!dataset ? (
          <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
        ) : (
          <div className="w-full h-96">
            <BarChart
              dataset={dataset}
              yAxis={[{scaleType: "band", dataKey: "name"}]}
              series={[
                {
                  dataKey: "total_sold",
                  label: "Productos más vendidos",
                  color: "#155dfc",
                },
              ]}
              layout="horizontal"
            />
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
