sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension',
        'sap/m/MessageToast',
        'sap/m/Dialog',
        'sap/m/Text',
        'sap/m/Button',
        'sap/m/ButtonType',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'sap/m/Link',
        'sap/ui/core/URI',
        'sap/ui/core/UIComponent',
        'sap/m/MessageBox'
        // ,'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension,
        MessageToast, Dialog, Text, Button, ButtonType, Filter, FilterOperator, Link, URI, UIComponent, MessageBox
        // ,OverrideExecution
    ) {
        'use strict';
        var oRouter, oController, oCommPrefModel, oCAKey;
        return ControllerExtension.extend("customer.zlhdisplaycorrespondence.htmlNotification", {
            init: function () {
                debugger;
                UIComponent.prototype.init.apply(this, arguments);
            },
            onNotificationPress: function (oEvent) {
                debugger;
                var queryString = window.location.href;
                const searchWord = "CACorrespondence='";
                let startIndex = queryString.indexOf(searchWord);
                const extractionStartIndex = startIndex + searchWord.length;
                const result = queryString.substring(extractionStartIndex, extractionStartIndex + 32);
                // result;//
                let oKey = result; // '02CD022BAA0F1EDFB8DCF9D4B2415BF3';
                var aFilter = [];
                aFilter.push(new Filter("CorrespondenceKey", FilterOperator.EQ, oKey));
                var oModel = this.getView().getModel("customer.oData");
                oModel.read("/FetchNotificationsSet('" + oKey + "')", {
                    success: function (response) {
                        debugger;
                        if (response.Status === 'T') {
                            var oContent = response.Content;//response.results[0].Content;
                            var oHtml = new sap.ui.core.HTML({
                                content: oContent,
                                sanitizeContent: true
                            });
                            var oPanel1 = new sap.m.Panel({
                                headerText: "Recipient(s)",
                                expandable: false,
                                width: "auto" // Adjust width as needed
                            });
                            oPanel1.addContent(new sap.m.Label({ text: response.Recepients }));
                            var oPanel2 = new sap.m.Panel({
                                headerText: "Date and Time Delivered (EST)",
                                expandable: false,
                                width: "auto" // Adjust width as needed
                            });
                            oPanel2.addContent(new sap.m.Label({ text: response.DeliveryTimestamp }));
                            var oPanel3 = new sap.m.Panel({
                                headerText: "Content of Message",
                                expandable: false,
                                width: "auto" // Adjust width as needed
                            });
                            oPanel3.addContent(oHtml);

                            var oPanel = new sap.m.Panel({
                                headerText: "",
                                expandable: false,
                                width: "auto" // Adjust width as needed
                            });
                            oPanel.addContent(oPanel1);
                            oPanel.addContent(oPanel2);
                            oPanel.addContent(oPanel3);

                            var oDialog = new Dialog({
                                title: response.Subject,
                                contentWidth: "800px",
                                contentHeight: "400px",
                                resizable: true,
                                draggable: true,
                                // beginButton: new Button({
                                //     type: ButtonType.Emphasized,
                                //     text: "OK",
                                //     press: function () {
                                //         oDialog.close();
                                //     }
                                // }),
                                endButton: new Button({
                                    type: ButtonType.Emphasized,
                                    text: "Cancel",
                                    press: function () {
                                        oDialog.close();
                                    }
                                }),
                                afterClose: function () {
                                    oDialog.destroy();
                                }
                            });
                            oDialog.addContent(oPanel);
                            //this.getView().addDependent(oDialog);
                            oDialog.open();


                        }
                        else if (response.Status === 'F') {
                            MessageBox.error("There are no Notifications for this record");
                        }

                    },
                    error: (oError) => {
                        debugger;
                        MessageBox.error(oError.message);
                    }
                });

            }
            // metadata: {
            // 	// extension can declare the public methods
            // 	// in general methods that start with "_" are private
            // 	methods: {
            // 		publicMethod: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.Instead /*default*/
            // 		},
            // 		finalPublicMethod: {
            // 			final: true
            // 		},
            // 		onMyHook: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.After
            // 		},
            // 		couldBePrivate: {
            // 			public: false
            // 		}
            // 	}
            // },
            // // adding a private method, only accessible from this controller extension
            // _privateMethod: function() {},
            // // adding a public method, might be called from or overridden by other controller extensions as well
            // publicMethod: function() {},
            // // adding final public method, might be called from, but not overridden by other controller extensions as well
            // finalPublicMethod: function() {},
            // // adding a hook method, might be called by or overridden from other controller extensions
            // // override these method does not replace the implementation, but executes after the original method
            // onMyHook: function() {},
            // // method public per default, but made private via metadata
            // couldBePrivate: function() {},
            // // this section allows to extend lifecycle hooks or override public methods of the base controller
            // override: {
            // 	/**
            // 	 * Called when a controller is instantiated and its View controls (if available) are already created.
            // 	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
            // 	 * @memberOf customer.zlhdisplaycorrespondence.htmlNotification
            // 	 */
            // 	onInit: function() {
            // 	},
            // 	/**
            // 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
            // 	 * (NOT before the first rendering! onInit() is used for that one!).
            // 	 * @memberOf customer.zlhdisplaycorrespondence.htmlNotification
            // 	 */
            // 	onBeforeRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
            // 	 * This hook is the same one that SAPUI5 controls get after being rendered.
            // 	 * @memberOf customer.zlhdisplaycorrespondence.htmlNotification
            // 	 */
            // 	onAfterRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
            // 	 * @memberOf customer.zlhdisplaycorrespondence.htmlNotification
            // 	 */
            // 	onExit: function() {
            // 	},
            // 	// override public method of the base controller
            // 	basePublicMethod: function() {
            // 	}
            // }
        });
    }
);
