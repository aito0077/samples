<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->helper('url');
        if (!$this->session->userdata('user_id')) {
            redirect('admin/login');
        }
    }

	function index() {
        //$this->load->view('admin/mongodbadmin.php');
        redirect('admin/process');
	}

	function db_admin() {
        $this->load->view('admin/mongodbadmin.php');
	}

}

