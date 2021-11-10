define(["require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider",  'ojs/ojarraytreedataprovider', "text!data/listData.json", "services/datajson.service", "ojs/ojselectsingle"],
  function (require, exports, ko, ojbootstrap_1, ArrayDataProvider, ArrayTreeDataProvider, deptData, datajsonServices) {
    function CustomerViewModel() {
      this.connected = () => {
        document.title = "Customers";
      };
      var self = this;
      self.browsers =  ko.observableArray([]); 
      // 
      self.browsersDP = new ArrayDataProvider(self.browsers, {
        keyAttributes: "value",
       });
      //
      const createUser = async () => {
        try {
          localStorage.removeItem('deptArray');
          const deptArray = JSON.parse(deptData);
          let response = await datajsonServices.createDataJson(deptArray);
          let dataReturn = await response.json();
          setTimeout( async () => {
            const id = 66;
            let getResponse = await datajsonServices.getDataJsonbyId(id);
            let dataJsonReturn = await getResponse.json();
            localStorage.setItem('deptArray', JSON.stringify(dataJsonReturn.data[0].array_json));
            const dataLocal = JSON.parse(localStorage.getItem('deptArray'));
            console.log('dataLocal:', dataLocal);
            self.browsers(dataLocal);
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
