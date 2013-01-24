<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

	public function index()
	{
        $this->tal->title = 'Just another blog...';
        $populate = array(
            'user' => array(
                'nombre' => 'Leonardo',
                'apellido' => 'Garcia'
            )
        );
        $this->tal->populate = $populate;
        $this->tal->display('home.html');

	}
}
