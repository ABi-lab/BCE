var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var AppCommands = {
	CmdFolderOpen: function(path, saveState) {
        saveState = saveState || true; //saveState === true;
        var pathID = App.Util.filePathToID(path);
		// if folder is already open, switch tabs instead of opening new one
		if (App.Files.ExplorersRoots && App.Files.ExplorersRoots[pathID] !== undefined) {
			App.UI.MountPoints.tabs("option", "active", $('#explorerTabs a[href="#exp_'+pathID+'"]').parent().index());
			return;
		}
		App.Commands.CmdFolderOpenWorker(path, saveState);
		return false;
	},
	// FILE commands
	CmdFolderOpenWorker: function(path, saveState) {
        saveState = saveState || true; //saveState === true;
        var pathID = App.Util.filePathToID(path);
        App.Files.ExplorersRoots[pathID] = path;
		$.post('?fl='+path).done(function(res) {
    	    App.Files.ExplorersData[pathID] = JSON.parse(res);
    		var tab = $(document.createElement('div'))
    					.attr('id', 'exp_'+pathID)
    					.attr('class', 'explorer')
    					;
			App.Util.addFolderTab(tab, path);

            //App.Files.FoldersRecent.addUnique(path);
            //App.Files.FoldersHistory.addUnique(path);

            if (saveState) {
                App.Commands.CmdIDEStateSave();
            }
		});
	},
	CmdFileOpen: function(fileName, saveState) {
	    if (fileName == '#') return;
	    if (fileName.charAt(fileName.length - 1) == '/') {
	        App.Files.CurrentFolder = fileName.substring(0, fileName.length - 1);
	        App.UI.setStatus('Current folder changed to '+App.Files.CurrentFolder);
	        return false;
	    }
        saveState = saveState || true; //saveState === true;
		var fileNameID = App.Util.fileNameToID(fileName);
		var fileNameShort = App.Util.fileNameToShort(fileName);
		// if the file is already open, switch tabs instead of opening
		if (App.Files.Open && App.Files.Open['div_'+fileNameID] !== undefined) {
			$("#editor").tabs("option", "active", $('#editor a[href="#div_'+fileNameID+'"]').parent().index());
			return;
		}
		//'?fo='+
		App.Commands.CmdFileOpenWorker(fileName);
		return false;
	},
	CmdFileOpenWorker: function(fileName, saveState) {
	    saveState = saveState || true;
	    var fileNameID = App.Util.fileNameToID(fileName);
		$.post('?fo='+fileName).done(function(res) {
		    var editor = $(document.createElement('textarea'))
    						.attr('id', fileNameID)
    						//.html(res)
    						.html(Base64.decode(res))
    						;
            var statusBar = $(document.createElement('div'))
        						.attr('id', 'sb_'+fileNameID)
        						.attr('class', 'statusBar')
        						;
			var tabPanel = $(document.createElement('div'))
    						.attr('id', 'div_'+fileNameID)
    						.attr('class', 'fileContent')
    						.html(editor)
            				.append(statusBar)
            				;
			App.Util.addFileTab(tabPanel, fileName);
			App.UI.setStatus('Opened ' + fileName);
			App.Commands.CmdCreateEditor(fileName);
			App.Commands.CmdFileOpenOrClosedOrSaved(saveState);
		});
	},
	CmdCreateEditor: function(fileName) {
	    var ed = document.getElementById('setting_editor').value;
	    if (ed == "ace")
	        App.Commands.CmdCreateEditorAce(fileName);
	    if (ed == "monaco")
    	    App.Commands.CmdCreateEditorMonaco(fileName);
	},
	CmdCreateEditorMonaco: function(fileName) {
		var fileNameID = App.Util.fileNameToID(fileName);

		require(['vs/editor/editor.main'], function () {
            var content = document.getElementById(fileNameID).value;
            document.getElementById('div_'+fileNameID).innerHTML = '';
			var editor = monaco.editor.create(document.getElementById('div_'+fileNameID), {
				//value: content
				//,language: 'javascript'
				//value: "hello world!" //document.getElementById(fileNameID).value,
			});
			
			var fileTypes = {
                css: 'css',
                js: 'javascript',
                json: 'json',
                md: 'markdown',
                mjs: 'javascript',
                ts: 'typescript'
            };
            
            var model = monaco.editor.createModel(
              content,
              undefined, // language
              monaco.Uri.file(fileName) // uri
            );
            fileName = App.Util.fileNameFromLt(fileName);
            var typ = fileName.split('.').pop();
            typ = fileTypes[typ] ? fileTypes[typ] : typ;
            alert(typ)
			//monaco.editor.setModelLanguage(model, fileTypes[fileName.split['.'].pop()]);
			monaco.editor.setModelLanguage(model, typ);

			/*
			window.onresize = function () {
				editor.layout();
			};


            var model = monaco.editor.createModel(
              content,
              undefined, // language
              monaco.Uri.file(fileName) // uri
            )
            
            editor.setModel(model)

			App.Files.OriginalContent[fileNameID] = editor.getValue();
			App.Files.Editors[fileNameID] = editor;
			App.Files.CurrentFile = fileName;
			*/
		});
	},
	CmdCreateEditorAce: function(fileName) {
		var fileNameID = App.Util.fileNameToID(fileName);
		// load ace and extensions
		//if (false)
		//, "ace/ext/language_tools"
		require([
		        "ace/ace", "ace/split", 
		        "ace/ext/modelist", "ace/ext/language_tools", 
		        "ace/ext/statusbar", 'ace/ext/settings_menu', "ace/ext/emmet",
		        "ace/ext/beautify",
		        ], function(ace, aSplit, modelist, lang, sBar, sMenu, eEmmet,
		        eBeautify) {
			var editor = ace.edit(fileNameID);
        	sMenu.init(editor);
			editor.setTheme(App.Settings.DefaultTheme);
			var defaultOptions = {
                indentedSoftWrap: true
			    //autoFold:true
			};
			if (App.Settings.AutoComplete) {
			    defaultOptions.enableBasicAutocompletion = true;
			    defaultOptions.enableSnippets = true;
			    defaultOptions.enableLiveAutocompletion = true;
			}
            if (App.Settings.FontFamily) {
                defaultOptions.fontFamily = App.Settings.FontFamily;
            }
            if (App.Settings.FontSize) {
                defaultOptions.fontSize = App.Settings.FontSize+App.Settings.FontSizeUnit;
            }
            //editor.setOptions({ fontSize: App.Settings.FontSize+App.Settings.FontSizeUnit });
            editor.setOptions(defaultOptions);
            editor.session.setFoldStyle(App.Settings.AutoFold); // manual markbegin markbeginend
            editor.session.setUseWrapMode(App.Settings.WordWrap);
            editor.session.setUseWrapMode(true);

        	editor.commands.addCommands([{
        		name: "showSettingsMenu",
        		bindKey: {win: "Ctrl-m", mac: "Command-m"},
        		exec: function(editor) {
        			editor.showSettingsMenu();
        		},
        		readOnly: true
        	}]);

            // MARK file TAB as changed
		    editor.getSession().on('change', function(e) {
		    	//App.Files.Changed[fileNameID] = true;
				if (App.Files.hasChanged(fileName)) {
			    	if (!$('#li_'+fileNameID).hasClass('edited')) {
			    		$('#li_'+fileNameID).addClass('edited');
			    	}
				}
			    else {
			    	if ($('#li_'+fileNameID).hasClass('edited')) {
			    		$('#li_'+fileNameID).removeClass('edited');
			    	}
			    }
		    });

            var fileName1 = App.Util.filePathDecode(fileName);
	        var mode = modelist.getModeForPath(fileName1).mode || "text";
	        console.log("Editor mode set to " + mode);
	        editor.session.setMode(mode);

            // exotics
            editor.setOption("enableEmmet", true);
            editor.commands.addCommands(eBeautify.commands)

            // Splitting.
            /*
            var Split = require("ace/split").Split;
            var split = new Split(container, theme, 1);
            env.editor = split.getEditor(0);
            split.on("focus", function(editor) {
                env.editor = editor;
                updateUIEditorOptions();
            });
            env.split = split;
            window.env = env;
            */
            // Splitting.
            //var Split = aSplit.Split;
            //var split = new Split(document.getElementById(fileNameID), App.Settings.DefaultTheme, 1);


            var StatusBar = sBar.StatusBar;
            // create a simple selection status indicator
            //var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
            var statusBar = new StatusBar(editor, document.getElementById("sb_"+fileNameID));


	        editor.resize();
	        $(window).resize();

			App.Files.OriginalContent[fileNameID] = editor.getValue();
			App.Files.Editors[fileNameID] = editor;
			App.Files.CurrentFile = fileName;
		});
	},
	CmdFileClose: function(e){
	    var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
	    if (confirm('Close "'+fileName+'"?'))
	        App.Commands.CmdFileCloseWorker(fileName);
	},
	CmdFileCloseAll: function(e){
	    if (confirm('Close ALL open files?'))
	        for (var f in App.Files.Open)
	            App.Commands.CmdFileCloseWorker(App.Files.Open[f]);
	},
	CmdFileCloseWorker: function(currentFile){
	    App.Files.close(currentFile);
		//$('#li_'+App.Util.fileNameToID(currentFile)).find('.ui-icon-close').click();
	},
	CmdFileDownload: function(event){
	    var fileName = '?fdl='+App.Files.CurrentFile;
	    window.location.href = fileName;
	    /** /
		var newwindow = window.open('?fdl='+fileName,'_dl','height=200,width=150');
		window.setTimeout(function(){
            newwindow.close();
        }, 1000);
        /**/
        App.UI.setStatus('Downloaded '+fileName);
	},
	CmdFileSave: function(event){
		var fileName = App.Files.CurrentFile;
		var fileNameID = App.Util.fileNameToID(fileName);
    	if ($('#li_'+fileNameID).hasClass('edited')) {
    		$('#li_'+fileNameID).removeClass('edited');
    	}
    	var currentFileContent = App.Files.Editors[fileNameID].getValue();
    	$('.cmdBtnFileSave').attr('disabled', 'disabled');
    	App.Commands.CmdFileSaveWorker();
	},
	CmdFileSaveAs: function(fileName) {
	    var newFileName = prompt("New file name", App.Files.CurrentFolder + "/untitled.txt");
	    if (newFileName) {
        	$('.cmdBtnFileSaveAs').attr('disabled', 'disabled');
	        App.Commands.CmdFileSaveWorker(newFileName, App.Commands.CmdExplorersReload);
	    }
	},
	CmdFileSaveWorker: function(newFileName, afterSaveCallback) {
	    var isCreateNew = false;
		var fileName = App.Files.CurrentFile;
		var fileNameID = App.Util.fileNameToID(fileName);
		if (newFileName !== undefined) {
            fileName = newFileName;
            isCreateNew = true;
		}
		//var fileName = newFileName !== undefined ? newFileName : App.Files.CurrentFile;
    	var fileContent = App.Files.Editors[fileNameID].getValue();
    	fileContent = Base64.encode(Base64.encode(fileContent));
    	var fileNameLt = App.Util.fileNameToLt(fileName);
    	$.post('?fs='+fileNameLt, { data: fileContent }).done(function(res) {
			//$(document.createElement('div')).html(res);
			App.UI.setStatus('Saved '+fileName);
    		App.Files.OriginalContent[fileNameID] = fileContent;
    		$('.cmdBtnFileSave').removeAttr('disabled');
    		$('.cmdBtnFileSaveAs').removeAttr('disabled');
            App.Commands.CmdFileOpenOrClosedOrSaved();
            if (afterSaveCallback) afterSaveCallback();
            if (isCreateNew) App.Commands.CmdFileOpen(fileNameLt);
        }).always(function(res) {
            return;
			//$(document.createElement('div')).html(res);
			$.post('?fo='+fileNameLt).done(function(res2) {
			    if (res2 != fileContent)
		            alert('Saving may have failed! Re-opening file returned different content from what should have been saved. Please double check yourself before closing the document.');
			});
		});
	},
	CmdFileDelete: function(e){
		var fileName = App.Files.CurrentFile;
		if (!confirm('Delete '+fileName+' ?')) return;
		var fileNameID = App.Util.fileNameToID(fileName);
		$.post('?fd='+fileName).done(function(res) {
			App.Commands.CmdExplorersReload();
			if (confirm('Close deleted file '+fileName+' ?')) 
				App.Commands.CmdFileClose();
		});
	},
    CmdFileOpenOrClosedOrSaved: function(saveState){
        saveState = saveState || true;
        if (saveState)
            App.Commands.CmdIDEStateSave();
    },
    CmdFileRevert: function(event) {
		var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
        if (confirm('Are you sure you want to revert the contents of "'+fileName+'" to the last saved version??')) {
            var fileNameID = App.Util.fileNameToID(fileName);
            App.Files.Editors[fileNameID].setValue(App.Files.OriginalContent[fileNameID], -1);
            //App.Files.Editors[fileNameID].clearSelection();
        }
    },
	// EDIT commands
	CmdEditUndo: function(e){
		var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
        var fileNameID = App.Util.fileNameToID(fileName);
        var um = App.Files.Editors[fileNameID].getSession().getUndoManager();
        if (um.hasUndo())
            um.undo(false);
    //App.Files.Editors[App.Util.fileNameToID(App.Util.fileNameFromLt(App.Files.CurrentFile))].getSession().getUndoManager().hasUndo();
	},
	CmdEditRedo: function(e){
		var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
        var fileNameID = App.Util.fileNameToID(fileName);
        var um = App.Files.Editors[fileNameID].getSession().getUndoManager();
        if (um.hasRedo())
            um.redo(false);
	},
	CmdEditCut: function(e){
	    document.execCommand('cut');
	},
	CmdEditCopy: function(e){
	    document.execCommand('copy');
	},
	CmdEditPaste: function(e){
		alert("Unfortunately doesn't work. Use Ctrl+V keyboard shortcut.")
	},
	CmdEditDelete: function(e){},
	CmdEditFind: function(e){
		var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
        var fileNameID = App.Util.fileNameToID(fileName);
        App.Files.Editors[fileNameID].execCommand('find');
	},
	CmdEditReplace: function(e){
		var fileName = App.Util.fileNameFromLt(App.Files.CurrentFile);
        var fileNameID = App.Util.fileNameToID(fileName);
        App.Files.Editors[fileNameID].execCommand('replace');
	},
	// UTILITY and VIEW
	CmdExplorerReload: function(path1) {
	    if (path1 === undefined) return;
		$.post('?fl='+path1).done(function(res) {
		    var path = path1;
		    var pathID = App.Util.filePathToID(path);
			App.Files.ExplorersData[pathID] = JSON.parse(res);
			
			if (App.Files.ExplorersExpandedFolders[pathID])
	            App.Files.ExplorersData[pathID] = App.Util.expandNodes(App.Files.ExplorersData[pathID], pathID);
			
    		$('#exp_'+pathID).treeview({data:App.Files.ExplorersData[pathID],levels:1,enableLinks:true});
    		$('#exp_'+pathID).click(function() { App.Util.autoUpdateExplorerHoverTitles(path); });
    		App.Util.autoUpdateExplorerHoverTitles(path);
		});
	},
	CmdExplorersReload: function() {
        for (var currentFolder in App.Files.ExplorersRoots)
	        App.Commands.CmdExplorerReload(App.Files.ExplorersRoots[currentFolder]);
	},
	CmdClearBackups: function() {
        if (!confirm('Delete all backup files?')) return;
		$.post('?bc=true').done(function(res) {
			// reload explorer. but what if backup folder isn't loaded? in current view?
			App.Commands.CmdExplorersReload();
		});
	},
	CmdToggleWordWrap: function() {
	    var isWrapEnabled = App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)].getSession().getUseWrapMode();
	    App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)].getSession().setUseWrapMode(!isWrapEnabled);
	},
	CmdToggleFold: function() {
	    var currentFileID = App.Util.fileNameToID(App.Files.CurrentFile);
	    if (App.Flags.codeFoldedFor[currentFileID]) {
	        App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)].getSession().unfold();
	        App.Flags.codeFoldedFor[currentFileID] = false;
	    } else {
	        App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)].getSession().foldAll();
	        App.Flags.codeFoldedFor[currentFileID] = true;
	    }
	},
	CmdBrowserPreview: function(el) {
	    var fileName = App.Util.filePathDecode(App.Files.CurrentFile);
	    window.open(fileName);
	},
	// IDE features
	CmdIDEFullscreen: function() {
        App.Util.requestFullScreen();
	},
	CmdIDEStateSave: function() {
        if (typeof(Storage) === "undefined") {
            alert('Saving state is not supported by current browser.');
            return;
        }
        App.Util.appStateSave('App.Files.FilesRecent', App.Files.FilesRecent);
        App.Util.appStateSave('App.Files.FilesHistory', App.Files.FilesHistory);
        App.Util.appStateSave('App.Files.FoldersRecent', App.Files.FoldersRecent);
        App.Util.appStateSave('App.Files.FoldersHistory', App.Files.FoldersHistory);

        App.Util.appStateSave('App.Files.ExplorersRoots', App.Files.ExplorersRoots);
        App.Util.appStateSave('App.Files.ExplorersExpandedFolders', App.Files.ExplorersExpandedFolders);

	    App.Util.appStateSave('App.Settings', App.Settings);
	    App.Util.appStateSave('App.Files.Open', App.Files.Open);
	    //App.Util.appStateSave('App.Files.OriginalContent', App.Files.OriginalContent);
	},
	CmdIDEStateRestore: function() {
        App.Files.FilesRecent = App.Util.appStateRestore('App.Files.FilesRecent') || [];
        App.Files.FilesHistory = App.Util.appStateRestore('App.Files.FilesHistory') || [];
        App.Files.FoldersRecent = App.Util.appStateRestore('App.Files.FoldersRecent') || [];
        App.Files.FoldersHistory = App.Util.appStateRestore('App.Files.FoldersHistory') || [];

	    // load settings this way to keep possible new settings instead of just loading old settings
	    var loadedSettings = App.Util.appStateRestore('App.Settings');
	    if (loadedSettings)
	        for (var setting in loadedSettings)
                App.Settings[setting] = loadedSettings[setting];

	    // EDITORS
	    App.Files.Open = App.Util.appStateRestore('App.Files.Open');
	    // open files are reloaded and tabs created
	    for (var i in App.Files.Open) {
	        App.Commands.CmdFileOpenWorker(App.Files.Open[i]);
	    }
	    //App.Files.OriginalContent = App.Util.appStateRestore('App.Files.OriginalContent');

        // MountPoints
	    App.Files.ExplorersExpandedFolders = App.Util.appStateRestore('App.Files.ExplorersExpandedFolders');
        var explorersRoots = App.Util.appStateRestore('App.Files.ExplorersRoots');
	    if (explorersRoots !== undefined) 
    	    for (var path in explorersRoots)
    	        App.Commands.CmdFolderOpen(explorersRoots[path], false);
    	        //Init.ExplorerInstance(explorersRoots[path], false);
	},
	CmdIDEStateClear: function() {
	    App.Util.appStateClear('App.Files.Settings');
	    App.Util.appStateClear('App.Files.RootDir');
	    App.Util.appStateClear('App.Files.Folders');
	    App.Util.appStateClear('App.Files.ExpandedFolders');
	    App.Util.appStateClear('App.Files.Open');
	    //App.Util.appStateClear('App.Files.OriginalContent');
	},
	CmdIDEOptionsDialog: function() {
	    // set options UI
	    document.getElementById('setting_autofold').checked = App.Settings.AutoFold;
        document.getElementById('setting_wordwrap').checked = App.Settings.WordWrap;
        document.getElementById('setting_autocomplete').checked = App.Settings.AutoComplete;
        document.getElementById('setting_rootfolder').value = App.Settings.RootFolder;
        document.getElementById('setting_fontfamily1').value = App.Settings.FontFamily;
        document.getElementById('setting_fontsize1').value = App.Settings.FontSize;
        document.getElementById('setting_fontsizeunit1').value = App.Settings.FontSizeUnit;
        document.getElementById('setting_defaulttheme1').value = App.Settings.DefaultTheme;
	    $('#dlgIDEOptions').tabs();
		$('#dlgIDEOptions').dialog({
	        modal: true,
	        title: 'IDE options',
	        zIndex: 10000,
	        autoOpen: true,
	        width: 'auto',
	        resizable: true,
	        buttons: {
	            Save: function () {
	                App.Commands.CmdIDEOptionsSave();
	                console.log("IDE settings saved.");
	                $(this).dialog("close");
	            },
	            Cancel: function () {
	                console.log("IDE settings restored.")
	                $(this).dialog("close");
	            }
	        }
	    });
	},
	CmdIDEOptionsSave: function() {
        App.Settings.AutoFold = document.getElementById('setting_autofold').value;
        App.Settings.WordWrap = document.getElementById('setting_wordwrap').checked;
        App.Settings.AutoComplete = document.getElementById('setting_autocomplete').checked;
        App.Settings.RootFolder = document.getElementById('setting_rootfolder').value;

        var newFontFamily = document.getElementById('setting_fontfamily1').value;
        if (App.Settings.FontFamily != newFontFamily)
            try {
        	    for (var editor in App.Files.Editors)
        	        App.Files.Editors[editor].setOptions({ fontFamily: newFontFamily });
                App.Settings.FontFamily = newFontFamily;
            } catch (e) { }

        var newFontSizeUnit = document.getElementById('setting_fontsizeunit1').value;
        if (App.Settings.FontSizeUnit != newFontSizeUnit)
            try {
        	    for (var editor in App.Files.Editors)
        	        App.Files.Editors[editor].setOptions({ fontSize: App.Settings.FontSize+newFontSizeUnit });
                App.Settings.FontSizeUnit = newFontSizeUnit;
            } catch (e) { }

        var newFontSize = document.getElementById('setting_fontsize1').value;
        if (App.Settings.FontSize != newFontSize)
            try {
        	    for (var editor in App.Files.Editors)
        	        App.Files.Editors[editor].setOptions({ fontSize: newFontSize+App.Settings.FontSizeUnit });
                App.Settings.FontSize = newFontSize;
            } catch (e) { }

        var newTheme = document.getElementById('setting_defaulttheme1').value;
        if (App.Settings.DefaultTheme != newTheme)
            try {
                App.Commands.CmdIDESetDefaultTheme(newTheme);
                App.Settings.DefaultTheme = newTheme;
            } 
            catch (e) { 
                var t = e;
                alert(e);
            }
        App.Commands.CmdIDEStateSave();
	},
	_CmdIDEOptionsApply: function() {
	    
	},
	CmdIDESetMode: function() {
	    App.Files.getCurrentEditor().getSession().setMode("ace/mode/" + $(this).val());
	},
	CmdIDESetDefaultTheme: function(theme) {
	    for (var editor in App.Files.Editors)
	        App.Files.Editors[editor].setTheme(theme);
	},
	CmdIDESetTheme: function() {
	    App.Files.getCurrentEditor().setTheme($(this).val());
	},
	// MountPoints toolbar
	CmdBrowseSelectFolderReload: function(path) {
        path = path || '.';
        App.Files.CurrentFolder = path;
        var pathID = App.Util.filePathToID(path);
        path = App.Util.filePathEncode(path);
        $.post('?fb='+path).done(function(res) {
            $('#dlgBrowseFolder .folderContent').html(res);
            $('#dlgBrowseFolder .folderContent a.folder').each(function(ev){
                var a = $(this);
                var originalHref = a.attr('href');//.replace(/\.\//g, '');;
                a.attr(
                    'href', 
                    a.hasClass('folder') 
                        ? 'javascript:App.Commands.CmdBrowseSelectFolderReload(\''+originalHref+'\');' 
                        : '#'
                );
            });
        });
	},
	CmdBrowseSelectFolder: function(callback) {
        App.Commands.CmdBrowseSelectFolderReload('.');
	    if (App.UI.Dialogs.Browse == null) {
	        App.UI.Dialogs.Browse = $('#dlgBrowseFolder').dialog({
    	        modal: true,
    	        title: 'Select folder',
    	        zIndex: 10000,
    	        autoOpen: true,
    	        width: 400,
    	        height: 400,
    	        minWidth: 400,
    	        minHeight: 300,
    	        maxWidth: 800,
    	        maxHeight: 600,
    	        resizable: true,
    	        buttons: {
    	            "Select current folder": function () {
    	                callback()
    	                $(this).dialog("close");
    	            },
    	            Cancel: function () {
    	                console.log("IDE settings restored.")
    	                $(this).dialog("close");
    	            }
    	        }
    	    });
	    } else App.UI.Dialogs.Browse.dialog('open');
	},
    CmdBrowseFolderSelected: function(path) {
        path = path || App.Files.CurrentFolder;
        var pathID = App.Util.filePathToID(path);
        //if (App.Files.ExplorersRoots == null) App.Files.ExplorersRoots = {};
        //App.Files.ExplorersRoots = App.Files.ExplorersRoots || {};
        //App.Files.ExplorersRoots[pathID] = path;
        App.Commands.CmdFolderOpen(path);
        //Init.ExplorerInstance(path);
	},
	CmdExplorerSearch: function() {
	    
	},
	CmdBrowseNewReload: function(path) {
        path = path || '.';
        App.Files.CurrentFolder = path;
        var pathID = App.Util.filePathToID(path);
        path = App.Util.fileNameToLt(path);
        $.post('?fb='+path).done(function(res) {
            $('#dlgBrowseNew .folderContent').html(res);
            $('#dlgBrowseNew .folderContent a.folder').each(function(ev){
                var a = $(this);
                var originalHref = a.attr('href');//.replace(/\.\//g, '');;
                a.attr(
                    'href', 
                    a.hasClass('folder') 
                        ? 'javascript:App.Commands.CmdBrowseNewReload(\''+originalHref+'\');' 
                        : '#'
                );
            });
        });
	},
	CmdBrowseNew: function(callback) {
        //App.Commands.CmdBrowseNewReload('.');
        App.Commands.CmdBrowseNewReload(App.Files.CurrentFolder);
	    if (App.UI.Dialogs.BrowseNew == null) {
	        App.UI.Dialogs.BrowseNew = $('#dlgBrowseNew').dialog({
    	        modal: true,
    	        title: 'Create',
    	        zIndex: 10000,
    	        autoOpen: true,
    	        width: 400,
    	        height: 600,
    	        minWidth: 400,
    	        minHeight: 300,
    	        maxWidth: 800,
    	        maxHeight: 600,
    	        resizable: true,
    	        buttons: {
    	            /*
    	            "Upload selected file to current folder": function() {
    	                App.Commands.CmdExplorersReload();
    	                $(this).dialog("close");
    	            },*/
    	            "Close": function () {
    	                //console.log("IDE settings restored.")
    	                App.Commands.CmdExplorersReload();
    	                $(this).dialog("close");
    	            }
    	        }
    	    });
    	    $('#dlgBrowseNew .cmdBtnBrowseFileCreateFolder').click(function(){
    	        var url = App.Util.fileNameToLt($('#dlgBrowseNewPath').html()) +'/'+$('#dlgBrowseNewName').val();
    	        $.post('?foc='+url)
    	        .done(function(res){
    	            App.Commands.CmdBrowseNewReload($('#dlgBrowseNewPath').html());
    	        });
    	    });
	    } else App.UI.Dialogs.BrowseNew.dialog('open');
	},
	CmdBrowseFileCreateFile: function(event) {
	    var fileName = document.getElementById('dlgBrowseNewName').value;
		var path = App.Files.CurrentFolder; //document.getElementById('dlgBrowseNewPath').innerHTML;
		var newFileName = App.Util.fileNameToLt(path + '/' + fileName);
		if (!confirm('Create '+newFileName+'?')) return;
		$.post('?fc='+newFileName).done(function(res) {
			if (confirm('Open created file '+newFileName+'?')) 
				App.Commands.CmdFileOpen(newFileName);
			App.UI.Dialogs.BrowseNew.dialog('close');
		});
	},
};

