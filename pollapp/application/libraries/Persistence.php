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
        if(array_key_exists('id', $entity)) {
            return $this->update($entity_type, $entity, $entity['id']);
        } else {
            return $this->execute('insert', $entity_type, json_encode($entity));
        }
    }

    function update($entity_type, $entity, $id) {
        $http = array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => json_encode($entity)
        );
        if(array_key_exists('id_field', $entity)) {
            $returned_JSON = file_get_contents($this->akka_url. '/insert?TYPE='.$entity_type.'&ID='.$id.'&ID_FIELD='.$entity['id_field'] , NULL, stream_context_create(array('http' => $http) ));
        } else {
            $returned_JSON = file_get_contents($this->akka_url. '/insert?TYPE='.$entity_type.'&ID='.$id, NULL, stream_context_create(array('http' => $http) ));
        }
        return $returned_JSON;
    }
 
    function get($entity_type, $id) {
        $content = '{"_id":"'.$id.'"}';
        $http = array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => $content
        );
        $returned_JSON = file_get_contents($this->akka_url. '/fetch?TYPE='.$entity_type.'&ID='.$id, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
    }
 
    function delete($entity_type, $id) {
        $content = '{"_id":"'.$id.'"}';
        $http = array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => $content
        );
        $returned_JSON = file_get_contents($this->akka_url. '/delete?TYPE='.$entity_type.'&ID='.$id, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
    }
 
    function fetch($entity_type, $query) {
        $query_wrapper = array(
            'query' => $query
        );
        $http = array(
            'method' => 'PUT',
            'header'=> 'Content-type: application/json',
            'content' => json_encode($query_wrapper)
        );
        $returned_JSON = file_get_contents($this->akka_url. '/fetch?TYPE='.$entity_type.'&query='.$query, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
 
    }

    function search($entity_type, $query) {
        return $this->execute('search', $entity_type, $query);
    }

	public function authenticate($email, $password) {
        $http = array();
        $returned_JSON = file_get_contents($this->akka_url. '/authenticate?EMAIL='.$email.'&PASSWORD='.$password, NULL, stream_context_create(array('http' => $http) ));
        return $returned_JSON;
	}



}

/*
Array ( [id] => 503158026_10151052365828027 ) 
Array ( [id] => 503158026_10151052365828027 
        [from] => Array ( 
            [name] => Leonardo Garcia 
            [id] => 503158026 
        ) 
        [message] => test 
        [link] => http://www.qafriend.leo/id 
        [name] => ANSWER - SHARE 
        [caption] => Do you know the answer? if yes click the link or pass this to your friends so they can help me find it 
        [description] => test - test2 
        [icon] => http://www.facebook.com/images/icons/default_app_icon.gif 
        [actions] => Array ( 
            [0] => Array ( 
                [name] => Ask Question 
                [link] => http://www.qafriend.leo/ask 
            ) 
        ) 
        [type] => link 
        [status_type] => app_created_story 
        [application] => Array ( 
            [name] => QAfriendLeo 
            [namespace] => qafriendleo 
            [id] => 450398488344363 
        ) 
        [created_time] => 2012-09-07T13:49:14+0000 
        [updated_time] => 2012-09-07T13:49:14+0000 
        [comments] => Array ( 
            [count] => 0 
        ) 
) 
*/
