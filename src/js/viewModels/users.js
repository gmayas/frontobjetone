
define(["services/users.service", "../accUtils", "require", "exports", "knockout", "ojs/ojcore", "ojs/ojbootstrap",
  "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojanimation", 
  "ojs/ojtable", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojformlayout", "ojs/ojlabelvalue", 
  "ojs/ojinputsearch", "ojs/ojvalidationgroup", "ojs/ojrefresher", "ojs/ojpagingcontrol"],
  function (usersServices, accUtils, require, exports, ko, oj, ojbootstrap_1,
    ArrayDataProvider, BufferingDataProvider, ListDataProviderView, ojdataprovider_1, AnimationUtils) {
    function UsersViewModel() {
      //
      let self = this;
      this.filter = ko.observable("");
      this.labelEdge = ko.observable();
      this.labelWrapTruncateNo = ko.observable("no");
      this.longLabel = ko.observable("no");
      this.booleans = ko.observableArray([]);
      this.formControlDisabledState = ko.observable("no");
      this.valueLength = ko.observable("short");
      this.formState = ko.observable("enabled");
      this.formControls = ko.observableArray([]);
      this.stylesBooleans = ko.observableArray([]);
      this.groupValid = ko.observable();
      this.inputIdUser = ko.observable();
      this.inputNameUser = ko.observable();
      this.inputEmailUser = ko.observable();
      this.inputPassword = ko.observable();
      this.required = ko.observable(true);
      this.messageNameUser = ko.observable([{}]);
      this.messageEmailUser = ko.observable([{}]);
      this.messagePasswordUser = ko.observable([{}]);
      this.disableFormControls = {
        idUser: true,
        NameUser: false,
        EmailUser: false,
        PasswordUser: false
      };
      this.actionButton = {
        label: 'Add user', 
        chroming:'danger',
        style: "button-green" //null  
      }
      // 
      self.userArray = ko.observableArray([]);
      self.dataprovider = ko.computed(() => {
        let filterCriterion = null;
        if (this.filter() && this.filter() != "") {
          filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
            filterDef: { text: this.filter() },
          });
        }
        const arrayDataProvider = new ArrayDataProvider(self.userArray, { keyAttributes: "id_user", implicitSort: [{ attribute: "id_user", direction: "descending" }] });
        return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
      }, this);
      //
      //
      // Función que retorna la informacion de los usuarios (lista)
      const getUsers = async () => {
        let response = await usersServices.getUsers();
        let dataReturn = await response.json();
        self.userArray(dataReturn.data);
      }

      // Función que retorna la informacion de creacion usuario 
      const createUser = async (bodyIn) => {
        try {
            //Create user
            let response = await usersServices.createUser(bodyIn);
            let dataReturn = await response.json();
            getUsers();
            this.filter(bodyIn.name_user);
            //$("#table").ojTable("refresh");
            //document.getElementById('table').refresh();
        } catch (e) {
            console.log('Error respose: ', e)
       }
      }

      // Función que retorna la informacion de modificación usuario 
      // Solo mofica el password del suario
      const modifyPassword = async (id_user, bodyIn) => {
          try {
            //Modify user
            let response = await usersServices.modifyPassword(id_user, bodyIn);
            let dataReturn = await response.json();
          } catch (e) {      
            console.log('Error respose: ', e)
        }
      }

      // Función asincrona para eliminar la informacion completa del usuario
      const deleteUser = async () => {
          try {
               //Delete user
               let response = await usersServices.deleteUsers(this.delUserSel.id_user);
               let dataReturn = await response.json();
          } catch (e) {
                 console.log('Error respose: ', e)
        }
      }
     
      //
      this.handleValueChanged = () => {
        this.filter(document.getElementById("filter").rawValue);
      };
      //
      this.highlightingCellRenderer = (context) => {
        let field = null;
        if (context.columnIndex === 0) {
          field = "id_user";
        }
        else if (context.columnIndex === 1) {
          field = "name_user";
        }
        else if (context.columnIndex === 2) {
          field = "email_user";
        }
        else if (context.columnIndex === 3) {
          field = "password_user";
        }
        let data = context.row[field].toString();
        const filterString = this.filter();
        let textNode;
        let spanNode = document.createElement("span");
        if (filterString && filterString.length > 0) {
          const index = data.toLowerCase().indexOf(filterString.toLowerCase());
          if (index > -1) {
            const highlightedSegment = data.substr(index, filterString.length);
            if (index !== 0) {
              textNode = document.createTextNode(data.substr(0, index));
              spanNode.appendChild(textNode);
            }
            let bold = document.createElement("b");
            textNode = document.createTextNode(highlightedSegment);
            bold.appendChild(textNode);
            spanNode.appendChild(bold);
            if (index + filterString.length !== data.length) {
              textNode = document.createTextNode(data.substr(index + filterString.length, data.length - 1));
              spanNode.appendChild(textNode);
            }
          }
          else {
            textNode = document.createTextNode(data);
            spanNode.appendChild(textNode);
          }
        }
        else {
          textNode = document.createTextNode(data);
          spanNode.appendChild(textNode);
        }
        context.parentElement.appendChild(spanNode);
      };
      //
      self.tableColumns = [{ "headerText": "User Id", renderer: this.highlightingCellRenderer },
      { "headerText": "Name", renderer: this.highlightingCellRenderer },
      { "headerText": "Email", renderer: this.highlightingCellRenderer },
      { "headerText": "Password", renderer: this.highlightingCellRenderer }];
      //  
      this.newUserData = () => {
        this.inputIdUser(0);
        this.inputNameUser(null);
        this.inputEmailUser(null);
        this.inputPassword(null);
      };
      
      this.addNewDialog = (event) =>{
        this.newUserData();
        document.getElementById("modalDialog1").open();
      };
      //
      this.cancelUserDialog = (event) => {
        document.getElementById("modalDialog1").close();
        this.newUserData();
      };

      this.valueForm = ko.computed(() => {
        let dataVal = ((!this.inputNameUser()
                        || !this.inputEmailUser()
                        || !this.inputPassword()         
                        ) || this.groupValid() === "invalidShown")
        return dataVal;
      });

      this.validateEmail = (email) => {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
          return true;
        } else {
          return false;
        }
      };

      this.okUserDialog = (event) => {
        console.log('this.valueForm:', this.valueForm())
        console.log('this.groupValid():', this.groupValid())
        const error = [{ summary: "summary", detail: "Is required", severity: "error" }];  
        const warningEmail = [{ summary: "summary", detail: "Basic email format: user@email.com", severity: "warning" }];
        //const info = [{ summary: "summary", detail: "detail", severity: "info" }];
        //const confirmation = [{ summary: "summary", detail: "detail", severity: "confirmation" }];
        const newData = {
          id_user: this.inputIdUser(),
          name_user: this.inputNameUser(),
          email_user: this.inputEmailUser(),
          password_user: this.inputPassword()
        }; 
        if (!this.valueForm()) {
          console.log('newData:', newData)
          console.log('!this.validateEmail(newData.email_user):', !this.validateEmail(newData.email_user))
          if (!this.validateEmail(newData.email_user)){
              this.messageEmailUser(warningEmail); 
          } else {
            //createUser, modifyPassword, deleteUser
            if (newData.id_user == 0) {
              createUser(newData);
            } else {
              modifyPassword(newData.id_user, newData);
            }
            this.newUserData();
            document.getElementById("modalDialog1").close();
          }
        } else {
           if (!this.inputNameUser()) {
              console.log('!this.inputNameUser(): ', !this.inputNameUser())
              this.messageNameUser(error);
           };                     
           if (!this.inputEmailUser()){
              console.log('!this.inputEmailUser(): ', !this.inputEmailUser())
              this.messageEmailUser(error);
           };
           if (!this.inputEmailUser()) {
              console.log('!this.inputEmailUser(): ', !this.inputEmailUser())
              this.messagePasswordUser(error);
           };
        }
      };
      //
      this.labelEdge.subscribe(function (newVal) {
        if (newVal === "inside") {
            if (this.booleans.indexOf("definition") !== -1) {
                this.booleans.remove("definition");
            }
            if (this.booleans.indexOf("source") !== -1) {
                this.booleans.remove("source");
            }
        }
       }, this);
      //
      this.labelPrefix = ko.computed(() => {
        const startOrTopLabelEdge = this.labelEdge() === "start" || this.labelEdge() === "top";
        const labelShort = this.labelWrapTruncateNo() === "no";
        if ((!startOrTopLabelEdge && this.longLabel() === "no") ||
            (startOrTopLabelEdge && labelShort)) {
            return "";
        }
        return ("This is a really really really really really really really really really really " +
            "really really really really really really superlong label for ");
      });
      //
      this.labelId = ko.computed(() => {
        return this.labelPrefix() + "Id User";
      });
      //
      this.labelName = ko.computed(() => {
        return this.labelPrefix() + "Name User";
      });
      //
      this.labelEmail = ko.computed(() => {
        return this.labelPrefix() + "Email User";
      });
      //
      this.labelPassword = ko.computed(() => {
        return this.labelPrefix() + "Password User";
      });
      //
      //      
      getUsers();
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