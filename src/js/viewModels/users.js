
define(["services/users.service", "../accUtils", "require", "exports", "knockout", "ojs/ojcore", "ojs/ojbootstrap",
  "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", "text!data/users.json", "ojs/ojtable", "ojs/ojknockout"],
  function (usersServices, accUtils, require, exports, ko, oj, ojbootstrap_1,
    ArrayDataProvider, BufferingDataProvider, deptData) {
     function UsersViewModel() {
      //
      let self = this;
      //
      self.tableColumns = [{ "headerText": "User Id", "field": "id_user" },
      { "headerText": "Name", "field": "name_user" },
      { "headerText": "Email", "field": "email_user" },
      { "headerText": "Password", "field": "password_user" }];

      self.userArray = ko.observableArray([]);
      self.dataprovider = new ArrayDataProvider(self.userArray, {
        keyAttributes: "id_user",
        implicitSort: [{ attribute: "id_user", direction: "ascending" }]
      });
      //
      function UpdateTable() {
        //call api
        self.restServerUrl = "https://appydexbackgm.herokuapp.com/api/user/getUsers";
        self.settings = {
          "url": self.restServerUrl,
          "method": "GET"
        };
        //
        //let jsondataprovider = [];
        $.ajax(self.settings).done(function (response) {
          jsondataprovider = response.data;
          console.log('response.data;: ', response.data);
          self.userArray(response.data);
        });
      }
      //     
      UpdateTable();
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