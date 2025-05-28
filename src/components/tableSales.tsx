import type {Sale} from "../models/saleModel";
import {UserX, UserCog, Loader2, ArrowDownUp, Edit, Trash} from "lucide-react";
import {useState} from "react";

export default function TableSales({
  data,
  loading,
  onDelete,
  onUpdate,
  onColumnOrder,
}: {
  data: Sale[];
  loading: boolean;
  onDelete: (sale: Sale) => void;
  onUpdate: (sale: Sale) => void;
  onColumnOrder?: (col: string, orderDirection: string) => void;
}) {
  const [idDirection, setIdDirection] = useState(false);
  const [nameDirection, setNameDirection] = useState(false);
  const [phoneDirection, setPhoneDirection] = useState(false);
  const [emailDirection, setEmailDirection] = useState(false);
  const [roleDirection, setRoleDirection] = useState(false);

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
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setIdDirection((prev) => !prev);
                                onColumnOrder(
                                  "id",
                                  idDirection ? "ASC" : "DESC"
                                );
                              }}
                            >
                              <ArrowDownUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Id cliente</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setNameDirection((prev) => !prev);
                                onColumnOrder(
                                  "client_id",
                                  nameDirection ? "ASC" : "DESC"
                                );
                              }}
                            >
                              <ArrowDownUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Id usuario</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhoneDirection((prev) => !prev);
                                onColumnOrder(
                                  "user_id",
                                  phoneDirection ? "ASC" : "DESC"
                                );
                              }}
                            >
                              <ArrowDownUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Fecha de venta</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setEmailDirection((prev) => !prev);
                                onColumnOrder(
                                  "sale_date",
                                  emailDirection ? "ASC" : "DESC"
                                );
                              }}
                            >
                              <ArrowDownUp className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 font-medium">
                        <div className="inline-flex justify-between items-center gap-2 ">
                          <p>Total</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setRoleDirection((prev) => !prev);
                                onColumnOrder(
                                  "total",
                                  roleDirection ? "ASC" : "DESC"
                                );
                              }}
                            >
                              <ArrowDownUp className="w-3 h-3" />
                            </button>
                          )}
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
                          {element.client_id}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.user_id}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.sale_date}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.total}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDelete(element)}
                              className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onUpdate(element)}
                              className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <Edit className="w-5 h-5" />
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
                  <UserX className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-1">No se encontraron ventas.</p>
                <p className="text-gray-400 text-sm">
                  Por favor intente más tarde.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
