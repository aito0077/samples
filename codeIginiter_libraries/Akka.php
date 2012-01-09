<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Akka {

    public $akka_url = "http://0.0.0.0:8090";

    function call($path, $http = array()){
        return json_decode(file_get_contents($this->akka_url. '/' . $path, NULL, stream_context_create(array('http' => $http))));
    }

}
