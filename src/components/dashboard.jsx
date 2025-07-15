import {BarChart} from "@mui/x-charts/BarChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {useEffect, useState} from "react";
import {getSalesByDay} from "@/utils/dashboard/saleBySpecificDay";
import {getSalesThisMonth} from "../utils/dashboard/salesMonthly";
import {Toaster, toast} from "sonner";
import {Loader2, TriangleAlert} from "lucide-react";
import getTopSalesProducts from "../utils/dashboard/topSellingProducts";
import getSalesToday from "../utils/dashboard/salesToday";
import getTotalInventoryValue from "../utils/dashboard/totalInventoryValue";
import getLowStockProduts from "@/utils/dashboard/lowStockProducts";

export default function Dashboard() {
  const [dataset, setDataset] = useState(null);
  const [datasetLowStockProduct, setDatasetLowStockProduct] = useState(null);
  const [salesToday, setSalesToday] = useState(null);
  const [salesThisMonth, setSalesThisMonth] = useState(null);
  const [salesYesterday, setSalesYesterday] = useState(null);
  const [lastMonthSales, setLastMonthSales] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [lastSevenDaysSales, setLastSevenDaysSales] = useState([]);
  const [isLoadingSevenDays, setIsLoadingSevenDays] = useState(false);

  useEffect(() => {
    async function getProducts() {
      const response = await getTopSalesProducts();

      if (response.success) {
        setDataset(response.data);
      } else {
        toast.error("Error with the products");
      }
    }

    async function fetchLowStockProducts() {
      const response = await getLowStockProduts();

      if (response.success) {
        setDatasetLowStockProduct(response.data);
      } else {
        toast.error("Error with the low stock products");
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

    async function getSalesLastSevenDays() {
      setIsLoadingSevenDays(true);
      const today = new Date();
      const salesData = [];

      setLastSevenDaysSales([]);

      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const lastDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - i
        );

        const yearLastDay = lastDay.getFullYear();
        const monthLastDay = String(lastDay.getMonth() + 1);
        const dayLastDay = String(lastDay.getDate());

        const LastDayDate = `${yearLastDay}-${monthLastDay}-${dayLastDay}`;
        dates.push(LastDayDate);
      }

      for (let i = 0; i < dates.length; i++) {
        try {
          const response = await getSalesByDay(dates[i]);

          if (response.success) {
            salesData.push({
              dayNumber: i,
              daySales: response.data || 0,
              date: dates[i],
              displayDate: new Date(dates[i]).toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
              }),
            });
          } else {
            salesData.push({
              dayNumber: i,
              daySales: 0,
              date: dates[i],
              displayDate: new Date(dates[i]).toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
              }),
            });
          }
        } catch (error) {
          console.error("Error fetching sales for day:", dates[i], error);
          salesData.push({
            dayNumber: i,
            daySales: 0,
            date: dates[i],
            displayDate: new Date(dates[i]).toLocaleDateString("es-ES", {
              month: "short",
              day: "numeric",
            }),
          });
        }
      }

      setLastSevenDaysSales(salesData);
      setIsLoadingSevenDays(false);
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
    getSalesLastSevenDays();
    fetchLowStockProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Ventas de Hoy</h3>
            {salesYesterday !== null &&
            salesToday !== null &&
            salesYesterday !== 0 ? (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
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
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Sin datos
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {salesToday !== null ? (
              `$${salesToday.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Total vendido hoy
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Ventas del Mes</h3>
            {salesThisMonth !== null &&
            lastMonthSales !== null &&
            lastMonthSales > 0 ? (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  ((salesThisMonth - lastMonthSales) / lastMonthSales) * 100 >=
                  0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {((salesThisMonth - lastMonthSales) / lastMonthSales) * 100 >= 0
                  ? "+"
                  : ""}
                {(
                  ((salesThisMonth - lastMonthSales) / lastMonthSales) *
                  100
                ).toFixed(1)}
                %
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Sin datos
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {salesThisMonth !== null ? (
              `$${salesThisMonth.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Total vendido este mes
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Valor del Inventario
            </h3>
            <div className="text-purple-600 bg-purple-100 p-2 rounded-full">
              📦
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {inventoryValue !== null ? (
              `$${inventoryValue.toLocaleString()}`
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Valor total en inventario
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Stock Bajo</h3>
            <div className="text-red-600 bg-red-100 p-2 rounded-full">
              <TriangleAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {datasetLowStockProduct !== null ? (
              datasetLowStockProduct.length
            ) : (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Productos que requieren reposición
          </div>
        </div>
      </div>

      {/* Contenedor principal para los gráficos */}
      <div className="flex flex-col gap-6">
        {/* Gráfico de ventas de los últimos 7 días - Ocupa el ancho completo */}
        <div className="w-full">
          <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Ventas de los Últimos 7 Días
              </h3>
              <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                Tendencia semanal
              </div>
            </div>
            {isLoadingSevenDays || lastSevenDaysSales.length === 0 ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="w-full h-80">
                <LineChart
                  xAxis={[
                    {
                      data: lastSevenDaysSales.map((day) => day.displayDate),
                      scaleType: "point",
                      tickLabelStyle: {
                        fontSize: 12,
                        fill: "#6B7280",
                      },
                    },
                  ]}
                  yAxis={[
                    {
                      tickLabelStyle: {
                        fontSize: 12,
                        fill: "#6B7280",
                      },
                      valueFormatter: (value) => `$${value.toLocaleString()}`,
                    },
                  ]}
                  series={[
                    {
                      data: lastSevenDaysSales.map((day) => day.daySales),
                      label: "Ventas diarias",
                      color: "#3B82F6",
                      area: true,
                      showMark: true,
                      markSize: 6,
                    },
                  ]}
                  grid={{horizontal: true, vertical: false}}
                  margin={{left: 80, right: 20, top: 20, bottom: 60}}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor para los dos gráficos de barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Gráfico de productos más vendidos */}
        <div className="w-full">
          <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Productos Más Vendidos
              </h3>
              <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                Top Ventas
              </div>
            </div>
            {!dataset ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              </div>
            ) : dataset.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-80 text-gray-500">
                <div className="text-lg mb-2">📊</div>
                <div className="text-center">
                  No hay datos de productos vendidos
                </div>
              </div>
            ) : (
              <div className="w-full h-80">
                <BarChart
                  dataset={dataset}
                  yAxis={[
                    {
                      scaleType: "band",
                      dataKey: "name",
                      tickLabelStyle: {
                        fontSize: 11,
                        fill: "#374151",
                      },
                    },
                  ]}
                  xAxis={[
                    {
                      tickLabelStyle: {
                        fontSize: 12,
                        fill: "#6B7280",
                      },
                      valueFormatter: (value) => value.toLocaleString(),
                    },
                  ]}
                  series={[
                    {
                      dataKey: "total_sold",
                      label: "Unidades vendidas",
                      color: "#10B981",
                    },
                  ]}
                  layout="horizontal"
                  grid={{horizontal: true, vertical: false}}
                  margin={{left: 120, right: 20, top: 20, bottom: 40}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de productos con stock bajo */}
        <div className="w-full">
          <div className="p-6 rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Productos con Stock Bajo
              </h3>
              <div className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <TriangleAlert className="w-3 h-3" />
                Alerta
              </div>
            </div>
            {!datasetLowStockProduct ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
              </div>
            ) : datasetLowStockProduct.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-80 text-gray-500">
                <div className="text-lg mb-2">✅</div>
                <div className="text-center">
                  ¡Todos los productos tienen stock suficiente!
                </div>
              </div>
            ) : (
              <div className="w-full h-80">
                <BarChart
                  dataset={datasetLowStockProduct}
                  yAxis={[
                    {
                      scaleType: "band",
                      dataKey: "name",
                      tickLabelStyle: {
                        fontSize: 11,
                        fill: "#374151",
                      },
                    },
                  ]}
                  xAxis={[
                    {
                      tickLabelStyle: {
                        fontSize: 12,
                        fill: "#6B7280",
                      },
                      valueFormatter: (value) => `${value} unidades`,
                    },
                  ]}
                  series={[
                    {
                      dataKey: "stock",
                      label: "Stock disponible",
                      color: "#EF4444",
                    },
                  ]}
                  layout="horizontal"
                  grid={{horizontal: true, vertical: false}}
                  margin={{left: 120, right: 20, top: 20, bottom: 40}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
