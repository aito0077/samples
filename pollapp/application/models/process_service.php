<?php 
class Process_Service extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    function listAll() {
        $procesos = $this->persistence->fetch('PROCESOS', array());
        return $procesos;
    }

    function getByCode($code) {
        $query = array(
            'codigo' => $code
        );
        $result = json_decode($this->persistence->fetch('PROCESOS', $query));
        if(count($result) >= 1) {
            return $result[0];
        }
        return $result;
    }

    function insert($process, $session) {
        $process_default = array(
            'codigo' => '',
            'sumario' => '',
            'tipo' => '',
            'fecha_inicio' => '',
            'fecha_fin' => '',
            'estado' => 'INACTIVO',
            'creado_por' => $session->userdata('user_id')
        );

        $proceso = array_merge($process_default, $process);
        $result = $this->persistence->save('PROCESOS', $proceso);
        return $result;
    }

    function update($process, $session) {
        $process_default = array(
            'id_field' => 'codigo',
            'modificado_por' => $session->userdata('user_id')
        );
        $result = $this->persistence->update('PROCESOS', $proceso, $process['codigo']);
        return $result;
    }

    function remove() {

    }
}
