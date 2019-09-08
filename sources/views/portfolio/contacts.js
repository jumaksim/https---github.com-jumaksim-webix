import BaseTableView from "./BaseTableView.js";
import session from "../../models/session";

function showIcon(obj, common, row){
	const sign = row ? "plus" : "minus";
	
	return `<span class="fa fa-pencil">#link#<span class="fa fa-trash" onclick="$$('leadtable').$scope.deleteRow();">`;
}
import ContactFormView from "../forms/contact";
import TabTopView from "../main/tab";

const PAGE = "Contacts";
const SINGLE_OBJECT = "Contact";
const OBJECT = "contacts";
const OBJECT_OBJ = ContactFormView;

export default class ContactsView extends BaseTableView {
	constructor(pApp, pName){
		
        super(pApp, pName, {page:PAGE, singleObject:SINGLE_OBJECT, objectName:OBJECT, columns:[{field:"firstName",header:"First Name"},{field:"lastName",header:"Last Name"},{field:"email",header:"Email"},{field:"roleType",header:"Role"}], form:ContactFormView});
    }	
}