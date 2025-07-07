import {useState, useEffect} from "react";
import SearchClients from "@/utils/client/searchClients";
import type {client} from "../models/clientModel";
import TableClient from "./tableClients";
import DeleteClient from "@/utils/client/deleteClient";
import {Toaster, toast} from "sonner";

import {Search, ChevronLeft, ChevronRight, X, Loader2} from "lucide-react";

export default function TableClientController() {
  const [Data, setData] = useState<client[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCLient, setTotalClient] = useState(0);
  const [page, setPage] = useState(0);
  const [clientTodelete, setClientToDelete] = useState<client>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDirection, setOrderDirection] = useState<string | undefined>();
  const [column, setColumn] = useState<string | undefined>();

  useEffect(() => {
    getClient();
  }, [offset, limit, column, orderDirection]);

  useEffect(() => {
    if (searchValue === "") {
      getClient();
    }
  }, [searchValue]);

  async function getClient() {
    try {
      setLoading(true);
      let response = await SearchClients(
        offset,
        limit,
        searchValue !== "" ? searchValue : null,
        column ? column : null,
        orderDirection ? orderDirection : null
      );
      if (response) {
        if (response.data) {
          setData(response.data);
        } else {
          toast.error("Ha ocurrido un error");
        }

        if (response.metadata) {
          setTotalClient(response.metadata.total);
          setPage(response.metadata.page);
        }
      } else {
        toast.error("Ha ocurrido un error");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    try {
      setIsSubmitting(true);

      if (!clientTodelete) return;

      let response = await DeleteClient(clientTodelete.id);
      if (response) {
        if (response.success) {
          toast.success(`Se ha eliminado el cliente ${clientTodelete.name}`);
          getClient();
        }
      }
    } catch (error) {
      toast.error("error");
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  }

  async function handleDelete(client: client) {
    try {
      setIsDeleteModalOpen(true);
      setClientToDelete(client);
    } catch (error) {
      toast.error("error");
    } finally {
    }
  }

  function handleChangeSearInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function handleSearchReset() {
    setSearchValue("");
  }

  function handleColumnOrder(col: string, colDirection: string) {
    setColumn(col);
    setOrderDirection(colDirection);
  }

  function handlePageUp() {
    setOffset((prev) => prev + limit);
  }

  function handlePageDown() {
    setOffset((prev) => prev - limit);
  }

  return (
    <section className="p-5 flex flex-col gap-5">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de clientes
        </h1>
        <p className="text-gray-600 mt-1">
          Administre clientes, busque o elimine clientes.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <div className="relative flex items-center w-full md:w-auto">
          <div className="flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2.5">
            <Search className=" text-gray-400 w-5 h-5 cursor-pointer" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre, email..."
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
            onClick={getClient}
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
            Mostrando {page > 0 ? limit * (page + 1) : limit} de {totalCLient}{" "}
            clientes
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
              {page} / {Math.ceil(totalCLient / limit)}
            </div>

            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === Math.ceil(totalCLient / limit) || loading}
              onClick={handlePageUp}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirmar eliminación
                </h2>
                <p className="text-gray-500 mt-2">
                  {clientTodelete?.active ? (
                    <>
                      ¿Estás seguro que deseas eliminar al usuario{" "}
                      <span className="font-medium">
                        {clientTodelete?.name}
                      </span>
                      ?
                    </>
                  ) : (
                    <>
                      ¿Estás seguro que deseas activar al usuario{" "}
                      <span className="font-medium">
                        {clientTodelete?.name}
                      </span>
                      ?
                    </>
                  )}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TableClient
        data={Data}
        loading={loading}
        onDelete={handleDelete}
        onColumnOrder={handleColumnOrder}
      />
      <Toaster />
    </section>
  );
}
