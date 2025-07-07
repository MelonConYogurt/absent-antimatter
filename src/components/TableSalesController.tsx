import TableSales from "./tableSales";
import {useState, useEffect} from "react";
import {Toaster, toast} from "sonner";
import type {Sale} from "../models/saleModel";
import SearchSales from "../utils/sales/searchSales";
import {ChevronLeft, ChevronRight, Loader2, Search, X} from "lucide-react";
import {DeleteSale} from "@/utils/sales/deleteSale";

export default function TableSalesController() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Sale[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [page, setPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<string | undefined>();
  const [column, setColumn] = useState<string | undefined>();

  useEffect(() => {
    GetSales();
  }, [offset, column, orderDirection]);

  useEffect(() => {
    if (searchValue === "") {
      GetSales();
    }
  }, [searchValue]);

  async function GetSales() {
    try {
      setLoading(true);
      let response = await SearchSales(
        offset,
        limit,
        searchValue ? searchValue : null,
        column ? column : null,
        orderDirection ? orderDirection : null
      );
      console.log("Respuesta de API:", response);

      if (!response) {
        toast.error("No se pudo obtener datos de las ventas");
        return;
      }

      if (response.data && response.metadata) {
        setData(response.data);
        setTotalSales(response.metadata?.total);
        setPage(response.metadata.page);
        toast.success(`Se cargaron ${response.data.length} ventas`);
      } else {
        toast.warning("No hay ventas disponibles");
      }
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      toast.error(`Error al cargar ventas: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  async function HandleDelete(sale: Sale) {
    console.log(`Deleting Sale with id: ${sale.id}`);
    const response = await DeleteSale(sale.id);
    if (response) {
      toast.success(`Sale delete: ${sale.id}`);
    } else {
      toast.error(`Fail to delete the sale: ${sale.id}`);
    }
    GetSales();
  }

  function HandleUpdate(Sale: Sale) {
    console.log(`Updating Sale with id: ${Sale.id}`);
  }

  function handleChangeSearInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function handlePageUp() {
    setOffset((prev) => prev + limit);
  }

  function handlePageDown() {
    setOffset((prev) => prev - limit);
  }

  function handleColumOrder(col: string, colDirection: string) {
    setColumn(col);
    setOrderDirection(colDirection);
    -console.log(`Col: ${col}, direction: ${colDirection}`);
  }

  function handleSearchReset() {
    setSearchValue("");
  }

  return (
    <section className="w-full p-5 flex flex-col gap-5">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de ventas</h1>
        <p className="text-gray-600 mt-1">Administre las ventas.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <div className="relative flex items-center w-full md:w-auto">
          <div className="flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2.5">
            <Search className=" text-gray-400 w-5 h-5 cursor-pointer" />
            <input
              type="text"
              placeholder="Buscar por id del cliente por el id de usuario..."
              className="w-full px-2 outline-none border-none text-sm text-gray-700 placeholder-gray-400"
              onChange={handleChangeSearInput}
              disabled={loading}
              value={searchValue}
            />
            <X
              className=" text-red-400 w-5 h-5 cursor-pointer"
              onClick={handleSearchReset}
            />
          </div>
          <button
            className="ml-2 px-4 py-2.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            onClick={GetSales}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="text-gray-600 text-sm whitespace-nowrap">
            Mostrando {Math.min(offset + limit, totalSales)} de {totalSales}{" "}
            ventas
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
              disabled={page === 1 || loading}
              onClick={handlePageDown}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm font-medium">
              {page} / {Math.ceil(totalSales / limit)}
            </div>

            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === Math.ceil(totalSales / limit) || loading}
              onClick={handlePageUp}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <TableSales
        data={data}
        loading={loading}
        onDelete={HandleDelete}
        onUpdate={HandleUpdate}
        onColumnOrder={handleColumOrder}
      />
      <Toaster />
    </section>
  );
}