var Init = {
	Layout: function() {

    	function resizeInnerLayout () {
    		if (emailListingLayout && $("#emailListing").is(":visible"))
    			emailListingLayout.resizeAll();
    		else if (emailEditLayout && $("#emailEdit").is(":visible"))
    			emailEditLayout.resizeAll();
    	};

	    var layoutOptions = {
	        applyDefaultStyles: false, 
			west__size: 250,
			south__size: 1,
		//	north__size: 1,
			stateManagement__enabled: true
		//,	north__spacing_open:	0
		//,	north__resizable:		false
		,	south__resizable:		false
		,	south__spacing_open:	0
		//,	center__onresize:		resizeInnerLayout
		/*	sample formats for customizing stateManagement.keys * /
		,	stateManagement__stateKeys:	"west.size,east.size,west.isClosed,east.isClosed"
		,	stateManagement__stateKeys:	"west.size,north.size"		// state-keys in sub-key format
		,	stateManagement__stateKeys:	"west__size,north__size"	// state-keys in flat-format
		/**/

		/*	enable this block to use the CUSTOM state-management functions above * /
		,	stateManagement__autoLoad:	false // disable automatic cookie-load
		,	stateManagement__autoSave:	false // disable automatic cookie-save
		,	onload:						customLoadState // run custom state-code when Layout loads
		,	onunload:					customSaveState // ditto when page unloads OR Layout is 'destroyed'
		/**/
		}

		App.Layout = $('#editorPanel').layout(layoutOptions);
		$(window).resize(function() {
		    var headerHeight = ($('#toolbar')[0].clientHeight) + 'px';
		    $('#editorPanel').css('height', 'calc(100% - ' + headerHeight + ')');
		});
	},
    ExplorerInstances: function() {
        var anyExplorers = false;
        for (var root in App.Files.ExplorersRoots)
            if (App.Files.ExplorersRoots[root]) anyExplorers = true;
        if (!anyExplorers) {
            if (App.Settings.RootFolder) {
                App.Commands.CmdFolderOpen(App.Settings.RootFolder);
            } else {
                App.Commands.CmdFolderOpen('.');
                App.Commands.CmdFolderOpen('..');
            }
        }
    },
	Ace: function() {
		// setup paths
		if (App.Flags.aceIncluded === false) {
			require.config({paths: { "ace" : "lib/ace/lib/ace"}});
			App.Flags.aceIncluded = true;
		}
		Init.SetLayoutRefreshInterval();
	},
	Monaco: function() {
		// setup paths
		if (App.Flags.monacoIncluded === false) {
            require.config({paths: { "vs" : "lib/monaco/min/vs"}});
			App.Flags.monacoIncluded = true;
		}
		Init.SetLayoutRefreshInterval();
	},
	SetLayoutRefreshInterval: function() {
	    if (App.LayoutRefreshInterval == null) { 
    		App.LayoutRefreshInterval = setInterval(function() {
    			//var fileTabsHeight = $('#fileTabs').css('height');
    			//fileTabsHeight = parseInt(fileTabsHeight) + 1;
    			var fileTabsHeight = parseInt($('#fileTabs').css('height')) + 1;
    			var toolBarHeight = parseInt($('#explorer .btn-toolbar').css('height')) + 1;
    			var explorerTabsHeight = parseInt($('#explorerTabs').css('height')) + 1;
    			var statusBarHeight = 0;
    			if (App.Files.Open != null && App.Files.Open.length > 0)
    			    statusBarHeight = parseInt($('#sb_'+App.Files.getCurrentFileID()).css('height')) + 1;
    
    			$('#editor .fileContent').css('height', 'calc(100% - '+ (fileTabsHeight+statusBarHeight+20) +'px)');
    			$('#explorers').css('height', 'calc(100% - '+ (toolBarHeight) +'px)');
    			$('#explorers .explorer').css('height', 'calc(100% - '+ (explorerTabsHeight+toolBarHeight) +'px)');
    		}, 1000);
	    }
	},
	Toolbars: function() {
	    // Editor toolbar
		$('.cmdBtnFileClose').click(App.Commands.CmdFileClose);
		$('.cmdBtnFileCloseAll').click(App.Commands.CmdFileCloseAll);
		$('.cmdBtnFileDownload').click(App.Commands.CmdFileDownload);
		$('.cmdBtnFileSave').click(App.Commands.CmdFileSave);
		$('.cmdBtnFileSaveAs').click(App.Commands.CmdFileSaveAs);
		$('.cmdBtnFileDelete').click(App.Commands.CmdFileDelete);
		$('.cmdBtnFileRevert').click(App.Commands.CmdFileRevert);
		
		$('.cmdBtnEditCut').click(App.Commands.CmdEditCut);
		$('.cmdBtnEditCopy').click(App.Commands.CmdEditCopy);
		$('.cmdBtnEditPaste').click(App.Commands.CmdEditPaste);
		$('.cmdBtnEditDelete').click(App.Commands.CmdEditDelete);
		$('.cmdBtnEditUndo').click(App.Commands.CmdEditUndo);
		$('.cmdBtnEditRedo').click(App.Commands.CmdEditRedo);
		$('.cmdBtnEditFind').click(App.Commands.CmdEditFind);
		$('.cmdBtnEditReplace').click(App.Commands.CmdEditReplace);

        $('.cmdBtnIDEFullscreen').click(App.Commands.CmdIDEFullscreen);
        $('.cmdBtnIDEOptions').click(App.Commands.CmdIDEOptionsDialog);
		$('.cmdBtnClearBackups').click(App.Commands.CmdClearBackups);
		$('.cmdBtnStateSave').click(App.Commands.CmdIDEStateSave);
		$('.cmdBtnStateRestore').click(App.Commands.CmdIDEStateRestore);
		$('.cmdBtnStateClear').click(App.Commands.CmdIDEStateClear);

        $('.cmdBtnWordWrap').click(App.Commands.CmdToggleWordWrap);
		$('.cmdBtnToggleFold').click(App.Commands.CmdToggleFold);
		$('.cmdBtnBrowserPreview').click(App.Commands.CmdBrowserPreview);
		$('.cmdBtnSetMode').change(App.Commands.CmdIDESetMode);
		$('.cmdBtnSetTheme').change(App.Commands.CmdIDESetTheme);

		var fontFamilies = [
		    /*
		    'monospace', 'source-code-pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'fixedsys',
		    'Courier New', 'Courier', 'Lucida Console',
		    
		    'Andale Mono', 'Courier', 'Monaco', 'Profont', 'Monofur', 'Proggy', 'Droid Sans Mono', 'Deja Vu Sans Mono', 'Consolas', 'Inconsolata',
		    'Courier New', 'Lucida Sans Typewriter', 'Apercu Mono', 'GT Pressura Mono', 'Maison Mono', 'Nitti', 'Letter Gothic', 'Anonymous Pro', 'Pitch', 'Space Mono',
		    
		    'Bitstream Vera Sans Mono', 'DejaVu Sans Mono', 'High Tower Text', 'Lucida Console', 'Rockwell', 'Sitka Text', 'System', 'Tahoma', 'Terminal', 'Trebuchet MS',
            */
            'Bitstream Vera Sans Mono', 
            'Consolas',
            'Courier', 
            'Courier New', 
            'DejaVu Sans Mono', 
            'Lucida Console',
            'Lucida Sans Typewriter', 
            'monospace'
		]; {
		$('.cmdBtnSetFontFamily').append('<option value="monospace" style="font-family: monospace">Set font</option>');
		for (var fontFamily in fontFamilies) //if (fontFamily != "contains" && fontFamily != "addUnique") 
		{
            $('.cmdBtnSetFontFamily').append(
                '<option value="'+fontFamilies[fontFamily]+'" style="font-family: '+fontFamilies[fontFamily]+';">'+
                    fontFamilies[fontFamily]+
                '</option>'
            );
            /*
            $('.cmdBtnSetFontFamily').append(
                '<option value="'+fontFamilies[fontFamily]+'" style="font-family: '+fontFamilies[fontFamily]+';">abAB/X - '+
                    fontFamilies[fontFamily]+
                '</option>'
            );
            $('.cmdBtnSetFontFamily').append(
                '<option value="'+fontFamilies[fontFamily]+'" style="font-family: '+fontFamilies[fontFamily]+';">.,iI|x - '+
                    fontFamilies[fontFamily]+
                '</option>'
            );
            */
		}
        $('.cmdBtnSetFontFamily').val(App.Settings.FontFamily);
		$('.cmdBtnSetFontFamily').change(function() { 
		    App.Files.getCurrentEditor().setOptions({ 
    		    fontFamily: $(this).val()
    		});
		});
		}
		
		var fontSizeUnits = [ 'px', 'pt', 'em' ]; {
		$('.cmdBtnSetFontSizeUnits').append('<option>Font size unit</option>');
		for (var fontSizeUnit in fontSizeUnits) //if (fontSizeUnit != "contains" && fontSizeUnit != "addUnique")
            $('.cmdBtnSetFontSizeUnits').append(
                '<option value="'+fontSizeUnits[fontSizeUnit]+'">'+
                    fontSizeUnits[fontSizeUnit]+
                '</option>'
            );
        $('.cmdBtnSetFontSizeUnits').val(App.Settings.FontSizeUnit);
		$('.cmdBtnSetFontSizeUnits').change(function() { 
		    App.Files.getCurrentEditor().setOptions({ 
    		    fontSize: App.Settings.FontSize + $(this).val()
    		});
		});
        }

		var fontSizes = [ 8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 24 ]; {
		$('.cmdBtnSetFontSize').append('<option>Font size</option>');
		for (var fontSize in fontSizes) //if (fontSize != "contains" && fontSize != "addUnique")
            $('.cmdBtnSetFontSize').append(
                '<option value="'+fontSizes[fontSize]+'" style="font-size: '+fontSizes[fontSize]+';">'+
                    fontSizes[fontSize]+
                '</option>'
            );
        $('.cmdBtnSetFontSize').val(App.Settings.FontSize);
		$('.cmdBtnSetFontSize').change(function() { 
		    App.Files.getCurrentEditor().setOptions({ 
    		    fontSize: $(this).val() + App.Settings.FontSizeUnit
    		});
		});
		}

		// MountPoints toolbar
		$('#explorer .btn-toolbar .cmdBtnBrowseReload').click(function() { App.Commands.CmdExplorerReload(); });
		$('#explorer .btn-toolbar .cmdBtnBrowsersReload').click(function() { App.Commands.CmdExplorersReload(); });
		$('#explorer .btn-toolbar .cmdBtnBrowseSelectFolder').click(function() { App.Commands.CmdBrowseSelectFolder(App.Commands.CmdBrowseFolderSelected); });
		$('#explorer .btn-toolbar .cmdBtnBrowseNew').click(function() { App.Commands.CmdBrowseNew(App.Commands.CmdBrowseFolderSelected); });
		$('#explorer .btn-toolbar .search').keyup(App.Commands.CmdExplorerSearch);
		
		$('#dlgBrowseNew .cmdBtnBrowseFileCreateFile').click(App.Commands.CmdBrowseFileCreateFile);
		
	},
	Keyboard: function() {
	    $(window).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        App.Commands.CmdFileSave();
                        //$('.cmdBtnFileSave').click(); // so that the icon also gets disabled
                        //App.Commands.CmdFileSave();
                        //alert('ctrl-s');
                        break;
                    /** /
                    case 'f':
                        event.preventDefault();
                        alert('ctrl-f');
                        break;
                    case 'g':
                        event.preventDefault();
                        alert('ctrl-g');
                        break;
                    /**/
                }
            }
        });
	}
};

