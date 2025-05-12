import type {client} from "../models/clientModel";
import {
  UserX,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  ArrowDownUp,
} from "lucide-react";
import {useState} from "react";

export default function TableClient({
  data,
  loading,
  onDelete,
  onColumnOrder,
}: {
  data: client[];
  loading: boolean;
  onDelete: (client: client) => void;
  onColumnOrder?: (col: string, orderDirection: string) => void;
}) {
  const [idDirection, setIdDirection] = useState(false);
  const [nameDirection, setNameDirection] = useState(false);
  const [phoneDirection, setPhoneDirection] = useState(false);
  const [emailDirection, setEmailDirection] = useState(false);
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
                          <p>Nombre</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setNameDirection((prev) => !prev);
                                onColumnOrder(
                                  "name",
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
                          <p>Teléfono</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhoneDirection((prev) => !prev);
                                onColumnOrder(
                                  "phone_number",
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
                          <p>Correo</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setEmailDirection((prev) => !prev);
                                onColumnOrder(
                                  "email",
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
                          <p>Estado</p>
                          {onColumnOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDirection((prev) => !prev);
                                onColumnOrder(
                                  "active",
                                  activeDirection ? "ASC" : "DESC"
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
                          {element.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.phone_number}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {element.email}
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
                            <a href={`mailto:${element.email}`}>
                              <button
                                type="button"
                                className="p-1.5 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                              >
                                <Mail className="w-5 h-5" />
                              </button>
                            </a>
                            <a
                              href={`https://wa.me/${element.phone_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button
                                type="button"
                                className="p-1.5 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </button>
                            </a>
                            <a
                              href={`tel:${element.phone_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button
                                type="button"
                                className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              >
                                <Phone className="w-5 h-5" />
                              </button>
                            </a>
                            <button
                              onClick={() => onDelete(element)}
                              aria-label={`Eliminar usuario ${element.name}`}
                              className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                              <UserX className="w-5 h-5" />
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
                <p className="text-gray-500 mb-1">No se encontraro clientes.</p>
                <p className="text-gray-400 text-sm">
                  Por favor intente más tarde o agregue un nuevo usuario.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
