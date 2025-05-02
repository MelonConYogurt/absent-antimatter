// Imports
import type React from "react";
import {useState, useEffect} from "react";
import {Toaster, toast} from "sonner";
import {
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";

// Types
import type {User, FormUser} from "../models/userModel";

// Api functions
import AddUser from "../utils/user/addUser";
import TableUsers from "./TableUsers";
import DeleteUser from "@/utils/user/deleteUser";
import UpdateUser from "@/utils/user/updateUser";
import SearchUsers from "@/utils/user/searchUser";
import ActiveChange from "@/utils/user/aciveChange";

export default function TableUsersController() {
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isActiveChangeModalOpen, setIsActiveModalOpen] = useState(false);

  // Data
  const [usersData, setUsersData] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToChangeActive, setUserToChangeActive] = useState<User | null>(
    null
  );
  const [formUser, setFormUser] = useState<FormUser>({
    email: "",
    name: "",
    phone_number: "",
  });
  const [searchValue, setSearchValue] = useState("");

  // Loading and Validation States
  const [isLoading, setIsLoading] = useState(false);
  const [isValidationFinish, setIsValidationFinish] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;
  const offset = page * limit;
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (searchValue === "") {
      fetchUsers();
    }
  }, [searchValue]);

  async function fetchUsers() {
    setIsLoading(true);
    setIsValidationFinish(false);
    try {
      const data = await SearchUsers(
        offset,
        limit,
        searchValue !== "" ? searchValue : null
      );
      if (!data) return;

      if (data.data) {
        setUsersData(data.data);
        if (data.metadata?.total) {
          setTotalItems(data.metadata.total);
        }
      } else {
        toast.error(
          `Error al cargar usuarios, por favor intente recargar la página. ${
            data.error ? data.error : ""
          }`
        );
      }
    } catch (error) {
      toast.error(
        `Error, por favor reporte al soporte. Tipo de error: ${error}`
      );
    } finally {
      setIsLoading(false);
      setIsValidationFinish(true);
    }
  }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setFormUser((prev) => ({...prev, [e.target.id]: e.target.value}));
  }

  function handleModal() {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      setFormUser({
        email: "",
        name: "",
        phone_number: "",
      });
    }
  }

  function handleUpdateModal() {
    setIsUpdateModalOpen((prev) => !prev);
  }

  async function handleAddUser(data: FormUser) {
    setIsSubmitting(true);
    setIsValidationFinish(false);

    try {
      const userData = {
        ...data,
        phone_number: data.phone_number,
      };

      const validation = await AddUser(userData);
      if (validation) {
        toast.success("Usuario creado exitosamente");
        fetchUsers();
        setFormUser({
          email: "",
          name: "",
          phone_number: "",
        });
        handleModal();
      } else {
        toast.error(
          "Error al agregar usuario. Por favor verifique los datos, especialmente el correo, e intente nuevamente."
        );
        setFormUser({
          email: "",
          name: "",
          phone_number: "",
        });
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
      setIsValidationFinish(true);
    }
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const search = e.target.value;
    setSearchValue(search);
  }

  async function handleSearchUser() {
    setIsLoading(true);

    try {
      await fetchUsers();
    } catch (error) {
      toast.error(`Error en la búsqueda: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleAddUser(formUser);
  }

  async function handleDeleteUser(user: User) {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;
    setIsSubmitting(true);

    try {
      const result = await DeleteUser({
        id: userToDelete.id,
        email: userToDelete.email,
        name: userToDelete.name,
        phone_number: userToDelete.phone_number,
      });

      if (result) {
        toast.success("Usuario eliminado correctamente");
        await fetchUsers();
      } else {
        toast.error("Error al eliminar el usuario");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setIsSubmitting(false);
    }
  }

  async function handleFormUpdateUser(user: User) {
    try {
      setFormUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      });

      setIsUpdateModalOpen(true);
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }

  async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setIsValidationFinish(false);

    try {
      const result = await UpdateUser(formUser);
      if (result) {
        toast.success("Usuario actualizado correctamente");
        await fetchUsers();
        handleUpdateModal();
      } else {
        toast.error("Error al actualizar el usuario");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
      setIsValidationFinish(true);
    }
  }

  async function handleActiveStateChange(user: User) {
    setUserToChangeActive(user);
    setIsActiveModalOpen(true);
  }

  async function confirmActiveChange() {
    if (!userToChangeActive) return;
    setIsSubmitting(true);

    try {
      const result = await ActiveChange(userToChangeActive);
      if (result) {
        if (result.success) {
          toast.success(
            `Se ha ${
              userToChangeActive.active ? "desactivado" : "activado"
            } el usuario ${userToChangeActive.name}`
          );
          await fetchUsers();
        } else {
          toast.error("Error al cambiar el estado del usuario");
        }
      } else {
        toast.error("Error al cambiar el estado del usuario");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsActiveModalOpen(false);
      setUserToChangeActive(null);
      setIsSubmitting(false);
    }
  }

  function handlePageUp() {
    if (isValidationFinish) {
      setPage((prev) => prev + 1);
    }
  }

  function handlePageDown() {
    if (isValidationFinish) {
      setPage((prev) => prev - 1);
    }
  }

  return (
    <section className="w-full flex flex-col gap-6 px-5 py-6 bg-gray-50">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600 mt-1">
          Administre usuarios, busque y añada nuevos usuarios al sistema.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <div className="relative flex items-center w-full md:w-auto">
          <input
            type="text"
            className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="Buscar usuario por nombre, email..."
            onChange={handleSearchInput}
            value={searchValue}
          />
          <Search className="absolute left-3 text-gray-400 w-5 h-5" />
          <button
            className="ml-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            onClick={handleSearchUser}
            disabled={isLoading}
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="text-gray-600 text-sm whitespace-nowrap">
            Mostrando {Math.min(limit, usersData.length)} de {totalItems}{" "}
            usuarios
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page < 1 || !isValidationFinish}
              onClick={handlePageDown}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm font-medium">
              {page + 1} / {totalPages || 1}
            </div>

            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page >= totalPages - 1 || !isValidationFinish}
              onClick={handlePageUp}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            className="w-full md:w-auto px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            onClick={handleModal}
          >
            <UserPlus className="w-5 h-5" />
            <span>Agregar usuario</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Crear nuevo usuario
                </h2>
                <p className="text-gray-500 mt-1">
                  Complete el siguiente formulario para crear un nuevo usuario
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                onClick={handleModal}
                disabled={isSubmitting}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleFormUser}>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  onChange={handleForm}
                  value={formUser.name}
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
                  Número de Teléfono
                </label>
                <PhoneInput
                  defaultCountry="ua"
                  value={formUser.phone_number}
                  onChange={(phone) =>
                    setFormUser((prev) => ({...prev, phone_number: phone}))
                  }
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo
                </label>
                <input
                  onChange={handleForm}
                  value={formUser.email}
                  required
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese dirección de correo"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 mt-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Crear usuario"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Actualizar usuario
                </h2>
                <p className="text-gray-500 mt-1">
                  Edita los campos necesarios para validar la actualización
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                onClick={handleUpdateModal}
                disabled={isSubmitting}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleUpdateUser}>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  onChange={handleForm}
                  value={formUser.name}
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
                  Número de Teléfono
                </label>
                <input
                  onChange={handleForm}
                  value={formUser.phone_number}
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
                  Correo
                </label>
                <input
                  onChange={handleForm}
                  value={formUser.email}
                  required
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Ingrese dirección de correo"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 mt-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Actualizar usuario"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirmar eliminación
                </h2>
                <p className="text-gray-500 mt-2">
                  ¿Estás seguro que deseas eliminar al usuario{" "}
                  <span className="font-medium">{userToDelete?.name}</span>?
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isActiveChangeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirmar cambio de estado
                </h2>
                <p className="text-gray-500 mt-2">
                  ¿Estás seguro que deseas{" "}
                  {userToChangeActive?.active ? "desactivar" : "activar"} al
                  usuario{" "}
                  <span className="font-medium">
                    {userToChangeActive?.name}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsActiveModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmActiveChange}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Aceptar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TableUsers
        loading={isLoading}
        data={usersData}
        onDelete={handleDeleteUser}
        onUpdate={handleFormUpdateUser}
        onActive={handleActiveStateChange}
      />

      <Toaster position="bottom-right" closeButton />
    </section>
  );
}
