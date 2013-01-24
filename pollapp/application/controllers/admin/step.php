<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Step extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->helper('url');
        if (!$this->session->userdata('user_id')) {
            redirect('admin/login');
        }
    }

	function index() {
        $procesos = $this->persistence->fetch('PROCESOS', array());
        $result = array(
            'procesos' => json_decode($procesos)
        );
        $this->tal->result = $result;
		$this->tal->display('admin/list.php');
	}

	function agregar() {
		$this->tal->display('admin/edit.php');
	}

	function editar($cod) {
		$this->tal->display('admin/edit.php');
	}

	function visualizar($cod) {
		$this->tal->display('admin/step.php');
	}

	function concurso() {
		$this->tal->display('admin/nav.php');
	}

    function guardar_proceso() {
        $result = $this->persistence->save('PROCESOS', $_GET);
        header('Content-Type: application/json');
        print($result);
    }
}

