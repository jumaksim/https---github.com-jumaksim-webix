import BaseTableView from "./BaseTableView.js";
import session from "../../models/session";

function showIcon(obj, common, row){
	const sign = row ? "plus" : "minus";
	
	return `<span class="fa fa-pencil">#link#<span class="fa fa-trash" onclick="$$('leadtable').$scope.deleteRow();">`;
}
import OpportunityFormView from "../forms/opportunity";
import TabTopView from "../main/tab";

const PAGE = "Opportunities";
const SINGLE_OBJECT = "Opportunity";
const OBJECT = "opportunities";
const OBJECT_OBJ = OpportunityFormView;

export default class OpportunitiesView extends BaseTableView {
	constructor(pApp, pName){
        super(pApp, pName, {page:PAGE, singleObject:SINGLE_OBJECT, objectName:OBJECT, columns:[{field:"description",header:"Description"},{field:"amount",header:"Amount"},{field:"won",header:"Won"}], form:OpportunityFormView});
    }	
}