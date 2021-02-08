# BCE: Browser Code Editor

# About
As the name implies, this software allows you to browse and edit plain text files on your server from the comfort of your browser.

It uses ACE editor for editing content of files, combined with custom PHP API for serving and managing files, all integrated into a simple JavaScript/Bootstrap UI for browsing files, launching file editors and to provide some basic functionality shortcuts to the contained components.

It should be usefull to edit all kinds of source code files with syntax highlighting and auto-completion across different languages without the need to use FTP or FTP-based native running editors or such.

It was developed while being used to work on code for HTML, CSS, JavaScript, PHP, C# and SQL.

# How to use
Just copy the whole contents of this directory to a folder accessible through HTTP via PHP-enabled web server and access it through the browser. 

**It is recommended that you somehow protect this folder from public access by any method available.** _I use .htaccess with .htpasswd on Apache._

![Screenshot: main screen with two file browser tabs and three file tabs open, one changed but not saved](/.github/screenshot.jpg)

You will se a **file browser tab** on the left with the content of the editor's parent folder on the web server. If you hover over icons above and read what each one does, you will find the one whith which you can **add more file-browser-tabs** (for different projects maybe), or the one with which you can **create new files and folders** on the server. Plus sign will expand a subfolder while clicking on a file will attempt to **open it in a code editor tab** within the current window. 

Feel free to explore other buttons as well. You can **open current file in a new tab**, or **fold the code** to make it more easily readable. There are also some keyboard shortcuts hidden throughout the app. The most usefull of them all is probably **Ctrl+S** which will **Save** the current file, and standard **copypasting shortcuts** should also work. You can **find more by hovering** over buttons - if there is a shortcut for it, it will most likely be shown there.

**Syntax highlighting** is automatic based on file extension, but can also be changed manually. When a file is **changed**, the **tab** text is **colored red** until the file is saved. A backup of file is created in the editor's **backup folder** on each save, for just in case. I've thought about eventually using it as a simple versioning tool, but we will see what the future brings. It's just a safety measure at the moment and files can be safely deleted if no longer required.

# Additional features
Also at the moment, code editor used is **ACE editor**. Internally I have begun experimenting with providing different editors (namely _CodeMirror_, _Monaco_, but others not excluded), if only to provide some choice at runtime for the end-user. As of now, I haven't done anything other than research on the matter though. Again, we will see what the future brings.

_The functionalities od this software has been developed as needed while running on an Apache/PHP server, also utilizing JavaScript/CSS/HTML for working on web projects mostly. You may encounter issues unknown to the author for the simple reason of never having a chance to encounter them. Bug fixes are welcome._

_Likewse you may also encounter use cases that I never required (I think file upload is one of them). If you do reqire them, I have made this project open-source just for the reason so that by having access to the code, you can add features I've never needed. I'm working on this project alone, to suit my needs, so if you also like me find it usefull enough to also wish to contribute every now and then, contributions are also welcome._

_I have not considered implementing any additional features just because someone so requested, or even paid, but this is not a definitive no and suggestions and7or offers are also welcome._

# Other notes
- I've never used this editor on anything other than Unicode (UTF) encoded files. If you create a new file from the editor, the appropriate encoding will be used. If you encounter any problems with other files, change encoding to UTF.
- I like dark mode. I like it so much that at some point I've made the whole editor dark, which interfeers with light editor themes. This is a known bug, but I don't use light mode enough to care. Maybe later, or maybe someone else will make it work.
-

# Included libraries
No, I could not have done all this all by myself. I stand on the shoulders of the following giants (find them in code for more info, like versions and such):
- jQuery
- jQuery UI
- Require.JS
- Bootstrap
- FontAwesome
- ACE editor

# Project structure
- index.php (main API/PHP code file for serving and saving content)
- app/app.php (HTML and UI)
- app/app.js (JavaScript)
- app/app.css (CSS)
- backups (folder for saving backup files)
- lib (the shoulders of the giants, third party code)
- lib/ace (ACE editor)
- lib/fonts (FontAwesome, bootstrap)
- lib/js (RequireJS, jQuery, jQueryUI, Bootstrap)
- lib/css (jQueryUI, Bootstrap, FontAwesome)

# Disclaimer
If there is anything or anyone I forgot to do or mention, let me know.