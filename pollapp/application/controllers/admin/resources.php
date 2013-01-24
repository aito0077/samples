<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Resources extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->helper('file');
        if (!$this->session->userdata('user_id')) {
            redirect('admin/login');
        }
    }

    function elfinder_init($project_code) {
        $this->load->helper('path');
        $opts = array(
            'roots' => array(
                array( 
                    'driver' => 'LocalFileSystem', 
                    'path'   => APPPATH.'../static/resources/projects/'.$project_code,
                    'URL'    => '/static/resources/projects/'.$project_code.'/',
                    'accessControl' => 'access',
                    'attributes' => array( array(
                        'pattern' => '/\.tmb/',
                        'read' => false,
                        'write' => false,
                        'hidden' => true,
                        'locked' => false
                    ))
                ) 
             )
        );
        $this->load->library('elfinder_lib', $opts);
    }

    function upload_image_redactor($process_code) {
        $relative_path = '/static/resources/projects/'.strtoupper($process_code).'/images/';
        $dir = APPPATH.'..'.$relative_path;
        
        $_FILES['file']['type'] = strtolower($_FILES['file']['type']);
         
        if ($_FILES['file']['type'] == 'image/png' || $_FILES['file']['type'] == 'image/jpg' || $_FILES['file']['type'] == 'image/gif' || $_FILES['file']['type'] == 'image/jpeg' || $_FILES['file']['type'] == 'image/pjpeg') {   
            $filename = md5(date('YmdHis')).'.jpg';
            $file = $dir.$filename;

            // copying
            copy($_FILES['file']['tmp_name'], $file);

            // displaying file    
            $array = array(
                'filelink' => $relative_path.$filename
            );

            echo stripslashes(json_encode($array));   

         }
    }

    function list_resources() {
        header('Content-Type: application/json');
        $resources = array();
        if(isset($_GET['codigo_proceso'])) { 
            $path = '/static/resources/projects/'.$_GET['codigo_proceso'].'/';
            $result = get_filenames(APPPATH.'..'.$path, FALSE, TRUE);
            if(is_array($result)) { 
                foreach($result as $resource) {
                    array_push($resources, array(
                        'path' => $path.$resource,
                        'filename' => $resource
                    ));
                }
            }
        }
        print(json_encode(array(
            'recursos' => $resources
        )));
    }

    function list_themes() {
        header('Content-Type: application/json');
        $resources = array();
        $path = '/static/resources/themes/';
        $result = get_dir_file_info(APPPATH.'..'.$path, TRUE);

        if(is_array($result)) { 
            foreach($result as $resource) {
               if(is_dir($resource['relative_path'])) {
                    $name = $resource['name'];
                    array_push($resources, array(
                        'tema' => $name,
                        'descripcion' => ucwords(str_replace('_', ' ', $name))
                    ));
               }
            }
        }
        print(json_encode(array(
            'temas' => $resources
        )));
    }



}

