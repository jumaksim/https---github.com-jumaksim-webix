import BaseTableView from "./BaseTableView.js";
import session from "../../models/session";

function showIcon(obj, common, row){
	const sign = row ? "plus" : "minus";
	
	return `<span class="fa fa-pencil">#link#<span class="fa fa-trash" onclick="$$('leadtable').$scope.deleteRow();">`;
}
import LeadFormView from "../forms/lead";
import TabTopView from "../main/tab";

export default class LeadsView extends BaseTableView {
	constructor(pApp, pName){
		
        super(pApp, pName, {page:"Leads", singleObject:"Lead", objectName:"leads", columns:[{field:"name",header:"Name"},{field:"email",header:"Email"}], form:LeadFormView});
    }	
}
