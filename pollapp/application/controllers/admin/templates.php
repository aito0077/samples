<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Templates extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->model('Proceso');
        $this->load->model('Template');
        $this->load->model('Participant');
        $this->load->helper('file');
        $this->load->helper('url');
        if (!$this->session->userdata('user_id')) {
            redirect('admin/login');
        }
    }

	function index() {

    }

	function get_template($process_code, $activity_code) {
        $html_result = $this->Template->get_template($process_code, $activity_code);
        print($html_result[0]['html']);
    }

	function regenerar_templates() {
        $process_code = $_GET['codigo_proceso'];

        $this->Template->regenerar_templates($process_code, $this->tal);
        header('Content-Type: application/json');
        print(json_encode(array(
            'result' => 'OK'
        )));

    }

    /*
	function upload_batch() {
        if(isset($_FILES['batch_file']) && ($_FILES['batch_file']['error'] == UPLOAD_ERR_OK)) {
            $batch_path = APPPATH.'../static/resources/projects/lotes_participantes/'.basename($_FILES['batch_file']['name']);
            $batch_name = $_FILES['batch_file']['name'];
            if(move_uploaded_file($_FILES['batch_file']['tmp_name'], $batch_path)) {
                $this->preprocess_batch($batch_name, $batch_path, $_POST);
            } else {
                $this->tal->phase_determine_format = FALSE;
                $this->tal->display('admin/participants/batch_import.html');
                $this->tal->error = $_FILES['batch_file']['error'];
            }
         } else {
            $this->tal->phase_determine_format = FALSE;
            $this->tal->display('admin/participants/batch_import.html');
            $this->tal->error = $_FILES['batch_file']['error'];
         }
	}
    */

}

