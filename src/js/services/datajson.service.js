define([],
  function () {

    // URL de Api Rest
    let restServerUrl = "http://localhost:3000/api/dataJson";
    
    //
    const getDataJsonbyId = async (id) => {
      return await fetch(`${restServerUrl}/getDataJsonbyId/${id}`);
    }
    // 
   const createDataJson = async (jsonIn) => {
    const paramsJson = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "array_json": jsonIn })
    };
    //
    return await fetch(`${restServerUrl}/createDataJson`, paramsJson);
  };
  //
  return { getDataJsonbyId, createDataJson };
  }
);



