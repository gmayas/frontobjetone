
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
      this.filterAll = ko.observable("");
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
      this.editRow = ko.observable({ rowKey: null });
      this.firstSelected = ko.observable();
      this.groupValid = ko.observable();
      
      this.disableIdUser = ko.observable(true);
      this.disableNameUser = ko.observable(false);
      this.disableEmailUser = ko.observable(false);
      this.disablePasswordUser = ko.observable(false);
      
      this.actionButtonChroming = ko.observable('danger');
      this.actionLabelCU = ko.observable('Add user'); 
      this.actionStyleCU = ko.observable("button-green"); //null
      this.actionDisabledCU = ko.observable(false);
      this.actionLabelDel = ko.observable('Delete user'); 
      this.actionStyleDel = ko.observable("button-red"); //null
      this.actionDisabledDel = ko.observable(true);    
      //
      // 
      self.userArray = ko.observableArray([]);
      self.dataprovider = ko.computed(() => {
        let filterCriterion = null;
        if ((this.filter() && this.filter() != "")) {
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
            setTimeout(() => { this.filter(bodyIn.name_user); }, 2000);
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
            getUsers();
            this.filter(bodyIn.name_user);
            setTimeout(() => { this.filter("") }, 2000);
          } catch (e) {      
            console.log('Error respose: ', e)
        }
      }

      // Función asincrona para eliminar la informacion completa del usuario
      const deleteUser = async (id_user, bodyIn) => {
          try {
               //Delete user
               let response = await usersServices.deleteUsers(id_user);
               let dataReturn = await response.json();
               getUsers();
               this.filter(bodyIn.name_user);
               setTimeout(() => { this.filter("") }, 2000);
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
      { "headerText": "Password", renderer: this.highlightingCellRenderer } ];
      //  
      this.newUserData = () => {

        this.disableIdUser(true);
        this.disableNameUser(false);
        this.disableEmailUser(false);
        this.disablePasswordUser(false);

        this.actionButtonChroming('danger');
        this.actionLabelCU('Add user'); 
        this.actionStyleCU("button-green"); //null
        this.actionDisabledCU(false);
        this.actionLabelDel('Delete user'); 
        this.actionStyleDel("button-red"); //null
        this.actionDisabledDel(true);  

        this.inputIdUser(0);
        this.inputNameUser(null);
        this.inputEmailUser(null);
        this.inputPassword(null);
      };

       // Return true if the Remove and Update buttons should be disabled
       this.disableRemoveUpdate = ko.computed(() => {
        const firstSelected = this.firstSelected();
        return (!firstSelected ||
          !firstSelected.key ||
          this.groupValid() === "invalidShown");
      });
       // Listener for updating the form when row selection changes in the table
       this.firstSelectedRowChangedListener = (event) => {
        const infoPasswordUser = [{ summary: "summary", detail: "You can only modify the password", severity: "info" }];
        this.disableIdUser(true);
        this.disableNameUser(true);
        this.disableEmailUser(true);
        this.disablePasswordUser(false);

        this.actionButtonChroming('danger');
        this.actionLabelCU('Modify user'); 
        this.actionStyleCU("button-green"); //null
        this.actionDisabledCU(false);
        this.actionLabelDel('Delete user'); 
        this.actionStyleDel("button-red"); //null
        this.actionDisabledDel(false);    
        
        const itemContext = event.detail.value;
        if (itemContext && itemContext.data) {
          const user = itemContext.data;
          this.inputIdUser(user.id_user);
          this.inputNameUser(user.name_user);
          this.inputEmailUser(user.email_user);
          this.inputPassword(user.password_user);
          this.messagePasswordUser(infoPasswordUser)
        }
        document.getElementById("modalDialog1").open();
      };
      //
      this.addNewDialog = (event) =>{
        this.newUserData();
        document.getElementById("modalDialog1").open();
      };
      //delUserDialog
      this.delUserDialog = (event) => {
        document.getElementById("innerDialog").open();
        //this.newUserData();
      };
      //
      this.handleOKClose2 = (event) => {
        document.getElementById("innerDialog").close();
        
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
          if (!this.validateEmail(newData.email_user)){
              this.messageEmailUser(warningEmail); 
          } else {
            //createUser, modifyPassword, deleteUser
            if (newData.id_user == 0) {
              createUser(newData);
            } else {
              modifyPassword(newData.id_user, newData);
            }
            setTimeout(() => { 
              this.newUserData();
              document.getElementById("modalDialog1").close();
             }, 1000);
          }
        } else {
           if (!this.inputNameUser()) {
              this.messageNameUser(error);
           };                     
           if (!this.inputEmailUser()){
              this.messageEmailUser(error);
           };
           if (!this.inputEmailUser()) {
              this.messagePasswordUser(error);
           };
        }
      };
      //delUserDialog2
      this.delUserDialog2 = (event) => {
        const delData = {
          id_user: this.inputIdUser(),
          name_user: this.inputNameUser(),
          email_user: this.inputEmailUser(),
          password_user: this.inputPassword()
        }; 
        if (!this.valueForm()) {
          if (delData.id_user !== 0) {
            deleteUser(delData.id_user, delData);
            setTimeout(() => { 
              this.newUserData();
              document.getElementById("innerDialog").close();
              document.getElementById("modalDialog1").close();
             }, 1000);
            }
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
      this.handleUpdate = (event, context) => {
        this.newUserData();
        document.getElementById("modalDialog1").open();
      };
      this.handleDone = () => {
        this.editRow({ rowKey: null });
      };
      this.handleCancel = () => {
        this.cancelEdit = true;
        this.editRow({ rowKey: null });
      };
      //
      this.beforeRowEditListener = (event) => {
        this.cancelEdit = false;
        const rowContext = event.detail.rowContext;
        this.originalData = Object.assign({}, rowContext.item.data);
        this.rowData = Object.assign({}, rowContext.item.data);
      };
      //
      this.beforeRowEditEndListener = (event) => {
        this.editedData("");
        const detail = event.detail;
        if (!detail.cancelEdit && !this.cancelEdit) {
            if (this.hasValidationErrorInRow(document.getElementById("table"))) {
                event.preventDefault();
            }
            else {
                if (this.isRowDataUpdated()) {
                    const key = detail.rowContext.item.data.DepartmentId;
                    this.submitRow(key);
                }
            }
        }
      };
      //      
      getUsers();
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