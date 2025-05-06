import TableProducts from "./tableProducts";
import {useState, useEffect} from "react";
import {Toaster, toast} from "sonner";
import type {Product} from "@/models/productmodel";
import SearchProducts from "@/utils/products/searchProducts";
import {ChevronLeft, ChevronRight, Loader2, Search} from "lucide-react";

export default function TableProductsController() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState("");

  useEffect(() => {
    GetProducts();
  }, []);

  async function GetProducts() {
    try {
      setLoading(true);
      // if(searchValue !== ''){
      //   let response = await SearchProducts(offset, limit, searchValue, )
      // }
      let response = await SearchProducts(
        offset,
        limit,
        searchValue ? searchValue : null,
        orderDirection ? orderDirection : null
      );
      console.log("Respuesta de API:", response);

      if (!response) {
        toast.error("No se pudo obtener datos de los productos");
        return;
      }

      if (response.data && response.metadata) {
        setData(response.data);
        setTotalProducts(response.metadata?.total);
        setPage(response.metadata.page);
        toast.success(`Se cargaron ${response.data.length} productos`);
      } else {
        toast.warning("No hay productos disponibles");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error(`Error al cargar productos: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  function handleActive(product: Product) {
    console.log(`Activating product with id: ${product.id}`);
  }

  function HandleDelete(product: Product) {
    console.log(`Deleting product with id: ${product.id}`);
  }

  function HandleUpdate(product: Product) {
    console.log(`Updating product with id: ${product.id}`);
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

  return (
    <section className="w-full flex flex-col gap-6 px-5 py-6 bg-gray-50">
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
          <input
            type="text"
            className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="Buscar cliente por nombre, email..."
            onChange={handleChangeSearInput}
            disabled={loading}
          />
          <Search className="absolute left-3 text-gray-400 w-5 h-5" />
          <button
            className="ml-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            onClick={GetProducts}
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
            Mostrando usuarios {limit} de {totalProducts}
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
              {page} / {Math.ceil(totalProducts / limit)}
            </div>

            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === Math.ceil(totalProducts / limit) || loading}
              onClick={handlePageUp}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <TableProducts
        data={data}
        loading={loading}
        onActive={handleActive}
        onDelete={HandleDelete}
        onUpdate={HandleUpdate}
      />
      <Toaster />
    </section>
  );
}
