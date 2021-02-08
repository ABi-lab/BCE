<?php
	namespace ABilab\App;

	ini_set('memory_limit', '2G');

	class Vars {
	    const app_title = 'Remote Code Editor';
	    
		const p_query = 'q';

		const p_fileList = "fl";
		const p_fileOpen = 'fo';
		const p_fileSave = 'fs';
		const p_fileCopy = 'fcp';
		const p_fileCopyTo = 'fcpt';

		const p_fileCreate = 'fc';
		const p_fileUpload = 'fu';
		const p_fileDownload = 'fdl';
		const p_fileDelete = 'fd';
		const p_fileBrowse = 'fb';
		
		const p_folderBrowse = 'fob';
		const p_folderCreate = 'foc';

		const p_backupClear = 'bc';

		const p_browse_log = 'l';
		const p_delete = 'd';
		const p_ajax = 'a';
	}
	
	class Tools {
        public static function dir($dir) {
    		$handle = opendir($dir);
    		if ( !$handle ) return array();
    		$contents = array();
    		$folders = array(".." => [".."]);
    		$files = array();
    		while ( $entry = readdir($handle) )
    		{
    		    $entryo = $entry;
    			$entry = $dir.DIRECTORY_SEPARATOR.$entry;
    			$fileName = substr($entry, strrpos($entry, '/') + 1);
    
                if ( $entryo=='.' || $entryo=='..' ) continue;
    			
    			if ( is_file($entry) )
    				$files[$fileName] = $entry;
    			else if ( is_dir($entry) )
    				$folders[$fileName] = self::dir($entry);
    				#$folders[$fileName] = [$entry];
    		}
    		closedir($handle);
    		ksort($files);
    		ksort($folders);
    		$contents = array_merge_recursive($folders, $files);
    		return $contents;
        }
    	public static function dirTree($dir) {
    		$handle = opendir($dir);
    		if ( !$handle ) return array();
    		$contents = array();
    		$folders = array();
    		$files = array();
    		while ( $entry = readdir($handle) )
    		{
    			$entryo = $entry;
    			$entry = $dir.DIRECTORY_SEPARATOR.$entry;
    			$fileName = substr($entry, strrpos($entry, '/') + 1);
    
    			if ( $entryo=='.' ) {
    				$files[$fileName] = $entry;
    			}
    
    			if ( $entryo=='.' || $entryo=='..' ) continue;
    
    			if ( is_file($entry) )
    			{
    				$files[$fileName] = $entry;
    			}
    			else if ( is_dir($entry) )
    			{
    				$folders[$fileName] = self::dirTree($entry);
    			}
    		}
    		closedir($handle);
    		ksort($files);
    		ksort($folders);
    		$contents = array_merge_recursive($folders, $files);
    		return $contents;
    	}
    
    	public static function Base_URL() {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    		return $protocol .
    				$_SERVER["SERVER_NAME"] .
    				($_SERVER["SERVER_PORT"] != "80" ? ":" . $_SERVER["SERVER_PORT"] : "") .
    				$_SERVER["PHP_SELF"];
    	}
    	
    	public static function FileNameToHtmlID($fileName) {
    		$a = "˙´"; // 89
    		return str_replace(".", "˙", str_replace("/", "´", $fileName));
    		# using '.' and '/' causes security problems on some servers
    		# below are other appropriate options of swapping '.' and '/' with.
    		$a = "¸~ˇ^˘°˛`˙´˝¨¸¨"; // [AltGr]+: ¸1234567890'+¨ (1. in  zadnja sta isti, leva brez, desna z shiftom)
    		$a = "^°ˇ˘`˙´˝¨¨"; // 35247890'¨
    		$a = "˛¸¸"; // 6+¸
    		$a = "¨¨¨¨¨¨¨¨"; // ¸'
    		$a = "ˇ˘ˇ˘ˇ˘ˇ˘"; // 24
    		$a = "`´`´`´`´"; // 79
    		$a = "˙¨˙¨˙¨˙¨"; // 8'
    		$a = "´˝´˝´˝´˝"; // 90
    		$a = "^°^°^°^°"; // 35
    		$a = ""; // 
    		$a = "˙¸˙¸˙¸˙¸"; // 8+
    		$a = ""; // 
    		$a = "¸¸¸¸¸¸¸¸"; // +¸
    		$a = "¸˛¸˛¸˛¸˛"; // ¸6
    		$a = "˙´˙´˙´˙´"; // 89
    		$a = "¨˝¨˝¨˝¨˝"; // '0
    		$a = "¨˝¨˝¨˝¨˝"; // ¸0
    		$a = ""; // 
    	}

		public static function PathEncode($fileName) {
			$a = "˙´"; // 89
			$fileName = str_replace(".", "˙", str_replace("/", "´", $fileName));
			return $fileName;
		}

		public static function PathDecode($fileName) {
			$a = "˙´"; // 89
			$fileName = str_replace("˙", ".", str_replace("´", "/", $fileName));
			return $fileName;
		}
	}

    class FileSystem extends Tools {}
    class Util extends Tools {}

	class App {
		private $ajaxResponse = null;
		private $dirTree = [];
		private $dirTreeJSON = "";
		private $rootPath = ".."; #".";
		private $backupPath = "backups/";

		//public function
		public function __construct(){
    		$this->Headers();
			$this->ParseParams();
			$this->Render();
		}
		public function __destruct(){
		}

    	private function Headers() {
    		session_set_cookie_params(604800,"/"); # 604800 week | 86400  day | 3600 hour
    		session_name(Vars::app_title);
    		session_start();
    
    		header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
    		header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    		header("Cache-Control: post-check=0, pre-check=0", false);
    		header("Pragma: no-cache");
    	}
		private function ParseParams() {
			if (isset($_GET)) {
				if (isset($_GET[Vars::p_fileList])) {
				    $arg = $_GET[Vars::p_fileList];
        		    $arg = Tools::PathDecode($arg);
					$dirTree = FileSystem::dirTree($arg ? $arg : $this->rootPath);
					$this->ajaxResponse = $this->fileList($dirTree, 0, true);
				}
				if (isset($_GET[Vars::p_fileOpen])) {
				    $arg = $_GET[Vars::p_fileOpen];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->fileOpen($arg);
				}
				if (isset($_GET[Vars::p_fileSave])) {
				    $arg = $_GET[Vars::p_fileSave];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->fileSave($arg);
				}
				if (isset($_GET[Vars::p_fileCopy])) {
				    $arg1 = $_GET[Vars::p_fileCopy];
        		    $arg1 = Tools::PathDecode($arg1);
				    $arg2 = $_GET[Vars::p_fileCopyTo];
        		    $arg2 = Tools::PathDecode($arg2);
					$this->ajaxResponse = $this->fileCopy($arg1, $arg2);
				}
				if (isset($_GET[Vars::p_fileCreate])) {
				    $arg = $_GET[Vars::p_fileCreate];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->fileCreate($arg);
				}
				if (isset($_GET[Vars::p_fileUpload])) {
				    $arg = $_GET[Vars::p_fileUpload];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->fileUpload($arg);
				}
				if (isset($_GET[Vars::p_fileDownload])) {
				    $arg = $_GET[Vars::p_fileDownload];
        		    $arg = Tools::PathDecode($arg);
					$this->fileDownload($arg);
					die();
				}
				if (isset($_GET[Vars::p_fileDelete])) {
				    $arg = $_GET[Vars::p_fileDelete];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->fileDelete($arg);
				}
				if (isset($_GET[Vars::p_fileBrowse])) {
				    $arg = $_GET[Vars::p_fileBrowse];
        		    $arg = Tools::PathDecode($arg);
					$dir = FileSystem::dir($arg);
					$this->ajaxResponse = $this->fileBrowse($dir);
				}
				if (isset($_GET[Vars::p_folderBrowse])) {
				    $arg = $_GET[Vars::p_folderBrowse];
        		    $arg = Tools::PathDecode($arg);
					$dir = FileSystem::dir($arg);
					$this->ajaxResponse = $this->folderBrowse($dir);
				}
				if (isset($_GET[Vars::p_folderCreate])) {
				    $arg = $_GET[Vars::p_folderCreate];
        		    $arg = Tools::PathDecode($arg);
					$this->ajaxResponse = $this->folderCreate($arg);
				}
				if (isset($_GET[Vars::p_backupClear])) {
					$this->ajaxResponse = $this->deleteBackups();
				}
			}
		}
		protected function Render() {
		    $this->view["defaultExplorerPath"] = $this->rootPath;
			$this->view["explorer"] = "";
			$this->view["explorerJson"] = $this->fileList(FileSystem::dirTree($this->rootPath));
			
			if ($this->ajaxResponse !== null) die ($this->ajaxResponse);

			$v = $this->view;
			require_once("app/app.php");
		}


		private $fileListDepth = 0;
		private function fileList($data, $depth = 0, $format = false) {
			if ($this->fileListDepth > 0 and $depth >= $this->fileListDepth) return;
			$jsonOut = "";
			$t = "";
			if ($format) {
				$t = "\r\n";
				for ($x = 0; $x < $depth; $x++)
					$t .= "\t";
			}
			$i = 0;
            $dirPath = false;
			foreach ($data as $k => $v) {
                if (is_array($v) and isset($v['.'])) {
                    $dirPath = substr($v['.'], 0, strlen($v['.']) - 1);
                }
                $href = $dirPath;#urlencode($dirPath);
    		    $href = Tools::PathEncode($href);
    		    $v = Tools::PathEncode($v);
                if ($k != '.')
				    $jsonOut .= $t.'{"text":"'.$k.'",'.(
						is_array($v)
						? '"nodes":'.$this->fileList($v, $depth + 1, $format).$t
						#? '"href":"'.$href.'",'.'"nodes":'.$this->fileList($v, $depth + 1, $format).$t
						//: '"href":"javascript:App.Commands.FileOpenClick(\''.$v.'\');"'
						: '"href":"'.$v.'"'
						#) . '}' . (++$i < count($data) - 1 ? "," : "");
						) . '}' . ",";
									}
			$jsonOut = substr($jsonOut, 0, strlen($jsonOut) - 1);
			return "[".$jsonOut."]";
		}
		private function fileOpen($fileName) {
		    #die($fileName);
		    //if ($fileName !== urlencode($fileName)) $fileName = urlencode($fileName);
			$fileContents = file_get_contents($fileName);

			# forceconvert to utf-8
			$output = $fileContents;
			if(!mb_check_encoding($output, 'UTF-8') OR !($output === mb_convert_encoding(mb_convert_encoding($output, 'UTF-32', 'UTF-8' ), 'UTF-8', 'UTF-32'))) {
				$output = mb_convert_encoding($output, 'UTF-8', 'pass'); 
				if (mb_check_encoding($output, 'UTF-8')) {
					// log('Converted to UTF-8');
				} else {
					// log('Could not converted to UTF-8');
				}
			}
			$fileContents = $output;

			$fileContents = htmlspecialchars($fileContents);
			$fileContents = base64_encode($fileContents);
			#var_dump($fileContents);die();
			return $fileContents;
		}
		private function fileSave($fileName) {
			$newFileName = $this->backupFileName($fileName);
			copy($fileName, $newFileName);
			$data = base64_decode(base64_decode($_POST["data"]));
			$sizeInBytes = file_put_contents($fileName, $data);
			$sizeInBytesString = number_format($sizeInBytes, 0, ".", " ");
			return $sizeInBytesString . " bytes";
		}
		private function fileCopy($fileName, $newFileName) {
			return copy($fileName, $newFileName);
		}
        private function fileCreate($fileName) {
            return touch($fileName);
        }
        private function fileUpload($fileName) {}
        private function fileDownload($fileName) {
            $file_url = $fileName;#'http://www.myremoteserver.com/file.exe';
            header('Content-Type: application/octet-stream');
            header("Content-Transfer-Encoding: Binary"); 
            header("Content-disposition: attachment; filename=\"" . basename($file_url) . "\""); 
            readfile($file_url); // do the double-download-dance (dirty but worky)
            return;
        }
		private function fileDelete($fileName) {
			$newFileName = $this->backupFileName($fileName);
			copy($fileName, $newFileName);
			unlink($fileName);
			return $this->fileList(FileSystem::dirTree($this->rootPath));

			return unlink($fileName)
				? "File deleted."
				: "Error while deleting file ".$fileName
				;
		}
		private function fileBrowse($files) {
		    $s = "";
		    $arg = $_GET[Vars::p_fileBrowse];
		    $arg = urldecode($arg);
		    $arg = Tools::PathDecode($arg);
		    $href = $arg;
		    foreach ($files as $key => $v) {
		        $k = $key;
		        $href = $arg.'/'.$k;
		        # instead of /.. at the end, just remove the last directory
		        if (substr($href, -3) == "/.." and substr($href, -4) != "./..")
		            $href = substr($href, 0, -1 * strpos(strrev($href), "/", 3) - 1);
		        $href = urlencode($href);
    		    $href = Tools::PathEncode($href);
                $class = is_array($v) ? "folder" : "file";
		        $debug = "";#'<div><div>'.$h1.'</div><div>'.$h2.'</div><div>'.$kt.'</div></div>';
		        $s .= '<li><a href="'.$href.'" title="'.$k.'" class="'.$class.'">'.$key.'</a>'.$debug.'</li>';
		    }
		    return "<p>Listing <span id=\"dlgBrowseNewPath\">$arg</span>/*</p><ul>$s</ul>";
		}

		private function folderBrowse($files) {
		    return $this->fileBrowse($files);
		}
        private function folderCreate($path) {
            return mkdir($path, 0777, true);
        }

		private function backupFileName($originalFileName) {
			$fileName = $originalFileName;
			$fileExt = substr($fileName, strrpos($fileName, ".") + 1);
			$newFileName = substr($fileName, 0, strrpos($fileName, "."));
			#$newFileName = $newFileName . ".backup." . $fileExt;
			$date = new \DateTime();
			$dateString = $date->format('YmdHis');
			$newFileName = $newFileName . "." . $fileExt;
			$newFileName = $this->backupPath.Tools::FileNameToHtmlID($newFileName);
			$newFileName = $newFileName . "." . $dateString;
			$newFileName = $newFileName . ".bak";
			return $newFileName;
		}
        private function deleteBackups() {
        	foreach (glob($this->backupPath."*.*") as $filename) {
        		if (is_file($filename)) {
        			unlink($filename);
        		}
        	}
			return $this->fileList(FileSystem::dirTree($this->rootPath));
        }

		private function endsWith($string, $needle) {
		    return stripos(strrev($string), $needle) === 0;
		}

	}

	$app = new App();

?>