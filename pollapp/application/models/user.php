<?php 
class User extends CI_Model {
    private $collection_name = 'USER';

    function __construct() {
        parent::__construct();
    }

    function authenticate($user, $password) {
        $authentication = $this->mongo_db->where(array(
            'email' => $user,
            'password' => $password
        ))->limit(1)->get($this->collection_name);
        print_r($authentication);
        return $authentication;
    }

    function authenticate_by_service($user, $password) {
        $authentication = json_decode($this->persistence->authenticate($_POST['usuario'], $_POST['password']));
        return $authentication;
    }

}
