
define(["services/users.service", "../accUtils", "require", "exports", "knockout", "ojs/ojcore", "ojs/ojbootstrap",
  "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", "text!data/users.json", "ojs/ojtable", "ojs/ojknockout"],
  function (usersServices, accUtils, require, exports, ko, oj, ojbootstrap_1,
    ArrayDataProvider, BufferingDataProvider, deptData) {
    function UsersViewModel() {
      //
      let self = this;
      //
      const usersData = async () => {
        let response = await usersServices.getUsers();
        let dataReturn = await response.json();
        self.userArray = dataReturn.data;
        self.dataprovider = new ArrayDataProvider(self.userArray, { keyAttributes: "id_user" });
      }
      //     
      usersData();
      console.log('self:', self)
      //
      this.connected = () => {
        document.title = "Users";
      };
    }
    //
    return UsersViewModel;
    //
  }
);