var App = {
	Commands: AppCommands,
	Init: function() {
	    App.Settings.RootFolder = params.defaultExplorerPath;
	    App.Commands.CmdIDEStateRestore();
		Init.Layout();
	    Init.ExplorerInstances();
		Init.Ace();
		Init.Monaco();
		Init.Toolbars();
		Init.Keyboard();
	},
	Settings: {
	    AutoFold: 'markbeginend',
	    WordWrap: false,
	    AutoComplete: true,
	    RootFolder: params.defaultExplorerPath,
	    FontFamily: "monospace",
	    FontSize: 10,
	    FontSizeUnit: 'px',
	    DefaultTheme: "ace/theme/twilight"
	},
	UI: {
	    DOM: null,
        ContentTabs: null,
        MountPoints: null,
        Dialogs: {
            IDE: null,
            Browse: null,
            BrowseNew: null
        },
        setStatus: function(txt) {
            $('#statusBar').html(txt);
        },
        TabCloseButtonTemplate: 
            '<span class="glyphicon glyphicon-remove close" aria-hidden="true"></span>'
			//'<span class="ui-icon ui-icon-close close" role="presentation">Close</span>'
			//'<i class="fa fa-window-close close" aria-hidden="true"></i>'
	},
	Layout: null,
	LayoutRefreshInterval: null,
	Flags: {
		aceIncluded: false,
		monacoIncluded: false,
		codeFoldedFor: {}
	},
	Files: {
	    // editors are common among any explorer window. the same file may have
	    // a different relative path due to originating explorer tabs and thus
	    // open in different editor instances under different aliases. if one
	    // tab changes the file, the other is not aware of this. possible solution
	    // reload file from server on filetab activate and check for changes.
		Editors: [],
		Models: [],

		ExplorersData: {}, // placeholder for bootstrap treeview data structure
		ExplorersRoots: {}, // placeholder for array of open explorer tabs "explorer_path : explorer_pathID"
		ExplorersExpandedFolders: {}, // placeholder for which folders should be opened after reload updates on every treenode toggle [explorer_pathID][fileNameID] = fileName

		Open: {}, // { "file1path" : "file1id" }, { "file2path" : "file2id" }, ...
		OriginalContent: {}, // { "file1id" : file1editor.getValue() }, ... on each open/save

		CurrentFile: null, // updates on file open or file tab switch
		PreviousFile: null, // updates whenever CurrentFile is changed
		FilesRecent: [], // should add the most recent file on open and remove old files
		FilesHistory: [], // same as RecentFiles, but much much longer list

		CurrentFolder: null, // updates on folder open or explorer tab switch
		FoldersRecent: [], // should add the most recent folder on explorer open and remove old entries
		FoldersHistory: [], // same as RecentFolders, but much much longer list

		CurrentBrowserFolder: null, // updates on folder open or explorer tab switch

		getCurrentEditor: function() {
		   return App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)];
		},
		getCurrentFileID: function() {
		    return App.Util.fileNameToID(App.Files.CurrentFile);
		},
		isOpen: function(fileName) {
			return App.Files.Open['div_'+App.Util.fileNameToID(fileName)] != undefined;
		},
		close: function(fileName) {
			var fileNameID = App.Util.fileNameToID(fileName);
			var fileTab = $('#li_'+fileNameID+' .close');
			var fileName1 = App.Util.filePathDecode(fileName);
			if (App.Files.hasChanged(fileName)) {
			    // filenName1 ?= App.Files.Open[$( fileTab ).closest( "li" ).attr( "aria-controls" )]
				if (confirm('Save "' + fileName1 + '"?')) {
					App.Commands.CmdFileSave(fileName);
				}
				else if (!confirm('Close anyway?')) 
					return;
			}
			var panelId = $( fileTab ).closest( "li" ).remove().attr( "aria-controls" );
			$( "#" + panelId ).remove();
			delete App.Files.Open[panelId];
			App.UI.ContentTabs.tabs( "refresh" );
			App.Commands.CmdFileOpenOrClosedOrSaved();
		},
		closeExplorer: function(path) {
			var pathID = App.Util.filePathToID(path);
			var path1 = App.Util.filePathDecode(path);
			if (!confirm('Close "' + path1 + '"?')) 
				return;
			$( "#exp_" + pathID ).remove();
			$( "#li_" + pathID ).remove();
			delete App.Files.ExplorersRoots[pathID];
			delete App.Files.ExplorersData[pathID];
			delete App.Files.ExplorersExpandedFolders[pathID];
			App.UI.MountPoints.tabs( "refresh" );
			App.Commands.CmdIDEStateSave();
		},
		hasChanged: function(fileName) {
			var fileNameID = App.Util.fileNameToID(fileName);
			if (App.Files.OriginalContent[fileNameID] != App.Files.Editors[fileNameID].getValue()) {
				return true;
			}
			return false;
			var changedFiles = [];
			for (var i = 0; i < App.Files.Open.length; i++) {
				var fileNameID = App.Util.fileNameToID(App.Files.Open[i]);
				if (App.Files.OriginalContent[fileNameID] == App.Files.Editors[fileNameID]) {
					changedFiles.push(fileNameID)
				}
			}
			return changedFiles;
		},
	},
	Util: {
		filePathEncode: function(filePath) {
			var filePathID = filePath.replace(/\./g, '˙').replace(/\//g, '´');
			return filePathID;
		},
		filePathDecode: function(filePath) {
			var filePathID = filePath.replace(/\˙/g, '.').replace(/\´/g, '/');
			return filePathID;
		},
		filePathToID: function(filePath) {
			var filePathID = "" + filePath.replace(/\<|\>|\.|\/|\˙|\´/g, '_');
			return filePathID;
		},
		fileNameToID: function(fileName) {
			var fileNameID = "" + fileName.replace(/\<|\>|\.|\/|\˙|\´/g, '_');
			return fileNameID;
		},
		fileNameToShort: function(fileName) {
			//var fileNameShort = fileName.substring(fileName.lastIndexOf('/')+1);
			var fileNameShort = fileName.substring(fileName.lastIndexOf('´')+1);
			return fileNameShort;
		},
		fileNameToLt: function(fileName) {
			var fileNameID = App.Util.filePathEncode(fileName);
			return fileNameID;
		},
		fileNameFromLt: function(fileName) {
			var fileNameID = App.Util.filePathDecode(fileName);
			return fileNameID;
		},
		autoUpdateExplorerHoverTitles: function(path) {
		    var pathID = App.Util.filePathToID(path);
			// make titles show the full file name
			$('#exp_'+pathID+' a').each(function(a) {
			    var a = $(this);
    		    var originalHref = a.attr('href');
			    var newHref = 'javascript:App.Commands.CmdFileOpen(\"'+originalHref+'\");';
			    var fileName = a.html();
			    //alert(newHref);
			    a.attr('href', newHref);
				a.attr('title', fileName);
				a.attr('data-filename', originalHref);
			});
		    // once filenames are known, save all open folders
		    App.Files.ExplorersExpandedFolders = App.Files.ExplorersExpandedFolders || {};
		    App.Files.ExplorersExpandedFolders[pathID] = {};
		    $('#exp_'+pathID+' .glyphicon.glyphicon-minus').each(function() {
			    $(this).parent().find('a').each(function(e){
			        var fileName = $(this).attr('data-filename');
			        var fileNameID = App.Util.fileNameToID(fileName);
			        App.Files.ExplorersExpandedFolders[pathID][fileNameID] = fileName;
			    });
		    });
		    App.Files.Folders = explorerJson;
		    //App.Commands.CmdIDEStateSave();
		},
		expandNodes: function(nodes, pathID) {
            //for (var i = 0; i < nodes.length; i++) 
            for (var i in nodes)
            {
                if (App.Util.isNodeExpanded(nodes[i].href, pathID))
                    nodes[i].state = { expanded: true };
                if (nodes[i].nodes !== undefined)
                    nodes[i].nodes = App.Util.expandNodes(nodes[i].nodes, pathID);
            }
            return nodes;
		},
		isNodeExpanded: function(node, pathID) {
		    for (var i in App.Files.ExplorersExpandedFolders[pathID]) {
		        if (node == App.Files.ExplorersExpandedFolders[pathID][i])
		            return true;
		    }
		    return false;
		},
		addFileTab: function(tab, fileName) {
		    var fileName1 = App.Util.filePathDecode(fileName);
			var fileNameID = App.Util.fileNameToID(fileName);
			var fileNameShort = App.Util.fileNameToShort(fileName1);
			$('#fileTabs').append(
				'<li id="li_'+fileNameID+'">'+
					'<a href="#div_'+fileNameID+'" title="'+fileName1+'">'+fileNameShort+'</a> '+
					App.UI.TabCloseButtonTemplate+
				'</li>'
			);
			$('#editor').append(tab);
			if (!App.Files.Open) App.Files.Open = {};
			App.Files.Open['div_'+fileNameID] = fileName;
			App.UI.ContentTabs = $("#editor").tabs({ 
			    activate: function(event, ui) { 
			        App.Files.CurrentFile = ui.newTab[0].firstChild.title;
			        App.UI.setStatus('Switched to ' + App.Files.CurrentFile);
			    } 
			});
			App.UI.ContentTabs.find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });;
			App.UI.ContentTabs.tabs( "refresh" );
			
		    // Close icon: removing the tab on click
			$('#li_'+fileNameID+' .close').click(function() { App.Files.close(fileName); });

			// make this tab active tab
			App.UI.ContentTabs.tabs("option", "active", $('#editor a[href="#div_'+fileNameID+'"]').parent().index());
			App.Files.CurrentFile = fileName1;
		},
		addFolderTab: function(tab, path) {
		    var path1 = App.Util.filePathDecode(path);
		    var pathID = App.Util.filePathToID(path);
    		$('#explorerTabs').append(
    			'<li id="li_'+pathID+'">'+
    				'<a href="#exp_'+pathID+'" title="'+path1+'">'+path1+'</a> '+
    				App.UI.TabCloseButtonTemplate+
    			'</li>'
    		);
    		$('#explorers').append(tab);
    		if (App.Files.Folders)
                App.Files.ExplorersData[pathID] = App.Util.expandNodes(App.Files.ExplorersData[pathID], pathID);
    		$('#exp_'+pathID).treeview({data:App.Files.ExplorersData[pathID],levels:1,enableLinks:true});
    		$('#exp_'+pathID).click(function() { App.Util.autoUpdateExplorerHoverTitles(path); });
    		App.Util.autoUpdateExplorerHoverTitles(path);
    		App.UI.MountPoints = $("#explorers").tabs({
    		    activate: function(event, ui) {
					App.Files.CurrentFolder = ui.newTab[0].firstChild.title;
					App.UI.setStatus('Current folder changed to '+App.Files.CurrentFolder);
				}
			});
    		App.UI.MountPoints.find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });;
    		App.UI.MountPoints.tabs( "refresh" );
    		
    	    // Close icon: removing the tab on click
    		$('#li_'+pathID+' .close').click(function() { App.Files.closeExplorer(path); });
    
    		// make this tab active tab
    		App.UI.MountPoints.tabs("option", "active", $('#explorerTabs a[href="#exp_'+pathID+'"]').parent().index());
            App.Files.CurrentFolder = path;
		},
		addToRecent: function(id, name, targetArray) {
		    // push (add to end) pop (remove from end), shift (remove from start) unshift (add to start)
		    //targetArray.addUnique(name);
		    //App.Util.addToHistory(id, name, targetArray);
		    //while (targetArray.length > 10) array.shift();
	    },
	    addToHistory: function(id, name, targetArray) {
	        //if (targetArray == null) targetArray = [name];
		    //if (!targetArray.contains(id)) targetArray.unshift(name);
	    },
        requestFullScreen: function(element) {
            element = element || document.body;
            // Supports most browsers and their versions.
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        
            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        },
        // app states
		appStateSave: function(key, data) {
			try {
			    if (localStorage[key] === JSON.stringify(data)){
			        //console.log(key + ' has not changed.');
			        return;
			    }
				localStorage[key] = JSON.stringify(data);
		        console.log('Saved ' + key + ' to local storage.');
			} catch (e) {
				console.log(key + ' could not be saved to local storage.');
			}
	        
		},
		appStateRestore: function(key) {
		    if (localStorage[key] === undefined) {
		    	console.log('Setting ' + key + ' is not saved in local storage.');
		    	return null;
		    }
		    try {
			    var data = localStorage[key];
		        console.log('Loaded ' + key + ' from local storage.');
			    return JSON.parse(data);
		    }
		    catch (e) {
				console.log(key + ' could not be loaded from local storage.');
			}
		},
		appStateClear: function(key) {
		    delete localStorage[key];
		},
		arrayContains: function(array, obj) {
		    alert('to dela? (arrayContains)');
            var i = array.length;
            while (i--) {
                if (array[i] === obj) {
                    return true;
                }
            }
            return false;
		},
		arrayAddUnique: function(array, obj) {
		    alert('to dela? (arrayAddUnique)');
            if (array.contains(obj)) {
                //delete this[obj];
                return;
            }
            array.unshift(obj);
            while (array.length > 10) array.pop();
		},
		// sample layout save templates
		saveLayout: function() {
			// save ALL states of ALL panes to test loadState (reset button)
			window.fullState = myLayout.readState(
				"north.size,south.size,east.size,west.size,"+
				"north.isClosed,south.isClosed,east.isClosed,west.isClosed,"+
				"north.isHidden,south.isHidden,east.isHidden,west.isHidden"
			);
		},
		customSaveState: function (Instance, state, options, name) {
			// get the state and save it in a database...
			var state_JSON = Instance.readState();
			// use Layout utilities to stringify the JSON - IF NECESSARY
			var state_String = Instance.encodeJSON( state_JSON );
			// now can save the data in the database string field
		},
		customLoadState: function (Instance, state, options, name) {
			/* if state loaded as a 'string', convert back to a hash
			var savedState_String = "{ west: { size: 200 } }";
			var savedState_JSON = Instance.decodeJSON( state_JSON );
			Instance.loadState( savedState_JSON, true ); // true = animate open/close/resize
			*/

			// create a custom 'load state' - this could come from the server
			var savedState_JSON = {
				east: {
					initClosed:	false
				,	size:		350
				}
			,	south: {
					initClosed:	false
				}
			}

			// load the custom state
			Instance.loadState( savedState_JSON, false ); // false = DO NOT animate open/close/resize (default)
		},
		dummyLayoutBoilerplate: function () {
			// sync checkbox with layout state options
			var state = App.Layout.options.stateManagement;
			$('#autoSaveState').attr("checked", state.enabled && state.autoSave);
		}
	    // !sample layout
	}
}

$(document).ready(function() {
	App.Init();
});



