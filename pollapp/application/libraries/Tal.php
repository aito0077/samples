<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

include 'phptal/PHPTAL.php';

class Tal extends PHPTAL{

    function __construct() {

        parent::__construct();
        $CI = &get_instance(); //BUGGGGGG!!!! CI FORUM BUG, REMOVE the ; SYNTAX ERROR!
        $cache_path = $CI->config->item('cache_path');

        if(empty($cache_path)) {
            $cache_path = APPPATH.'cache/';
        }

        $this->setEncoding($CI->config->item('charset'));
        $this->setTemplateRepository(APPPATH.'views/');
        $this->setPhpCodeDestination($cache_path);
        
    }

    function display($tpl, $return=false) {
        $this->setTemplate($tpl);
        if($return){
            return $this->execute();
        }
        $this->echoExecute();
    }

}

?> 
