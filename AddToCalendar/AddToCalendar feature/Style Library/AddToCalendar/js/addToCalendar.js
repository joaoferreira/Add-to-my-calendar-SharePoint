window.onload = function() {
	
	var siteURL;
	var siteCollectionURL;
	var listTemplate; // Calendar = 106
	var itemID;
	var icsLink;
	var downloadHTML;
	var detailInitialized;
	var cssAppended;
	
	//wait for _spPageContextInfo
	
	ExecuteOrDelayUntilScriptLoaded(getPageContextInfo, "core.js");
	
	function getPageContextInfo() {
		siteURL         	= _spPageContextInfo.webAbsoluteUrl;
		listTemplate    	= _spPageContextInfo.listBaseTemplate; // Calendar = 106
		siteCollectionURL 	= _spPageContextInfo.siteAbsoluteUrl;
		itemID;
		icsLink;
		downloadHTML;
		detailInitialized = false;
		cssAppended = false;
		
		InitICS();
		
		//timer user to add the download links when the user navigates in the calendar
		var count = 0;
		window.reInit = setInterval(function(){
			count ++;
			if(count > 60){
				clearInterval(window.reInit);
			}
			if(document.getElementsByClassName('icsDownload').length == 0){
				InitICS();
			}
		},500);
	}
	
	function InitICS(){
		//check if download icons are available
		if(document.getElementsByClassName('icsDownload').length == 0){
			var calendarElement = document.getElementsByClassName('ms-acal-rootdiv')[0];		

			if(listTemplate == 106){
			    var eventsM = document.getElementsByClassName('ms-acal-mdiv');
			    var eventsS = document.getElementsByClassName('ms-acal-sdiv'); 	
			    var eventsD = document.getElementsByClassName('ms-acal-ddiv'); 
			    
			    var listID  = _spPageContextInfo.listId;
			    
			    appedDownloadButtonToCalendar(eventsM, 'M', listID);
			    appedDownloadButtonToCalendar(eventsS, 'S', listID);
			    appedDownloadButtonToCalendar(eventsD, 'D', listID);
			    if(!detailInitialized){
			    	detailInitialized = true;
			    	appedDownloadButtonToEventDetail('listFormToolBarTop',listID);
			    }
				if(!cssAppended){
					cssAppended = true;
					appendCSS();
				}
			}else{
				clearInterval(window.reInit);
			}
			
		}
		else{
			return;
		}		
	}
	
	function appedDownloadButtonToCalendar(events,type,listID){
	    for (var i=0; i<events.length; i++){
	        downloadHTML = '';
	        itemID = events[i].getElementsByTagName("a")[0].href.split('?ID=')[1];
	        icsLink = siteURL+"/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List="+listID+"&CacheControl=1&ID="+itemID+"&Using=event.ics";
	        downloadHTML += '<a id="ics'+itemID+type+'" class="icsDownload" style="position: absolute; right: 2px; top:1px; display:none; z-index:1000;">';
	        downloadHTML += '    <img style="width: 16px; height: 16px; margin-left: 4px;" src="'+siteCollectionURL+'/Style Library/AddToCalendar/images/outlook.png">';
	        downloadHTML += '</a>';
	    
	        var temp = document.createElement('div');
	        temp.innerHTML = downloadHTML;
	        while (temp.firstChild) {
	            events[i].appendChild(temp.firstChild);
	        }
	    
	        document.getElementById("ics"+itemID+type).href=icsLink;
	    }
	}
	
	
	function appedDownloadButtonToEventDetail(id,listID){
		clearInterval(window.reInit); 
		if (document.getElementById(id) === null){
			return;
		}else{ 
			itemID = document.location.href.split('ID=')[1].split('&')[0];
		    icsLink = siteURL+"/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List="+listID+"&CacheControl=1&ID="+itemID+"&Using=event.ics";
		    
		    downloadHTML = '';
			downloadHTML += '	<td nowrap="true" valign="top" width="113px" class="ms-formlabel">';
			downloadHTML += '		<span class="ms-h3 ms-standardheader">';
			downloadHTML += '			Add To Calendar';
			downloadHTML += '		</span>';
			downloadHTML += '	</td>';
			downloadHTML += '	<td valign="top" class="ms-formbody" width="350px">';
			downloadHTML += '		<a href="'+icsLink+'">Download ICS</a>';				
			downloadHTML += '	</td>';			 
		    
	        var temp = document.createElement('tr');
	        temp.innerHTML = downloadHTML;
	        var table = document.getElementsByClassName('ms-formtable')[0];
			table.tBodies[0].appendChild(temp);			
		}	
	}

	
	
	function createDownloadBigButton(){
	    var downloadICS;
	    var tempDownload = document.createElement('div');
	        tempDownload.innerHTML = downloadICS;
	        while (tempDownload.firstChild) {
	            events[i].appendChild(tempDownload.firstChild);
	        }
	    
	}
	
	
	var calndarNavigation = document.getElementsByClassName('ms-cal-nav');
	for (var i=0; i<calndarNavigation.length; i++){
		calndarNavigation[i].onclick = function(){
			setTimeout(function(){
				InitICS();
			},500);			
		};
	}
	
	function appendCSS(){
		var css = '.ms-acal-item:hover .ms-acal-mdiv .icsDownload, .ms-acal-item:hover .ms-acal-sdiv .icsDownload, .ms-acal-item:hover .ms-acal-ddiv .icsDownload{display:block!important;}';
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet){
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
	}

	
}();