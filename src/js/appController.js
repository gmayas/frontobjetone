/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils',
  'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter',
  'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojoffcanvas', 'ojs/ojarraytreedataprovider', "text!data/treeViewData.json",
  "ojs/ojbootstrap",
  'ojs/ojmodule-element', 'ojs/ojknockout'],
  function (ko, Context, moduleUtils, KnockoutTemplateUtils,
    CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter,
    ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider,
    OffcanvasUtils, ArrayTreeDataProvider, jsonData,
    Bootstrap) {

    function ControllerViewModel() {

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
        this.message(event.detail.message);
        this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '', redirect: 'home' },
        { path: 'home', detail: { label: 'Home', iconClass: 'oj-ux-ico-home' } },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'tablecrud', detail: { label: 'Table CRUD', iconClass: 'oj-ux-ico-database' } },
        { path: 'users', detail: { label: 'Users', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'ejemplos/ejemplo01', detail: { label: 'Ejemplo01', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'ejemplos/ejemplo02', detail: { label: 'Ejemplo02', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'about/about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
      ];

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), { keyAttributes: "path" });

      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => { OffcanvasUtils.close(this.drawerParams); });
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("App Name");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");
      // treeViewData
      this.treeViewData = new ArrayTreeDataProvider(JSON.parse(jsonData), {
        keyAttributes: "id",
      });
      //console.log('treeViewData:', this.treeViewData);
      // ----------------
      this.selectedItem = ko.observable("home");
      this.isContrastBackground = ko.observable(false);
      this.navlistContainer = document.getElementById("navlistcontainer");
      this.isContrastBackground.subscribe((newValue) => {
        if (navlistContainer != null) {
          if (newValue) {
            navlistContainer.className = "oj-bg-neutral-170 oj-color-invert";
          }
          else {
            navlistContainer.className = "";
          }
        }
      });
      //Bootstrap.whenDocumentReady().then(() => {
      //  ko.applyBindings(new  ControllerViewModel(), document.getElementById("navlistdemo"));
      //});
      // ----------------
      // Footer
      this.footerLinks = [
        { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
    }
    // release the application bootstrap busy state
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();

    return new ControllerViewModel();
  }
);