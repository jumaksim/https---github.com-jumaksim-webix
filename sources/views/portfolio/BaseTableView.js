import {JetView} from "webix-jet";
import session from "../../models/session";

function showIcon(obj, common, row){
	const sign = row ? "plus" : "minus";
	
	return `<span class="fa fa-pencil">#link#<span class="fa fa-trash" onclick="$$('leadtable').$scope.deleteRow();">`;
}
import LeadFormView from "../forms/lead";
import TabTopView from "../main/tab";

export default class BaseTableView extends JetView {
	
	//page = "Contacts";
    //singleObject = "Contact";
    //objectName = "contacts";
	//OBJECT_OBJ = ContactFormView;
	
	constructor(pApp, pName, pConfig)
	{
		super(pApp, pName);
		this.pageConfig = pConfig;
        //this.page = pPage;
		//this.singleObject = pSingleObject;
		//this.objectName = pObjectName;
    }
	
	deleteRow(pLink)
	{
		console.log(pLink);
		var _this = this;
		var ajax = session.authajax().del(pLink).then(a =>
								{
									_this.refreshData();
								});
	}
	editRow(pSel, pLink)
	{
		var bodyData = this.pageConfig.form.getConfig(this);
		console.log(bodyData);				
		var windowConfig = {
			id:"objectWindow",
			view:"window",
			position:"center",
			head:"Edit " + this.pageConfig.singleObject,
			close:true,
			modal:true,
			resize:true,
			move:true,
			body:bodyData,
		};
		this.mb = webix.ui(windowConfig);
		this.mb.getChildViews()[1].getChildViews()[0].bind($$(this.pageConfig.page + "table"));
		//refresh the selection
		$$(this.pageConfig.page + "table").unselectAll();
		$$(this.pageConfig.page + "table").select(pSel);
	    this.mb.show();
	}
	config(){
        var columns = [];
		var options = [];
		var selOption = null;
        for(var i = 0; i < this.pageConfig.columns.length; i++)
		{
			if(!selOption)
			{
				selOption = this.pageConfig.columns[i].field;
			}
			columns.push({id:this.pageConfig.columns[i].field, fillspace:1, map:"#" + this.pageConfig.columns[i].field + "#", header:[{text:this.pageConfig.columns[i].header}]});
			options.push({id:this.pageConfig.columns[i].field, value:this.pageConfig.columns[i].header});
		}			
		columns.push({ id:"icon", css:"column_center", fillspace:1, header:[{ text:"", css:"header_center", width:50}], template:`<span class="fa fa-pencil"></span> <span class="fa fa-trash" ></span>`});
		columns.push({ id:"link", css:"column_center", fillspace:1, map:"#link#", hidden:true });
		const mainView = {
			id:"leadRows",
			fillspace:true,
			rows:[
			{
				cols:[
					{
						view:"template",
						template:"<div style='line-height:50px;'>" + this.pageConfig.page + "</div>",
						height:50,
					},
						{
							view:"richselect",
							id:"sortBy", 
							label:"SORT BY |", 
							value:selOption, 
							yCount:"3", 
							 css:"webix_primary",
							 on:(function(pThis){
								 return {
							onChange(newVal, oldVal){
								pThis.refreshData();
							 }}})(this),
							 onChange:function(){console.log("change");this.refreshData();},
							options:options,
							width:300
						},
						{ view:"button", label:"New " + this.pageConfig.singleObject, css:"webix_primary", width:100, click:(function(pSingleObject){ return function(){
			var bodyData = this.$scope.pageConfig.form.getConfig(this.$scope);
		console.log(bodyData);				
		var windowConfig = {
			id:"objectWindow",
			view:"window",
			position:"center",
			head:"New " + pSingleObject,
			close:true,
			modal:true,
			resize:true,
			move:true,
			body:bodyData,
		};
		this.$scope.mb = webix.ui(windowConfig);
	    this.$scope.mb.show();

							//webix.modalbox({text:"<div id='new_dialog' style='width:370px; height:300px'></div>", buttons:["Yes","No","Maybe"]});
							/*webix.ui({
							  container:"new_dialog",
							  buttons:["Yes","No","Maybe"],
							  view:"datatable", autoConfig:true, data:grid_data 
							});*/
							//document.location = "#!/main.tab/portfolio/forms.lead";
						};})(this.pageConfig.singleObject)
						}
					  ]
				
			},
			{
				view:"datatable", id:this.pageConfig.page + "table", localId:"grid",
				select:true, css:"webix_header_border",fillspace:true,
				url:{
							$proxy:true,
							load: (function(pObjectName){ return function(view,params){
								//move to session and change session
								return session.authajax().get(session.SERVER + "/api/" + pObjectName + "?sort=" + $$("sortBy").getValue()).then(a =>
								{
									var arr = a.json()["_embedded"][pObjectName];
									for(var x = 0; x < arr.length; x++)
									{
										arr[x]["link"] = arr[x]["_links"]["self"]["href"];
									}
									console.log(arr);
									return arr;
								});
							};})(this.pageConfig.objectName)
						},
				datatype:"json",
				columns:columns,
				onClick:{
					 "fa-pencil":function(event, cell, target){
						 this.$scope.editRow(cell, this.getItem(cell).link);
					 },
					 "fa-trash":function(event, cell, target){
						 var _this = this;
						 webix.confirm({
								title:"Delete",
								ok:"Yes", 
								cancel:"No",
								text:"Are you sure you want to delete " + this.getItem(cell).name
							}).then(function(result){
							  _this.$scope.deleteRow(_this.getItem(cell).link);
						  }).fail(function(){
						});
					 }
				   },  
				pager:"pagerA", //linking to a pager
			},
				{
					view:"pager", id:"pagerA",
					size:50,
					group:3
				}]
		};
		return mainView; 
	}
	refreshData(){
		$$(this.pageConfig.page + "table").clearAll();
		$$(this.pageConfig.page + "table").load((function(pObjectName){ return function(view,params){
								//move to session and change session
								return session.authajax().get(session.SERVER + "/api/" + pObjectName + "?sort=" + $$("sortBy").getValue()).then(a =>
								{
									var arr = a.json()["_embedded"][pObjectName];
									for(var x = 0; x < arr.length; x++)
									{
										arr[x]["link"] = arr[x]["_links"]["self"]["href"];
									}
									return arr;
								});
							};})(this.pageConfig.objectName));
	}
	init(grid){
		/*grid.parse([
			{ feature:"Unlimited lists", start:1, advanced:1, pro:1 },
			{ feature:"Separate outlines", start:1, advanced:1, pro:1 },
			{ feature:"Tag", start:1, advanced:1, pro:1 },
			{ feature:"Markdown", start:1, advanced:0, pro:1 },
			{ feature:"Note", start:1, advanced:1, pro:1 },
			{ feature:"Color label", start:1, advanced:0, pro:0 },
			{ feature:"Numbered list", start:1, advanced:1, pro:0 },
			{ feature:"Heading", start:1, advanced:1, pro:0 },
			{ feature:"Creation date", start:1, advanced:0, pro:0 },
			{ feature:"Last edited time", start:1, advanced:1, pro:1 },
			{ feature:"File upload", start:1, advanced:1, pro:1 },
			{ feature:"Project management", start:1, advanced:0, pro:0 },
			{ feature:"Solutions database", start:1, advanced:1, pro:0 },
			{ feature:"Webinars", start:1, advanced:0, pro:0 },
			{ feature:"Training groups", start:1, advanced:0, pro:0 },
			{ feature:"Complex widgets", start:1, advanced:0, pro:0 },
			{ feature:"Typography", start:1, advanced:0, pro:0 }
		]);*/
	}
	ready(view, url)
	{
		//$$('objectForm').bind($$('leadtable'));
	}
}
