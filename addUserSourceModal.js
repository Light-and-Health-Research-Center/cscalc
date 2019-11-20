function buildAddUserSourceModal(){
	// Start of modal code
	var mod = document.createElement("div");
	mod.setAttribute('id','addUserSourceModal');
	mod.setAttribute('class','modal fade');
	mod.setAttribute('role','dialog');
	var modDialog = document.createElement("div");
	modDialog.setAttribute('class','modal-dialog');
	var modContent = document.createElement("div");
	modContent.setAttribute('class','modal-content');
	
	// Modal Header
	var modHeader = document.createElement("div");
	modHeader.setAttribute('class','modal-header');
	modHeader.setAttribute('id','modHeader');
	var buttonClose = document.createElement("button");
	buttonClose.setAttribute('type','button');
	buttonClose.setAttribute('class','close');
	buttonClose.setAttribute('data-dismiss','modal');
	buttonClose.innerHTML = '&times';
	modHeader.appendChild(buttonClose); 
	var modTitle = document.createTextNode('Create New Custom Source');
	modHeader.appendChild(modTitle);
	
	// Modal Body
	var modBody = document.createElement("div");
	modBody.setAttribute('class','modal-body');
	
	modBody.appendChild(modBodyText);
	
	// Modal Footer
	var modFooter = document.createElement("div");
	modFooter.setAttribute('class','modal-footer');
	var modAddButton = document.createElement("button");
	modAddButton.setAttribute('type','button');
	modAddButton.setAttribute('class','btn btn-default addSource');
	modAddButton.setAttribute('data-dismiss','modal');
	modAddButton.innerHTML = "Create Source";
	modFooter.appendChild(modAddButton);
	
	// Build Modal
	modContent.appendChild(modHeader);
	modContent.appendChild(modBody);
	modContent.appendChild(modFooter);
	modDialog.appendChild(modContent);
	mod.appendChild(modDialog);
}