
define(['../accUtils', "require", "exports", "knockout", "ojs/ojcore" ,"ojs/ojbootstrap", 
         "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", "ojs/ojtable", "ojs/ojknockout"],
  function (accUtils, require, exports, ko, oj, ojbootstrap_1, 
            ArrayDataProvider, BufferingDataProvider) {
    function UsersViewModel() {
      this.connected = () => {
        document.title = "Users";
      };
      //
      var self = this;
      //
      self.restServerUrl = "https://appydexbackgm.herokuapp.com/api/user/getUsers";
      self.settings = {
        "url": self.restServerUrl,
        "dataType": "json",
        "method": "GET",
        "timeout": 0,
      };
      //
      $.ajax(self.settings).done(function (response) {
        self.userArray = response.data;
        console.log('self.userArray:', self.userArray);
        self.dataprovider = new ArrayDataProvider(self.userArray, {keyAttributes: "id_user"});
        console.log('self.dataprovide:', self.dataprovider);
      });
    }
    //
    return UsersViewModel;
  }
);


/* $.ajax(self.settings).done(function (response) {
         console.log('response.data:', response.data);
         self.userArray = response.data;
         console.log('self.userArray:', self.userArray);
         self.deptObservableArray = ko.observableArray(selfv.userArray);
         self.dataprovider = new BufferingDataProvider( new ArrayDataProvider(self.deptObservableArray, {
           keyAttributes: "id_user" }));
         console.log('self.dataprovide:', self.dataprovider);
       });*/
