<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Process extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->model('Proceso');
        $this->load->model('Recurso');
        $this->load->model('Participant');
        $this->load->helper('url');
        if (!$this->session->userdata('user_id')) {
            redirect('admin/login');
        }
    }

	function index() {
        $this->listing();
    }

	function listing() {
        $processes = $this->Proceso->listAll();
        $this->tal->processes = $processes;
		$this->tal->display('admin/process/list.html');
	}

	function add() {
        $this->tal->batches = $this->Participant->list_batches();
		$this->tal->display('admin/process/edit_proceso.html');
	}

	function edit($cod) {
        $this->tal->codigo_proceso =  urldecode($cod);
        $this->tal->batches = $this->Participant->list_batches();
		$this->tal->display('admin/process/edit_proceso.html');
	}

	function view($cod) {
        $proceso = $this->Proceso->getByCode(urldecode($cod));
        if(!empty($proceso)) {
            $result = array(
                'proceso' => $proceso
            );
            $this->tal->result = $result;
            $this->tal->ranking = $this->ranking_general($proceso['codigo']);
            $this->tal->display('admin/process/view.html');
        } else {
            $this->tal->error = 'No existe el proceso solicitado';
            $this->listing();
        }
	}

    function insert_proceso() {
        if($this->validate()) { 
            $process_id = $this->Proceso->insert($_GET, $this->session);
            header('Content-Type: application/json');
            $result = array(
                'id' => $process_id
            );
            if(isset($process_id, $_GET['codigo'])) {
                $codigo_proceso = trim(strtoupper($_GET['codigo']));
                try {
                    if(isset($_GET['theme'])) {
                        $this->Recurso->copy_process_resource_repository($codigo_proceso, $_GET['theme']);
                    } else {
                        $this->Recurso->create_process_resource_repository($codigo_proceso);
                    }
                } catch(Exception $e) {
                    $result['error'] = $e;
                }
            }
 
            print(json_encode($result));
        }
    }

    function update_proceso() {
        if($this->validate()) { 
            $result = $this->Proceso->update($_GET, $this->session);
            header('Content-Type: application/json');
            print($result);
        }
    }

    function remove_proceso($process_code) {
        if(isset($process_code)) {
            $this->Proceso->remove($process_code);
            try {
                $this->Recurso->remove_process_repository($process_code);
            } catch(Exception $e) {
            }
        }
        $this->listing();
    }


    function add_activity() {
        $activity = array(
            'codigo' => strtoupper($_GET['codigo']),
            'orden' => $_GET['orden'],
            'descripcion' => $_GET['descripcion'],
            'clase' => $_GET['clase'],
            'datapath' => $_GET['datapath'],
            //'filename' => $_GET['filename'],
            'tipo' => $_GET['tipo']
        );
        if(isset($_GET['pregunta'])) {
            $activity['pregunta'] = $_GET['pregunta'];
        }
        if(isset($_GET['respuestas'])) {
            $activity['respuestas'] = json_decode($_GET['respuestas']);
        }

        if(isset($_GET['texto'])) {
            $activity['texto'] = json_decode($_GET['texto']);
        }
        switch ($activity['clase']) {
            case 'contenido':
                break;
            case 'especial':
                if($activity['tipo'] == 'VIDEO' || $activity['tipo'] == 'FLASH') {
                    $activity['media_url'] = $activity['datapath'];
                }
                $activity['descripcion'] = $activity['tipo'];
                break;
        }

        $result = $this->Proceso->add_activity(strtoupper($_GET['codigo_proceso']), $activity,  $this->session);
        header('Content-Type: application/json');
        print(json_encode($activity));
    }

    function get_activity($activity_code) {
        $activity = $this->Proceso->get_activity($activity_code);
        print_r($activity);
    }

    function get_activities() {
        $activities = $this->Proceso->get_activities($_GET['process_code']);
        header('Content-Type: application/json');
        print(json_encode($activities));
    }
       
    function remove_activity() {
        $this->Proceso->remove_activity($_GET['process_code'], $_GET['activity_code'],  $this->session);
        header('Content-Type: application/json');
        print('{"result":"ok"}');
    }

    function reorder_activities() {
        $activities_order = json_decode($_GET['activities_order']);
        $result = $this->Proceso->reorder_activities(strtoupper($_GET['codigo_proceso']), $activities_order,  $this->session);
        header('Content-Type: application/json');
        print(json_encode(array('result'=> 'OK')));
     }

    function update_activity() {
        $activity = array(
            'codigo' => strtoupper($_GET['codigo']),
            'orden' => $_GET['orden'],
            'descripcion' => $_GET['descripcion'],
            'clase' => $_GET['clase'],
            'datapath' => $_GET['datapath'],
            'tipo' => $_GET['tipo']
        );

        if(isset($_GET['pregunta'])) {
            $activity['pregunta'] = $_GET['pregunta'];
        }
        if(isset($_GET['respuestas'])) {
            $activity['respuestas'] = json_decode($_GET['respuestas']);
        }

        if(isset($_GET['texto'])) {
            $activity['texto'] = json_decode($_GET['texto']);
        }
        switch ($activity['clase']) {
            case 'contenido':
                break;
            case 'especial':
                $activity['descripcion'] = $activity['tipo'];
                break;
        }

        $result = $this->Proceso->update_activity(strtoupper($_GET['codigo_proceso']), $activity,  $this->session);
        header('Content-Type: application/json');
        print(json_encode($activity));
    }

    function traer_proceso() {
        header('Content-Type: application/json');
        if(isset($_GET['codigo'])) { 
            $proceso = $this->Proceso->getByCode($_GET['codigo']);
            if(!empty($proceso)) {
                if(isset($proceso['batch_id'])) {
                    $proceso['batch_id'] = (string)$proceso['batch_id'];
                }
                $result = array(
                    'proceso' => $proceso
                );
                print(json_encode($result));
            } else {

            }
        }
    }

    function validate() {
        return true;
    }

    function ranking_general($process_code) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));

        $results = $this->Participant->ranking($proceso);

        $index = 1;
        $order_results = array();
        foreach($results as $item) {
           array_push($order_results, array_merge($item, array('orden'=>$index)));
           $index++; 
        }
        return $order_results;
    }

    function view_participant_performance($process_code, $participant_id) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));

        $results = $this->Participant->participant_performance($proceso, $participant_id);
        $participant = $this->Participant->get_participant($participant_id);

        $this->tal->results = $results;
        $this->tal->participant = $participant;

        $this->tal->display('admin/process/view_participant.html');

    }

}

