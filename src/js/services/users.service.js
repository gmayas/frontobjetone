define([],
  function () {

    let restServerUrl = "https://appydexbackgm.herokuapp.com/api/user";

    const getUsers = async () => {
      return await fetch(`${restServerUrl}/getUsers`);
    }

    return { getUsers };
    
  }
);



