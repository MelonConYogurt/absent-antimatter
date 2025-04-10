import type {User} from "../models/userModel";

export default function TableUsers({
  data,
  loading,
  onDelete,
  onUpdate,
}: {
  data: User[];
  loading: boolean;
  onDelete: (user: User) => void;
  onUpdate: (user: User) => void;
}) {
  return (
    <section className="w-full mb-10">
      <div className="w-full border border-gray-200 overflow-auto rounded-sm shadow-md max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div
            role="status"
            className="inline-flex justify-center items-center w-full my-10"
          >
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-300 animate-spin  fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Cargando...</span>
          </div>
        ) : (
          <>
            {data?.length > 0 ? (
              <table className="w-full text-sm text-left ">
                <thead className="text-xs  border-b border-gray-200 uppercase bg-gray-800 sticky top-0">
                  <tr className="text-white ">
                    <th className="px-6 py-3 font-medium">Id</th>
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Teléfono</th>
                    <th className="px-6 py-3 font-medium">Correo</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="">
                  {data.map((element, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-6 py-4">{element.id}</td>
                      <td className="px-6 py-4 font-medium">{element.name}</td>
                      <td className="px-6 py-4">{element.phone_number}</td>
                      <td className="px-6 py-4">{element.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md ${
                            element.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {element.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => {
                              onDelete(element);
                            }}
                            id="Delete"
                            type="button"
                            className="bg-red-100 text-red-800 px-2 py-1 rounded-md"
                          >
                            <svg
                              className="cursor-pointer"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.2rem"
                              height="1.2rem"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M2 21a8 8 0 0 1 11.873-7" />
                              <circle cx="10" cy="8" r="5" />
                              <path d="m17 17 5 5" />
                              <path d="m22 17-5 5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              onUpdate(element);
                            }}
                            id="update"
                            type="button"
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                          >
                            <svg
                              className="cursor-pointer"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.2rem"
                              height="1.2rem"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                              <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                              <circle cx="10" cy="7" r="4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center h-32 ">
                <p className="text-gray-500">
                  No se encontraron usuarios. Por favor intente más tarde.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
