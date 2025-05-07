import type {Product} from "../models/productmodel";
import {useState} from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Trash,
  Package,
  ArrowDownUp,
} from "lucide-react";

export default function TableProducts({
  data,
  loading,
  onDelete,
  onUpdate,
  onActive,
  OnColumOrder,
}: {
  data: Product[];
  loading: boolean;
  OnColumOrder: (col: string, orderDirection: string) => void;
  onDelete: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onActive: (product: Product) => void;
}) {
  const [idDirection, setIdDirection] = useState(false);
  const [nameDirection, setNameDirection] = useState(false);
  const [stockDirection, setStockDirection] = useState(false);
  const [referenceDirection, setReferenceDirection] = useState(false);
  const [categoryDirection, setCategoryDirection] = useState(false);
  const [priceDirection, setPriceDirection] = useState(false);
  const [createdAtDirection, setCreatedAtDirection] = useState(false);
  const [supplierDirection, setSupplierDirection] = useState(false);
  const [activeDirection, setActiveDirection] = useState(false);

  return (
    <section className="w-full mb-10">
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-md bg-white">
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center w-full py-16"
          >
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            <span className="sr-only">Cargando...</span>
          </div>
        ) : (
          <>
            {data?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Id</p>
                          <button
                            type="button"
                            onClick={() => {
                              setIdDirection((prev) => !prev);
                              OnColumOrder("id", idDirection ? "ASC" : "DESC");
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Nombre</p>
                          <button
                            type="button"
                            onClick={() => {
                              setNameDirection((prev) => !prev);
                              OnColumOrder(
                                "name",
                                nameDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Stock</p>
                          <button
                            type="button"
                            onClick={() => {
                              setStockDirection((prev) => !prev);
                              OnColumOrder(
                                "stock",
                                stockDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Referencia</p>
                          <button
                            type="button"
                            onClick={() => {
                              setReferenceDirection((prev) => !prev);
                              OnColumOrder(
                                "reference",
                                referenceDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Categoría</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryDirection((prev) => !prev);
                              OnColumOrder(
                                "category_id",
                                categoryDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Precio</p>
                          <button
                            type="button"
                            onClick={() => {
                              setPriceDirection((prev) => !prev);
                              OnColumOrder(
                                "price",
                                priceDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Fecha de alta</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCreatedAtDirection((prev) => !prev);
                              OnColumOrder(
                                "created_at",
                                createdAtDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Proveedor</p>
                          <button
                            type="button"
                            onClick={() => {
                              setSupplierDirection((prev) => !prev);
                              OnColumOrder(
                                "supplier_id",
                                supplierDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Estado</p>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDirection((prev) => !prev);
                              OnColumOrder(
                                "active",
                                activeDirection ? "ASC" : "DESC"
                              );
                            }}
                          >
                            <ArrowDownUp className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((element, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-gray-500">
                          {element.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {element.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.stock}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.reference}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.category_id}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          ${element.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.created_at}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.supplier_id}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                              element.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {element.active ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Activo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactivo
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDelete(element)}
                              aria-label={`Eliminar producto ${element.name}`}
                              className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onUpdate(element)}
                              aria-label={`Actualizar producto ${element.name}`}
                              className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onActive(element)}
                              aria-label={
                                element.active
                                  ? `Desactivar producto ${element.name}`
                                  : `Activar producto ${element.name}`
                              }
                              className={`p-1.5 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                element.active
                                  ? "text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                                  : "text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                              }`}
                            >
                              {element.active ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="mb-4 p-4 bg-gray-100 rounded-full">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-1">
                  No se encontraron productos.
                </p>
                <p className="text-gray-400 text-sm">
                  Por favor intente más tarde o agregue un nuevo producto.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
