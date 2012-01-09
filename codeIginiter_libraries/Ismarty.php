<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

require "Smarty-3.1.5/libs/Smarty.class.php";

class Ismarty extends Smarty
{
	function Ismarty()
	{
        $this->__construct();

		$config =& get_config();


		$this->compile_dir  = BASEPATH . '../application/cache/';
	}
	
	function render($template_string, $params = array())   {
		if (is_array($params) && count($params)) {
			foreach ($params as $key => $value) {
				$this->assign($key, $value);
			}
		}
		
		return parent::display('string:'.$template_string);
	}

	function fetch($template_string, $params = array())   {
		if (is_array($params) && count($params)) {
			foreach ($params as $key => $value) {
				$this->assign($key, $value);
			}
		}
		
		return parent::fetch('string:'.$template_string);
	}
} 
