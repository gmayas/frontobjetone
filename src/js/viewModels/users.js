
define(["services/users.service", "../accUtils", "require", "exports", "knockout", "ojs/ojcore", "ojs/ojbootstrap",
  "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojanimation", 
  "ojs/ojtable", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojformlayout", "ojs/ojlabelvalue"],
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

      // 
      self.userArray = ko.observableArray([]);
      /*self.dataprovider = new ArrayDataProvider(self.userArray, {
        keyAttributes: "id_user",
        implicitSort: [{ attribute: "id_user", direction: "descending" }]
      });*/
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

      // Functions
      const usersData = async () => {
        let response = await usersServices.getUsers();
        let dataReturn = await response.json();
        self.userArray(dataReturn.data);
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
      this.addNewDialog = (event) =>{
        document.getElementById("modalDialog1").open();
      };
      //
      this.close = (event) => {
        document.getElementById("modalDialog1").close();
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
      this.labelHint1 = ko.computed(() => {
        return this.labelPrefix() + "input text";
      });
      //
      this.labelHint2 = ko.computed(() => {
        return this.labelPrefix() + "input email";
      });
      //
      this.labelHint3 = ko.computed(() => {
        return this.labelPrefix() + "input password";
      });
      // 
      this.placeholder = ko.computed(() => {
        return this.booleans.indexOf("placeholder") != -1;
      });
      // 
      this.disableFormControls = ko.computed(() => {
        if (this.formControlDisabledState() === "yes") {
            return true;
        }
        return false;
      });
      //
      this.inputTextValue = ko.computed(() => {
        let shortText = "text";
        return this.valueLength() === "short"
            ? shortText
            : this.valueLength() === "long"
                ? shortText + longTextSuffix
                : null;
      });
      //
      this.inputPasswordValue = ko.computed(() => {
        let shortText = "text";
        return this.valueLength() === "short"
            ? shortText
            : this.valueLength() === "long"
                ? shortText + longTextSuffix
                : null;
      });
      //
      this.messages = ko.computed(() => {
        let msgs = [];
        if (this.formState() == "enabled") {
            if (this.formControls.indexOf("error") > -1) {
                msgs.push(_errorMsg);
            }
            if (this.formControls.indexOf("warning") > -1) {
                msgs.push(_warningMsg);
            }
            if (this.formControls.indexOf("info") > -1) {
                msgs.push(_infoMsg);
            }
            if (this.formControls.indexOf("confirmation") > -1) {
                msgs.push(_confirmationMsg);
            }
        }
        return msgs;
      });
      //
      this.required = ko.computed(() => {
        return this.booleans.indexOf("required") != -1;
      });
      //
      this.source = ko.computed(() => {
        return this.booleans.indexOf("source") != -1
            ? "https://www.oracle.com"
            : "";
      });
      //
      this.definition = ko.computed(() => {
        return this.booleans.indexOf("definition") != -1
            ? "Custom help definition"
            : "";
      });
      //
      this.instruction = ko.computed(() => {
        return this.booleans.indexOf("instruction") != -1
            ? "Assistive help instruction"
            : "";
      });
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