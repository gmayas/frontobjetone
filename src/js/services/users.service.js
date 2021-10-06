define([],
  function () {

    // URL de Api Rest
    let restServerUrl = "https://appydexbackgm.herokuapp.com/api/user";
    
    // Función que retorna la informacion de los usuarios (lista)
    const getUsers = async () => {
      return await fetch(`${restServerUrl}/getUsers`);
    }
    // Función que retorna la informacion de creacion usuario 
   const createUser = async (bodyIn) => {
    const paramsJson = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyIn)
    };
    return await fetch(`${restServerUrl}/createUser`, paramsJson);
  };

  // Función que retorna la informacion de modificación usuario 
  // Solo mofica el password del suario
  const modifyPassword = async (id_user, bodyIn) => {
    const paramsJson = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyIn)
    };
    return await fetch(`${restServerUrl}/modifyPassword/${id_user}`, paramsJson);
  };

  // Función que retorna la informacion usuario eliminado full
  const deleteUsers =  async (id_user) => {
    const paramsJson = { method: 'DELETE' };
    return await fetch(`${restServerUrl}/deleteUser/${id_user}`, paramsJson);
  };
  //
  return { getUsers, createUser, modifyPassword, deleteUsers };
  }
);



