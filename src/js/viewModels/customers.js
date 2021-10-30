define(["require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider",  'ojs/ojarraytreedataprovider', "text!data/treeViewData.json", "services/datajson.service"],
  function (require, exports, ko, ojbootstrap_1, ArrayDataProvider, ArrayTreeDataProvider, deptData, datajsonServices) {
    function CustomerViewModel() {
      this.connected = () => {
        document.title = "Customers";
      };
      var self = this;
      //
      const createUser = async () => {
        try {
          const deptArray = JSON.parse(deptData);
          let response = await datajsonServices.createDataJson(deptArray);
          let dataReturn = await response.json();
          setTimeout( async () => {
            const id = 36;
            let getResponse = await datajsonServices.getDataJsonbyId(id);
            let dataJsonReturn = await getResponse.json();
            console.log('dataJsonReturn: ', dataJsonReturn.data[0].array_json)
            document.getElementById('dataResp').innerHTML = JSON.stringify(dataJsonReturn.data[0].array_json);
          }, 2000);
        } catch (e) {
          console.log('Error respose: ', e)
        }
      }
      //
      createUser();
      //
    }
    //
    return CustomerViewModel;
  }
);
