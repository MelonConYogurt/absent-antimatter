import TableProducts from "./tableProducts";
import {useState, useEffect} from "react";
import {Toaster, toast} from "sonner";
import type {Product, ProductUpdate} from "@/models/productmodel";
import SearchProducts from "@/utils/products/searchProducts";
import {ChevronLeft, ChevronRight, Loader2, Search, X} from "lucide-react";
import UpdateProduct from "@/utils/products/updateProduct";
import DeleteProduct from "@/utils/products/deleteProduct";
import toggleActiveStateProduct from "@/utils/products/toggleActiveStateProduct";

export default function TableProductsController() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<string | undefined>();
  const [column, setColumn] = useState<string | undefined>();
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<ProductUpdate>({
    id: 0,
    name: "",
    stock: 0,
    reference: "",
    category_id: 0,
    price: 0,
    supplier_id: 0,
  });

  useEffect(() => {
    GetProducts();
  }, [offset, column, orderDirection]);

  useEffect(() => {
    if (searchValue === "") {
      GetProducts();
    }
  }, [searchValue]);

  async function GetProducts() {
    try {
      setLoading(true);
      let response = await SearchProducts(
        offset,
        limit,
        searchValue ? searchValue : null,
        column ? column : null,
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

  async function handleActive(product: Product) {
    console.log(`Activating product with id: ${product.id}`);
    const response = await toggleActiveStateProduct(product.id);
    if (response) {
      toast.success(
        `Change made succesfull: Product has been ${!product.active}`
      );
      GetProducts();
    } else {
      toast.error("Error al eliminar el producto");
    }
  }

  async function HandleDelete(product: Product) {
    console.log(`Deleting product with id: ${product.id}`);
    const response = await DeleteProduct(product.id);
    if (response) {
      toast.success(`Delete was succesfull: Product deleted: ${product.name}`);
      GetProducts();
    } else {
      toast.error("Error al eliminar el producto");
    }
  }

  async function HandleUpdate() {
    setLoading(true);
    try {
      const response = await UpdateProduct(productToUpdate);
      if (response) {
        toast.success(
          `Producto ${productToUpdate.name} actualizado correctamente`
        );
        GetProducts();
      } else {
        toast.error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error(`Error al actualizar: ${String(error)}`);
    } finally {
      setLoading(false);
    }
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
    console.log(`Col: ${col}, direction: ${colDirection}`);
  }

  function handleSearchReset() {
    setSearchValue("");
  }

  function handleOpenUpdateModal() {
    setIsModalUpdateOpen((prev) => !prev);
  }

  function handleStateProdutToUpdate(product: Product) {
    handleOpenUpdateModal();

    setProductToUpdate(() => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      reference: product.reference,
      category_id: product.category_id,
      price: product.price,
      supplier_id: product.supplier_id,
    }));
  }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setProductToUpdate((prev) => ({...prev, [e.target.id]: e.target.value}));
  }

  return (
    <section className="w-full flex flex-col gap-6 px-5 py-6 bg-gray-50">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Productos
        </h1>
        <p className="text-gray-600 mt-1">Administre.</p>
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
        onUpdate={handleStateProdutToUpdate}
        OnColumOrder={handleColumOrder}
      />
      <Toaster />

      {isModalUpdateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Actualizar producto
                </h2>
                <p className="text-gray-500 mt-1">
                  Edita los campos necesarios para validar la actualización
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                onClick={handleOpenUpdateModal}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={HandleUpdate}>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.name}
                  type="text"
                  required
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese nombre de usuario"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  stock
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.stock}
                  type="text"
                  required
                  id="phone_number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese número de teléfono"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.reference}
                  required
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese dirección de correo"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.category_id}
                  type="number"
                  required
                  id="category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese ID de categoría"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Precio
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.price}
                  type="number"
                  required
                  id="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese precio"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="supplier_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Proveedor
                </label>
                <input
                  onChange={handleForm}
                  value={productToUpdate.supplier_id}
                  type="number"
                  required
                  id="supplier_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese ID de proveedor"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 mt-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                "Actualizar usuario"
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
