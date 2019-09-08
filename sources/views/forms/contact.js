import {JetView} from "webix-jet";
import {getCities} from "models/cities";
import {getTags} from "models/tags";
import {getPositions} from "models/positions";
import "webix/photo";
import session from "../../models/session";

const OBJECT = "contacts";

export default class ContactFormView extends JetView {
	static getConfig(pView)
	{
		const dateFormat = webix.Date.dateToStr("%d %M %Y");

		const main_info = {
			margin:10,
			rows:[
				{
					view:"text", name:"firstName",
					label:"First Name", labelPosition:"top",
					placeholder:"First Name",
					invalidMessage:"A first name is required",
					tooltip:obj => {
						return obj.value ? "First name is #value#" : "<span class='notselected'>"+"Not specified"+"</span>";
					}
				},
				{
					view:"text", name:"lastName",
					label:"Last Name", labelPosition:"top",
					placeholder:"Last Name",
					invalidMessage:"A last name is required",
					tooltip:obj => {
						return obj.value ? "Last name is #value#" : "<span class='notselected'>"+"Not specified"+"</span>";
					}
				},
				{
					view:"text", name:"email",
					label:"Email", labelPosition:"top",
					placeholder:"Email",
					invalidMessage:"An email is required",
					tooltip:obj => {
						return obj.value ? "The email of this contact is #value#" : "<span class='notselected'>"+"Not specified"+"</span>";
					}
				},
				{
					view:"richselect", name:"roleType",
					label:"Role", labelPosition:"top",
					placeholder:"Role",
					value:"USER", 
					css:"webix_primary",
							options:[ 
								{id:"USER", value:"User"}, // the initially selected item
								{id:"ADMIN", value:"Admin"},
								{id:"ANALYST", value:"Analyst"},
								{id:"CUSTOMER", value:"Customer"},
								{id:"SUPERADMIN", value:"Super Admin"}
							]
				}
			]
		};

		const more_info = {
			margin:10,
			rows:[
				{
					view:"text", name:"address", label:"Address",
					labelPosition:"top", placeholder:"Address",
					tooltip:obj => {
						return obj.value ? "The address of the client's office" : "<span class='notselected'>"+"Not specified"+"</span>";
					}
				},
				{
					view:"datepicker", name:"birthday",
					label:"Birthday", labelPosition:"top",
					placeholder:"Click to select",
					format:dateFormat,
					tooltip:obj => {
						let result = "Client is ";
						if (obj.value){
							result += Math.floor((new Date() - obj.value) / (1000 * 60 * 60 * 24 * 365)) + " years old";
							let nearestBDay = new Date();
							nearestBDay.setMonth(obj.value.getMonth());
							nearestBDay.setDate(obj.value.getDate());
							if (nearestBDay < new Date()){
								webix.Date.add(nearestBDay, 1, "year");
							}
							result += "<br>" + "Next birthday is on " + dateFormat(nearestBDay);
						}
						return result;
					}
				},
				{
					view:"datepicker", name:"request",
					label:"First request", labelPosition:"top",
					placeholder:"Click to select",
					format:dateFormat
				},
				{
					view:"text", name:"phone", label:"Phone", labelPosition:"top", placeholder:"Phone"
				},
				{
					view:"radio", name:"notifications",
					label:"Notifications", labelPosition:"top",
					value:1,
					tooltip:obj => {
						return obj.id%2 ? "You will receive email notifications about actions performed by this client." : "You will receive no email notifications.";
					},
					options:[
						{ id:1, value:"Agree" },
						{ id:2, value:"Disagree" }
					]
				}
			]
		};

		const right_photo = {
			margin:10,
			rows:[
				{
					view:"photo", localId:"photo",
					name:"photo",
					css:"form_photo",
					width:260,
					height:260,
					borderless:true
				},
				{
					view:"multicombo", name:"tags",
					localId:"tags:combo",
					placeholder:"Click to add tags",
					options:getTags(),
					tooltip:obj => {
						return obj.value ? "The badges unlocked by the client" : "<span class='notselected'>"+"No badges"+"</span>";
					}
				}
			]
		};

		const upper_section = {
			margin:48, cols:[
				main_info,
				//more_info,
				//right_photo
			]
		};

		const buttons = {
			margin:10,
			cols:[
				{},
				{
					view:"button", value:"Cancel", autowidth:true,
					click:() => {
						console.log(pView);
						pView.mb.close();
					},
					tooltip:"Close the form"
				},
				{
					view:"button", value:"Reset", autowidth:true,
					click:() => {
						this.$$("form").clear();
					},
					tooltip:"Click to clean the form"
				},
				{
					view:"button", value:"Save", type:"form", autowidth:true,
					tooltip:"Save changes",
					click:() => {
						console.log(pView);
						var form = pView.mb.getChildViews()[1].getChildViews()[0];
						console.log(form);
						if (form.validate()){
							var method = "post";
							var url = session.SERVER + "/api/" + OBJECT;
							if(form.getValues().link)
							{
								method = "put";
								url = form.getValues().link;
							}
							session.authajax()[method](url, {firstName:form.getValues().firstName, lastName:form.getValues().lastName, email:form.getValues().email, roleType:form.getValues().roleType}).then(a => { webix.message("Saved!", "success");pView.mb.close();
							if(pView.refreshData){pView.refreshData();}else if(pView.$scope.refreshData){pView.$scope.refreshData();}});
						}
					}
				}
			]
		};

		return {
			id:"leadform",
			rows:[
				//{ template:"<a href='#!/main.tab/portfolio/portfolio.leads'>Back</a>", type:"header" },
				//{ template:"New Lead", type:"header" },
				{
					view:"form", localId:"form", padding:24,
					rows:[
						upper_section,
						buttons
					],
					rules:{
						"firstName":webix.rules.isNotEmpty,
						"lastName":webix.rules.isNotEmpty,
						"email":webix.rules.isNotEmpty
					}
				}
			]
		};
	}
	config(){
		return getConfig();
	}
	init(){
		/*this.$$("form").setValues({
			fname:"Morgan", lname:"Yu",
			birthday:"2005-05-05", photo:"morgan_yu",
			notifications:1, request:"2017-01-13",
			tags:"6,3,5"
		});*/
	}
}
