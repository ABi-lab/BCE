<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Remote Code Editor</title>

		<meta name="description" content="<?= $v["title"] ? $v["title"] : "RCE"?>" />
		<meta name="keywords" content="<?= $v["title"] ? $v["title"] : "RCE"?>" />
		<!-- wut wut wut -- >
		<meta charset="utf-8"> <- default=utf-8 /->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<!-- wut wut wut -->

		<!-- jQuery UI -->
		<link href="lib/css/jquery-ui.min.css" rel="stylesheet">
		<link href="lib/css/jquery-ui.theme.css" rel="stylesheet">
		<!-- jQuery layout for split panes -->
		<link href="lib/css/jquery.layout.css" rel="stylesheet">
		<!-- Bootstrap -->
		<link href="lib/css/bootstrap.min.css" rel="stylesheet">
		<link href="lib/css/bootstrap.dark.min.css" rel="stylesheet">
		<!-- FontAwesome -->
		<link href="lib/css/font-awesome.min.css" rel="stylesheet">
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
		<link href="lib/css/app.bootstrap.css" rel="stylesheet" type="text/css">

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -- >
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<!--  -->
		<script src="lib/js/jquery.min.js"></script>
		<script src="lib/js/jquery-ui.min.js"></script>
		<!-- jQuery layout for split panes -->
		<script src="lib/js/jquery.layout.js"></script>
		<script src="lib/js/require.js?v=<?= strtotime("now") ?>" type="text/javascript"></script>

		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script src="lib/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="lib/js/app.bootstrap.js" type="text/javascript"></script>

		<!-- load emmet code and snippets compiled for browser -->
        <script src="https://cloud9ide.github.io/emmet-core/emmet.js"></script>

		<link href="app/app.css" rel="stylesheet">
		<script type="text/javascript">
			var params = {
				defaultExplorerPath: '<?= $v['defaultExplorerPath'] ?>'
			};
			// https://github.com/jonmiles/bootstrap-treeview
			var explorerJson = <?= $v["explorerJson"] ?>;
		</script>
	</head>
	<body>
		<div id="toolbar">
			<div class="btn-toolbar" role="toolbar" aria-label="Toolbar">
			    <!-- -->
				<div class="btn-group" role="group" aria-label="File menu">
					<div class="dropdown">
						<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">File <span class="caret"></span></button>
						<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
							<li><a href="#" class="cmdBtnFileSave">Save</a></li>
							<li><a href="#" class="cmdBtnFileSaveAs">Save as...</a></li>
							<li><a href="#" class="cmdBtnFileRevert">Revert</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#" class="cmdBtnFileClose">Close</a></li>
							<li><a href="#" class="cmdBtnFileCloseAll">Close All</a></li>
							<li role="separator" class="divider"></li>
							<li class="disabled"><a href="#">Properties</a></li>
						</ul>
					</div>
				</div>
				<div class="btn-group" role="group" aria-label="Edit menu">
					<div class="dropdown">
						<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit <span class="caret"></span></button>
						<ul class="dropdown-menu" aria-labelledby="dropdownMenu2" style="min-width: 180px;">
							<li><a href="#" class="cmdBtnEditUndo">Undo<i class="fa fa-arrow-circle-left" aria-hidden="true"></i></a></li>
							<li><a href="#" class="cmdBtnEditRedo">Redo<i class="fa fa-arrow-circle-right" aria-hidden="true"></i></a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#" class="cmdBtnEditCut">Cut<i class="fa fa-scissors" aria-hidden="true"></i></a></li>
							<li><a href="#" class="cmdBtnEditCopy">Copy<i class="fa fa-copy" aria-hidden="true"></i></a></li>
							<li><a href="#" class="cmdBtnEditPaste">Paste<i class="fa fa-paste" aria-hidden="true"></i></a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#" class="cmdBtnEditFind">Find<i class="fa fa-search" aria-hidden="true"></i></a></li>
							<li><a href="#" class="cmdBtnEditReplace">Find and Replace<i class="fa fa-random" aria-hidden="true"></i></a></li>
							<li role="separator" class="divider"></li>
							<li class="disabled"><a href="#" class="cmdBtnEditDelete">Delete</a></li>
						</ul>
					</div>
				</div>
				<div class="btn-group hidden" role="group" aria-label="Bootstrap samples menu">
					<div class="dropdown">
						<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Bootstrap <span class="caret"></span></button>
						<ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
							<li class="dropdown-header">Dropdaun heder</li>
							<li><a href="#">Andu</a></li>
							<li><a href="#">Ridu</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#">Kat</a></li>
							<li><a href="#">Kopi</a></li>
							<li class="disabled"><a href="#">Disabled link</a></li>
							<li><a href="#">Pejst</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#">Fajnd</a></li>
							<li class="dropdown-header">�ekbokses</li>
							<li>
							    <div class="input-group">
									<span id="sampleCheckbox1" class="input-group-addon">
										<input type="checkbox" aria-label="...">
									</span>
									<label for="sampleCheckbox1">�ekboks</label>
							    </div>
							</li>
							<li>
								<input type="checkbox" aria-label="..." />
								<label for="sampleCheckbox1">�ekboks</label>
							</li>
							<li style="padding-left: 3px;">
								<input type="checkbox" aria-label="..." />
								<label for="sampleCheckbox1">�ekboks</label>
							</li>
							<li>
								<input type="checkbox" aria-label="..." style="margin-left: 3px;" />
								<label for="sampleCheckbox1">�ekboks</label>
							</li>
							<li><a href="#">Mor sempl tekst</a></li>
							<li><a href="#">Ivn mor sempl tekst</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#">Detelete</a></li>
							<li>
								<div class="btn-group">
								  <button type="button" class="btn btn-danger">Action</button>
								  <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								    <span class="caret"></span>
								    <span class="sr-only">Toggle Dropdown</span>
								  </button>
								  <ul class="dropdown-menu">
								    <li><a href="#">Action</a></li>
								    <li><a href="#">Another action</a></li>
								    <li><a href="#">Something else here</a></li>
								    <li role="separator" class="divider"></li>
								    <li><a href="#">Separated link</a></li>
								  </ul>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<!-- -->
				<div class="btn-group" role="group" aria-label="File">
					<button type="button" class="btn btn-default cmdBtnFileClose" title="Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
					<button type="button" class="btn btn-default cmdBtnFileDownload" title="Download (Ctrl+D)"><i class="fa fa-cloud-download" aria-hidden="true"></i><!-- span class="glyphicon glyphicon-floppy-disk" aria-hidden="true" --></span></button>
					<button type="button" class="btn btn-default cmdBtnFileSave" title="Save (Ctrl+S)"><i class="fa fa-floppy-o" aria-hidden="true"></i><!-- span class="glyphicon glyphicon-floppy-disk" aria-hidden="true" --></span></button>
					<button type="button" class="btn btn-default cmdBtnFileSaveAs" title="Save copy as..."><i class="fa fa-copy" aria-hidden="true"></i></span></button>
					<button type="button" class="btn btn-default cmdBtnFileDelete" title="Delete"><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></button>
				</div>
				<div class="btn-group" role="group" aria-label="Edit" style="xdisplay:none;">
					<button type="button" class="btn btn-default cmdBtnEditCut" title="Cut"><i class="fa fa-scissors" aria-hidden="true"></i><!-- span class="glyphicon glyphicon-scissors" aria-hidden="true"></span --></button>
					<button type="button" class="btn btn-default cmdBtnEditCopy" title="Copy"><i class="fa fa-copy" aria-hidden="true"></i><!-- span class="glyphicon glyphicon glyphicon-copy" aria-hidden="true"></span --></button>
					<button type="button" class="btn btn-default cmdBtnEditPaste" title="Paste"><i class="fa fa-clipboard" aria-hidden="true"></i><!-- span class="glyphicon glyphicon glyphicon-paste" aria-hidden="true"></span --></button>
					<button type="button" class="btn btn-default cmdBtnEditDelete" title="Delete"><i class="fa fa-eraser" aria-hidden="true"></i><!-- span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span --></button>
				</div>
				<div class="btn-group" role="group" aria-label="Edit" style="xdisplay:none;">
					<button type="button" class="btn btn-default cmdBtnEditUndo" title="Undo"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i><!-- span class="glyphicon glyphicon-scissors" aria-hidden="true"></span --></button>
					<button type="button" class="btn btn-default cmdBtnEditRedo" title="Redo"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i><!-- span class="glyphicon glyphicon glyphicon-copy" aria-hidden="true"></span --></button>
				</div>
				<div class="btn-group" role="group" aria-label="IDE">
					<button type="button" class="btn btn-default cmdBtnIDEFullscreen" title="Fullscreen. If this doesn't work, try F11 manually."><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span></button>
					<button type="button" class="btn btn-default cmdBtnIDEOptions" title="Set default IDE preferences"><i class="fa fa-cog" aria-hidden="true"></i></button>
					<button type="button" class="btn btn-default cmdBtnStateSave" title="Save IDE state to local storage"><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button>
					<button type="button" class="btn btn-default cmdBtnStateRestore" title="Restore IDE state from local storage"><span class="glyphicon glyphicon-open" aria-hidden="true"></span></button>
					<button type="button" class="btn btn-default cmdBtnStateClear" title="Clear IDE state from local storage"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></button>
					<button type="button" class="btn btn-default cmdBtnClearBackups" title="Delete backup files"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
				</div>
				<div class="btn-group" role="group" aria-label="View">
					<button type="button" class="btn btn-default cmdBtnBrowserPreview" title="Open url in new tab"><i class="fa fa-copy" aria-hidden="true"></i><!-- span class="glyphicon glyphicon glyphicon-copy" aria-hidden="true"></span --></button>
					<button type="button" class="btn btn-default cmdBtnToggleFold" title="(Un)fold code"><span class="glyphicon glyphicon-sort" aria-hidden="true"></span><!-- i class="fa fa-dot-circle-o" aria-hidden="true"></i --></button>
                    <select class="cmdBtnSetMode" size="1">
                        <option>Set language</option><option value="abap">ABAP</option><option value="abc">ABC</option><option value="actionscript">ActionScript</option><option value="ada">ADA</option><option value="apache_conf">Apache Conf</option><option value="asciidoc">AsciiDoc</option><option value="assembly_x86">Assembly x86</option><option value="autohotkey">AutoHotKey</option><option value="batchfile">BatchFile</option><option value="bro">Bro</option><option value="c_cpp">C and C++</option><option value="c9search">C9Search</option><option value="cirru">Cirru</option><option value="clojure">Clojure</option><option value="cobol">Cobol</option><option value="coffee">CoffeeScript</option><option value="coldfusion">ColdFusion</option><option value="csharp">C#</option><option value="css">CSS</option><option value="curly">Curly</option><option value="d">D</option><option value="dart">Dart</option><option value="diff">Diff</option><option value="dockerfile">Dockerfile</option><option value="dot">Dot</option><option value="drools">Drools</option><option value="dummy">Dummy</option><option value="dummysyntax">DummySyntax</option><option value="eiffel">Eiffel</option><option value="ejs">EJS</option><option value="elixir">Elixir</option><option value="elm">Elm</option><option value="erlang">Erlang</option><option value="forth">Forth</option><option value="fortran">Fortran</option><option value="ftl">FreeMarker</option><option value="gcode">Gcode</option><option value="gherkin">Gherkin</option><option value="gitignore">Gitignore</option><option value="glsl">Glsl</option><option value="gobstones">Gobstones</option><option value="golang">Go</option><option value="groovy">Groovy</option><option value="haml">HAML</option><option value="handlebars">Handlebars</option><option value="haskell">Haskell</option><option value="haskell_cabal">Haskell Cabal</option><option value="haxe">haXe</option><option value="hjson">Hjson</option><option value="html">HTML</option><option value="html_elixir">HTML (Elixir)</option><option value="html_ruby">HTML (Ruby)</option><option value="ini">INI</option><option value="io">Io</option><option value="jack">Jack</option><option value="jade">Jade</option><option value="java">Java</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsoniq">JSONiq</option><option value="jsp">JSP</option><option value="jsx">JSX</option><option value="julia">Julia</option><option value="kotlin">Kotlin</option><option value="latex">LaTeX</option><option value="less">LESS</option><option value="liquid">Liquid</option><option value="lisp">Lisp</option><option value="livescript">LiveScript</option><option value="logiql">LogiQL</option><option value="lsl">LSL</option><option value="lua">Lua</option><option value="luapage">LuaPage</option><option value="lucene">Lucene</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="mask">Mask</option><option value="matlab">MATLAB</option><option value="maze">Maze</option><option value="mel">MEL</option><option value="mushcode">MUSHCode</option><option value="mysql">MySQL</option><option value="nix">Nix</option><option value="nsis">NSIS</option><option value="objectivec">Objective-C</option><option value="ocaml">OCaml</option><option value="pascal">Pascal</option><option value="perl">Perl</option><option value="pgsql">pgSQL</option><option value="php">PHP</option><option value="powershell">Powershell</option><option value="praat">Praat</option><option value="prolog">Prolog</option><option value="properties">Properties</option><option value="protobuf">Protobuf</option><option value="python">Python</option><option value="r">R</option><option value="razor">Razor</option><option value="rdoc">RDoc</option><option value="rhtml">RHTML</option><option value="rst">RST</option><option value="ruby">Ruby</option><option value="rust">Rust</option><option value="sass">SASS</option><option value="scad">SCAD</option><option value="scala">Scala</option><option value="scheme">Scheme</option><option value="scss">SCSS</option><option value="sh">SH</option><option value="sjs">SJS</option><option value="smarty">Smarty</option><option value="snippets">snippets</option><option value="soy_template">Soy Template</option><option value="space">Space</option><option value="sql">SQL</option><option value="sqlserver">SQLServer</option><option value="stylus">Stylus</option><option value="svg">SVG</option><option value="swift">Swift</option><option value="tcl">Tcl</option><option value="tex">Tex</option><option value="text">Text</option><option value="textile">Textile</option><option value="toml">Toml</option><option value="tsx">TSX</option><option value="twig">Twig</option><option value="typescript">Typescript</option><option value="vala">Vala</option><option value="vbscript">VBScript</option><option value="velocity">Velocity</option><option value="verilog">Verilog</option><option value="vhdl">VHDL</option><option value="wollok">Wollok</option><option value="xml">XML</option><option value="xquery">XQuery</option><option value="yaml">YAML</option><option value="django">Django</option>
                    </select>
                    <select id="split" class="cmdBtnSetSplit" size="1">
                        <option value="none">Split</option>
                        <option value="none">None</option>
                        <option value="below">Below</option>
                        <option value="beside">Beside</option>
                    </select>
                    <select name="setting_fontfamily" id="setting_fontfamily" class="cmdBtnSetFontFamily"></select>
                    <select id="setting_fontsize" class="cmdBtnSetFontSize" size="1"></select>
                    <select id="setting_fontsizeunit" class="cmdBtnSetFontSizeUnits" size="1"></select>
                    <select class="cmdBtnSetTheme" size="1">
                        <option>Set current theme</option>
                        <optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/gruvbox">Gruvbox</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>
                        <optgroup label="Bright"><option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>
                    </select>
                    <select id="setting_editor" class="cmdBtnSetEditor" size="1">
                        <option value="ace">Set editor</option>
                        <option value=""></option>
                        <option value="ace">Ace</option>
                        <option value="monaco">Monaco</option>
                        <option value=""></option>
                        <option value="ace-1.2.6">ace-1.2.6</option>
                        <option value="ace-1.4.12">ace-1.4.12</option>
                        <option value="codemirror-5.58.3">codemirror-5.58.3</option>
                        <option value="monaco-0.21.2">Monaco</option>
                    </select>
                </div>
			</div>
		</div>
		<div id="editorPanel">
			<div id="explorer" class="ui-layout-pane ui-layout-west">
				<div class="btn-toolbar" role="toolbar" aria-label="Toolbar">
					<div class="btn-group" role="group" aria-label="File"><!-- fa-folder-o -->
						<button type="button" class="btn btn-default cmdBtnBrowseReload" title="Reload current view (Ctrl+R)"><i class="fa fa-refresh" aria-hidden="true"></i></button>
						<button type="button" class="btn btn-default cmdBtnBrowseSelectFolder" title="Add new explorer view (Ctrl+E)"><i class="fa fa-files-o" aria-hidden="true"></i></button>
						<button type="button" class="btn btn-default cmdBtnBrowseNew" title="Upload or create file or folder"><i class="fa fa-cloud-upload" aria-hidden="true"></i></button>
						<button type="button" class="btn btn-default cmdBtnBrowsersReload" title="Reload all views (Ctrl+R)"><i class="fa fa-refresh" aria-hidden="true"></i></button>
					</div>
                    <input class="search" type="text" class="form-control" placeholder="Search">
                </div>
                <div id="explorers">
                    <ul id="explorerTabs" class="tabs"></ul>
                </div>
			</div>
			<div id="editor" class="ui-layout-pane ui-layout-center">
				<ul id="fileTabs" class="tabs"></ul>
			</div>
			<div id="statusBar" class="toolbar ui-layout-pane ui-layout-south">Remote Code Editor</div>
		</div>
        <div id="dialogs">
            <div id="dlgBrowseFolder">
                <p>Click file to select or folder to navigate.</p>
                <div class="folderContent"></div>
            </div>
            <div id="dlgBrowseNew">
                <p>Click folder to navigate.</p>
                <p><strong>Create new</strong> file or folder:
                    <input id="dlgBrowseNewName" type="text" placeholder="new file or folder name" /><br />
                    <button type="button" class="cmdBtnBrowseFileCreateFile" title="Create FILE">Create FILE</button> or
                    <button type="button" class="cmdBtnBrowseFileCreateFolder" title="Create FOLDER">Create FOLDER</button>.
                </p>
                <p><strong>Upload existing</strong> file or folder (as zip file):<br />
                    <input type="file">
                    <button type="button" class="cmdBtnBrowseFileUpload" title="Upload FILE">Upload FILE</button>
                    <input type="checkbox" id="cbUnzip"><label for="cbUnzip">and unzip on *.zip</label>
                </p>
                <div class="folderContent"></div>
            </div>
            <div id="dlgBrowseFileFolder">
                <p>Click file to select or folder to navigate.</p>
                <div class="folderContent"></div>
            </div>
            <div id="dlgIDEOptions">
                <ul id="optionsTabs">
                    <li><a href="#optionsPaneEditor">Editor</a></li>
                    <li><a href="#optionsPaneIDE">IDE</a></li>
                    <li><a href="#optionsPaneHelp">Help and notes</a></li>
                </ul>
                <div id="optionsPaneEditor">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="setting_autofold">Auto fold code on file open</label><br />
                            <select name="setting_autofold" id="setting_autofold" size="1">
                                <option value="manual">manual</option>
                                <option value="markbegin" selected="selected">mark begin</option>
                                <option value="markbeginend">mark begin and end</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="setting_wordwrap">Word wrap</label>&nbsp;<input type="checkbox" name="setting_wordwrap" id="setting_wordwrap" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="setting_autocomplete">Enable autocomplete</label>&nbsp;<input type="checkbox" name="setting_autocomplete" id="setting_autocomplete" />
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="setting_fontfamily1">Font family</label><br />
                            <select name="setting_fontfamily1" id="setting_fontfamily1" class="cmdBtnSetFontFamily">
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="setting_fontsize1">Font size</label><br />
                            <select id="setting_fontsize1" class="cmdBtnSetFontSize" size="1">
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="setting_fontsizeunit1">Font size</label><br />
                            <select id="setting_fontsizeunit1" class="cmdBtnSetFontSizeUnits" size="1">
                            </select>
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="setting_defaulttheme1">Default theme</label>
                            <select id="setting_defaulttheme1" name="setting_defaulttheme1" class="cmdBtnSetTheme" size="1">
                                <option value="ace/theme/twilight">Select theme</option>
                                <optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/gruvbox">Gruvbox</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>
                                <optgroup label="Bright"><option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="setting_rootfolder">Root folder (explorer)</label>
                            <input type="text" name="setting_rootfolder" id="setting_rootfolder" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                    <!--
                    <div class="row">
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3"><label for="setting_"></label></div>
                        <div class="col-md-3"><input id="setting_" type="checkbox" /></div>
                        <div class="col-md-3"><label for="setting_"></label></div>
                        <div class="col-md-3"><input id="setting_" type="checkbox" /></div>
                    </div>
                    -->
                </div>
                <div id="optionsPaneIDE">
                    <div class="row">
                        <div class="col-md-6">
    						<button type="button" class="btn btn-default cmdBtnStateSave" title="Save IDE state to local storage"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Save IDE state to local storage</button>
                        </div>
                        <div class="col-md-6">
    						<button type="button" class="btn btn-default cmdBtnStateRestore" title="Restore IDE state from local storage"><span class="glyphicon glyphicon-open" aria-hidden="true"></span> Restore IDE state from local storage</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
    						<button type="button" class="btn btn-default cmdBtnStateClear" title="Clear IDE state from local storage"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> Clear IDE state from local storage</button>
                        </div>
                        <div class="col-md-6">
    						<button type="button" class="btn btn-default cmdBtnClearBackups" title="Delete backup files"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete backup files</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                </div>
                <div id="optionsPaneHelp">
                    <p>TODO:</p>
                    <ul>
                        <li>read more about App.Files.Editors[App.Util.fileNameToID(App.Files.CurrentFile)].commands.byName</li>
                        <li>beautify command, extend php to js/css/c#/.../?</li>
                        <li>enable and configuration of code snippets</li>
                        <li>split view</li>
                        <li>find and replace (also in files and folders)</li>
                        <li>fix: on file open resize editor to fit window (resizing window seems to help)</li>
                        <li>Ctrl(+Shift)+Tab cycles open files</li>
                        <li>list of recently opened files (up to gazillion) with click to open option</li>
                        <li>and do the folders as well since you're just at it and simply because you can ;)</li>
                        <li>each file in explorer is dropdown button; click opens it by default, like now, but there are options:
                            <ui>
                                <li><em>These could also go to file toolbar</em></li>
                                <li>Download</li>
                                <li>Open in browser in new tab via proxy</li>
                                <li>Open in browser (new tab, without editor)</li>
                                <li><em>End These</em></li>
                                <li>Copy to clipboard (copies file path which is just a variable) - on file delete should check this</li>
                                <li>copy this file/folder to another location</li>
                                <li>folders should have "open new explorer tab from here"</li>
                                <li>folders should also have create folder</li>
                                <li>upload into folders</li>
                                <li>copy files in explorer by drag and drop, move with shift or ctrl</li>
                                <li>upload file into folder on drag and drop from outside browser</li>
                            </ui>
                        </li>
                        <li>download folder and subfolders as zip</li>
                        <li>rename file/folder</li>
                        <li>close all files</li>
                        <li>close others, to the left/right</li>
                        <li>upload zip/tar/etc to folder and extract</li>
                        <li>new file templates (html, xml, rss, css, bootstrap/jquery, ...)</li>
                        <li>file and folder icons to explorer</li>
                        <li>reload file</li>
                        <li>on file tab activate (reload and) check if remote file was meanwhile changed</li>
                        <li>reload all files every 5 minues or so (setting?) to check for remote changes by other users</li>
                        <li>find more monospaced fonts</li>
                    </ul>
                    <p>Usefull links:</p>
                    <ul>
                        <li>Check out about <a href="https://docs.emmet.io/abbreviations/syntax/" target="_blank">emmet</a> and how 
                        <pre>#page>div.logo+ul#navigation>li*5>a{Item $}</pre> can be converted to <pre>
