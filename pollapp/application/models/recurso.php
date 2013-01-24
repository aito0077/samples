<?php 
class Recurso extends CI_Model {

    function __construct() {
        parent::__construct();
        $this->load->helper('directory');
    }

    function create_process_resource_repository($process_code) {
        $process_route = APPPATH.'../static/resources/projects/'.strtoupper($process_code);
        if( ! is_dir($process_route)) {
            if (mkdir($process_route,0777)) {
                mkdir($process_route.'/js',0777);
                mkdir($process_route.'/css',0777);
                mkdir($process_route.'/images',0777);
            } else {
                return FALSE;
            }
        }
          
        return $process_route; 

    }

    function copy_process_resource_repository($process_code, $style_theme) {
        $process_route = APPPATH.'../static/resources/projects/'.strtoupper($process_code);
        $style_route = APPPATH.'../static/resources/themes/'.strtolower($style_theme);
         
        system("cp -a $style_route $process_route");
        return $process_route; 
    }

    function remove_process_repository($process_code) {
        $process_route = APPPATH.'../static/resources/projects/'.strtoupper($process_code);
        system("rm -rf $process_route");
    }

    function recurse_copy($src,$dst) { 
        $dir = opendir($src); 
        mkdir($dst, 0777); 
        while(false !== ( $file = readdir($dir)) ) { 
            if (( $file != '.' ) && ( $file != '..' )) { 
                if ( is_dir($src . '/' . $file) ) { 
                    recurse_copy($src . '/' . $file,$dst . '/' . $file); 
                } else { 
                    copy($src . '/' . $file,$dst . '/' . $file); 
                } 
            } 
        } 
        closedir($dir); 
    } 
 
}
