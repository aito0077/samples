<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Persistence {

    public $akka_url = "http://0.0.0.0:8090";

    function call($path, $http = array()){
        return file_get_contents($this->akka_url. '/' . $path, NULL, stream_context_create(array('http' => $http)));
    }


    function execute($operation, $entity_type, $content) {
        $result = $this->call($operation.'?type='.$entity_type, 
        array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => $content
        ));
        return $result;
    }

    function save($entity_type, $entity) {
        return $this->execute('save', $entity_type, $entity);
    }

    function get($entity_type, $id) {
        $content = '{"id":"'.$id.'"}';
        $http = array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => $content
        );
        $returned_JSON = file_get_contents($this->akka_url. '/fetch?TYPE='.$entity_type.'&ID='.$id, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
    }
 
    function delete($entity_type, $id) {
        $content = '{"id":"'.$id.'"}';
        return $this->execute('delete', $entity_type, $content);
    }

    function fetch($entity_type, $field, $query) {
        $content = '{"id":"'.$id.'"}';
        return $this->execute('search', $entity_type, $filter);
    }

	public function authenticate($email, $password) {
        $http = array();
        $returned_JSON = file_get_contents($this->akka_url. '/authenticate?EMAIL='.$email.'&PASSWORD='.$password, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
	}



}