&lt;div id="page"&gt;
    &lt;div class="logo"&gt;&lt;/div&gt;
    &lt;ul id="navigation"&gt;
        &lt;li&gt;&lt;a href=""&gt;Item 1&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href=""&gt;Item 2&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href=""&gt;Item 3&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href=""&gt;Item 4&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href=""&gt;Item 5&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
&lt;/div&gt;</pre>
                        </li>
                    </ul>
                    <p>Some dev stuff:</p>
                    <ul>
                        <li><a href="http://layout.jquery-dev.com/demos.cfm">http://layout.jquery-dev.com/demos.cfm</a></li>
                        <li><a href="https://github.com/jonmiles/bootstrap-treeview">https://github.com/jonmiles/bootstrap-treeview</a></li>
                        <li><a href="http://abilab.net/lib/3rd/ace/demo/kitchen-sink/demo.js">http://abilab.net/lib/3rd/ace/demo/kitchen-sink/demo.js</a></li>
                        <li><a href="https://davidwalsh.name/password-protect-directory-using-htaccess">https://davidwalsh.name/password-protect-directory-using-htaccess</a></li>
                        <li><a href="https://davidwalsh.name/htaccess-username-password-generator">https://davidwalsh.name/htaccess-username-password-generator</a></li>
                    </ul>
                </div>
            </div>
        </div>
		<!-- script type="text/javascript" src="js/app.js?v=<?= strtotime("now") ?>"></script -->
		<script type="text/javascript" src="app/app.js"></script>
	</body>
</html>