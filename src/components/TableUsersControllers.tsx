// Imports
import React, {useState, useEffect, use} from "react";
import {Toaster, toast} from "sonner";

// Types
import type {User, FormUser} from "../models/userModel";

// Api functions
import AddUser from "../utils/user/addUser";
import TableUsers from "./TableUsers";
import DeleteUser from "@/utils/user/deleteUser";
import UpdateUser from "@/utils/user/updateUser";
import SearchUsers from "@/utils/user/searchUser";
import getUsers from "@/utils/user/fetchUsers";

export default function TableUsersController() {
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Data
  const [usersData, setUsersData] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formUser, setFormUser] = useState<FormUser>({
    email: "",
    name: "",
    phone_number: "",
  });
  const [searchValue, setSearchValue] = useState("");

  // Loading and Validation States
  const [isloading, setIsLoading] = useState(true);
  const [isValidationFinish, SetIsValidationFinish] = useState(true);

  // Pagination
  const limit = 10;
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    getData();
  }, [page]);

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

  async function getData() {
    try {
      let offset = page * limit;
      const data = await getUsers(offset, limit);
      if (!data) return;

      if (data.data) {
        setUsersData(data.data);
        setIsLoading(false);
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
    }
  }

  async function handleAddUser(data: FormUser) {
    SetIsValidationFinish(false);
    const userData = {
      ...data,
      phone_number: data.phone_number,
    };

    const validation = await AddUser(userData);
    if (validation) {
      toast.success("Usuario creado exitosamente");
      getData();
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
    SetIsValidationFinish(true);
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const search = e.target.value;
    setSearchValue(search);
    if (search === "") {
      getData();
    }
  }

  async function handleSearchUser() {
    setIsLoading(true);

    const search = searchValue;
    if (search === "") {
      await getData();
    } else {
      const filteredUsers = await SearchUsers(search, 0, 100);
      if (!filteredUsers) return;
      if (filteredUsers.data) {
        setUsersData(filteredUsers.data);
      } else {
        setUsersData([]);
      }
    }
    setIsLoading(false);
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

    try {
      const result = await DeleteUser({
        id: userToDelete.id,
        email: userToDelete.email,
        name: userToDelete.name,
        phone_number: userToDelete.phone_number,
      });

      if (result) {
        toast.success("Usuario eliminado correctamente");
        await getData();
      } else {
        toast.error("Error al eliminar el usuario");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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
    SetIsValidationFinish(false);

    try {
      const result = await UpdateUser(formUser);
      if (result) {
        toast.success("Usuario actualizado correctamente");
        await getData();
        handleUpdateModal();
      } else {
        toast.error("Error al actualizar el usuario");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }

    SetIsValidationFinish(true);
  }

  return (
    <section className="w-full h-10 flex flex-col justify-between items-start gap-5 px-5 py-5">
      <div className="border-b-2 w-full pb-2">
        <h1 className="text-2xl font-medium">Gestión de Usuarios</h1>
        <p className="text-gray-600">
          Administre usuarios, busque y añada nuevos usuarios al sistema.
        </p>
      </div>
      <nav className="flex justify-between gap-5 w-full ">
        <div className="inline-flex gap-1">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Buscar en la tabla"
            onChange={handleSearchInput}
          />

          <button
            className="border border-gray-300 p-2 rounded-md cursor-pointer"
            onClick={handleSearchUser}
          >
            Buscar
          </button>
        </div>
        <div className="justify-center items-center flex gap-1">
          <button
            className="border border-gray-300 p-2 rounded-md cursor-pointer"
            onClick={() => {
              setPage((prev) => prev - 1);
            }}
          >
            Atras
          </button>
          <div>
            {page}/{Math.ceil(totalItems / limit)}
          </div>
          <button
            className="border border-gray-300 p-2 rounded-md cursor-pointer"
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            Adelante
          </button>
        </div>
        <button
          className="border border-gray-300 rounded-md p-2 cursor-pointer inline-flex gap-2 justify-center items-center"
          onClick={handleModal}
        >
          <span>
            <svg
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </span>
          Agregar usuario
        </button>
      </nav>

      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center"
        style={{
          visibility: isModalOpen ? "visible" : "hidden",
          zIndex: 10,
        }}
      >
        <div className="bg-white p-6 rounded-lg w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer "
            onClick={handleModal}
            disabled={!isValidationFinish}
            style={{
              cursor: isValidationFinish ? "pointer" : "not-allowed",
            }}
          >
            ✕
          </button>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
            <p className="text-gray-500">
              Complete el siguiente formulario para crear un nuevo usuario
            </p>
          </div>
          <form
            className="flex flex-col justify-center items-start gap-2"
            onSubmit={handleFormUser}
          >
            <label htmlFor="name" className="flex flex-col gap-2 w-full">
              Nombre:
              <input
                onChange={handleForm}
                value={formUser.name}
                type="text"
                required
                id="name"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese nombre de usuario"
              />
            </label>
            <label
              htmlFor="phone_number"
              className="flex flex-col gap-2 w-full"
            >
              Número de Teléfono:
              <input
                onChange={handleForm}
                value={formUser.phone_number}
                type="text"
                required
                id="phone_number"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese número de teléfono"
              />
            </label>
            <label htmlFor="email" className="flex flex-col gap-2 w-full">
              Correo:
              <input
                onChange={handleForm}
                value={formUser.email}
                required
                type="email"
                id="email"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese dirección de correo"
              />
            </label>
            <button
              type="submit"
              style={{
                cursor: isValidationFinish ? "pointer" : "not-allowed",
              }}
              disabled={!isValidationFinish}
              className="border border-gray-400 w-full p-2 mt-5 rounded-md cursor-pointer"
            >
              Aceptar
            </button>
          </form>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center"
        style={{
          visibility: isUpdateModalOpen ? "visible" : "hidden",
          zIndex: 10,
        }}
      >
        <div className="bg-white p-6 rounded-lg w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
            onClick={handleUpdateModal}
            disabled={!isValidationFinish}
            style={{
              cursor: isValidationFinish ? "pointer" : "not-allowed",
            }}
          >
            ✕
          </button>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Actualizar usuario</h2>
            <p className="text-gray-500">
              Edita los campos necesarios para validar la actualización
            </p>
          </div>
          <form
            className="flex flex-col justify-center items-start gap-2"
            onSubmit={handleUpdateUser}
          >
            <label htmlFor="name" className="flex flex-col gap-2 w-full">
              Nombre:
              <input
                onChange={handleForm}
                value={formUser.name}
                type="text"
                required
                id="name"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese nombre de usuario"
              />
            </label>
            <label
              htmlFor="phone_number"
              className="flex flex-col gap-2 w-full"
            >
              Número de Teléfono:
              <input
                onChange={handleForm}
                value={formUser.phone_number}
                type="text"
                required
                id="phone_number"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese número de teléfono"
              />
            </label>
            <label htmlFor="email" className="flex flex-col gap-2 w-full">
              Correo:
              <input
                onChange={handleForm}
                value={formUser.email}
                required
                type="email"
                id="email"
                className="border border-gray-200 p-2 rounded-md"
                placeholder="Ingrese dirección de correo"
              />
            </label>
            <button
              type="submit"
              style={{
                cursor: isValidationFinish ? "pointer" : "not-allowed",
              }}
              disabled={!isValidationFinish}
              className="border border-gray-400 w-full p-2 mt-5 rounded-md cursor-pointer"
            >
              Aceptar
            </button>
          </form>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center"
        style={{
          visibility: isDeleteModalOpen ? "visible" : "hidden",
          zIndex: 10,
        }}
      >
        <div className="bg-white p-6 rounded-lg w-96 relative">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Confirmar eliminación</h2>
            <p className="text-gray-500 mt-2">
              ¿Estás seguro que deseas eliminar al usuario {userToDelete?.name}?
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="border border-gray-300 px-4 py-2 rounded-md cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <section className="w-full">
        <TableUsers
          loading={isloading}
          data={usersData}
          onDelete={handleDeleteUser}
          onUpdate={handleFormUpdateUser}
        />
      </section>
      <Toaster />
    </section>
  );
}
