<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Process_Viewer extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->model('Proceso');
        $this->load->model('Participant');
        $this->load->helper('url');
    }

	function index() {

    }

    function login($process_id = NULL, $error_message = NULL) {
        $process_code = $process_id;
        if(!isset($process_code)) {
            if(isset($_POST['process_code'])) {
                $process_code = $_POST['process_code'];
            } else {
                if(isset($_GET['process_code'])) {
                    $process_code = $_GET['process_code'];
                } else {
                    if($this->session->userdata('process_code') != NULL) {
                        $process_code = $this->session->userdata('process_code');
                    } else {
                        //redireccionar a un home
                        $process_code = 'COD1';
                    }
                }
            }
        }
        $this->session->set_userdata('cod_process', $process_code);
        $proceso = $this->Proceso->getByCode(urldecode($process_code));
        $theme = $proceso['theme'];
        $this->tal->proceso = $proceso;
        $this->tal->actividad = array(
            'codigo' => '' 
        );
        $this->tal->campos = $proceso['identity_fields'];
        $this->tal->mensaje = $error_message;

        $template_name = 'workflow/wrapper/'.$theme.'/login.html';
		$this->tal->display($template_name);
    }


    function logout($process_code) {
        $this->session->unset_userdata('participant_id', NULL);
        redirect('/login/'.$process_code);
        //$this->login($process_code, NULL);
    }

    function do_login() {
        $process_id = $_POST['process_code'];

        if(!isset($_POST['login_base'])) {
            redirect('/login/'.$process_id);
        }
        
        $participante = $this->Participant->identificar_participante($process_id, $_POST);
        if(count($participante) == 1) {
            $this->session->set_userdata('participant_id', $participante[0]['_id']);
            $this->session->set_userdata('is_admin', FALSE);
        } else {
            redirect('/login/'.$process_id);
        }
    }

	function bases($process_code) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));
        $this->tal->proceso = $proceso;
        if(isset($proceso['bases'])) {
            $this->tal->bases = $proceso['bases'];
        } else {
            $this->tal->bases = array();
        }
        $theme = $proceso['theme'];
        $template_name = 'workflow/wrapper/'.$theme.'/bases.html';
        $this->tal->display($template_name);
    }

	function render($process_code) {
        if(isset($_POST['login']) && $_POST['login'] == 'DO' ) {
            $this->do_login();
        }
        $current_activity_code = NULL;
        $participant_id = $this->session->userdata('participant_id');
        $is_admin = $this->session->userdata('is_admin');
        if (!$this->session->userdata('participant_id') && !$is_admin) {
            redirect('/login/'.$process_code);
        }
        $participante = array();
        $proceso = $this->Proceso->getByCode(urldecode($process_code));
        $theme = $proceso['theme'];
        if($proceso['tipo'] == 'contenido') {
            $this->tal->proceso = $proceso;
            $template_name = 'workflow/wrapper/'.$theme.'/content_main.html';
        } else {
                $activities = $proceso['activities'];
                if(isset($_POST['activity_code'])) {
                    $current_activity_code = $_POST['activity_code'];
                } else {
                    $current_activity_code = $activities[0]['codigo'];
                }
                //$result_activity = $is_admin || $this->evaluate_activity($proceso, $current_activity_code, $participant_id, $_POST);
                $result_activity = $is_admin || $this->evaluate_activity($proceso, $current_activity_code, $participant_id, $_POST);
                if($is_admin) {
                    $participante = array(
                        'describe' => 'demo',
                        'nombre' => 'demo'
                    );
                } else {
                    $participante = $this->Participant->get_participant($participant_id);
                }
                $this->tal->participante = $participante;
                if($is_admin) {
                    if(isset($_POST['activity_code'])) {
                        $current_activity = $this->get_demo_activity($activities, $current_activity_code);
                    } else {
                        $current_activity = $activities[0];
                    }
                } else {
                    $current_activity = $this->get_next_activity($activities, $participante, $current_activity_code, $result_activity);

                }
                if(!isset($current_activity)) {
                    $this->tal->proceso = $proceso;
                    $this->tal->actividad = array(
                        'codigo' => $current_activity_code
                    );
                    $template_name = 'workflow/wrapper/'.$theme.'/logout.html';
                } else {
                    $this->tal->proceso = $proceso;
                    $this->tal->actividad = $current_activity;
                    $this->tal->actividad_template = $this->get_activity_template($current_activity);
                    $template_name = 'workflow/wrapper/'.$theme.'/cuestionario_wrapper.html';
                }

        }
        $this->tal->display($template_name);
       
	}

    function get_next_activity($activities, $participant, $current_activity, $result_activity) {
        $current_activity = $this->Proceso->get_next_activity($activities, $participant, $current_activity, $result_activity); 
        return $current_activity;
    }

    function get_demo_activity($activities, $current_activity_code) {
        $_next = FALSE;
        $next_activity = NULL;
        usort($activities, function ($a, $b) {
            if($a['orden'] > $b['orden']) return 1;
            if($a['orden'] < $b['orden']) return -1;
            return 0;
        });

        if(!isset($current_activity_code)) {
            return $activities[0];
        }

        foreach($activities as $activity) {
            if($_next) {
                $next_activity = $activity;
                break;
            }
            $_next = ($activity['codigo'] == $current_activity_code);
        } 
        return $next_activity;
    }

    function get_activity_template($activity) {
        $activity_class = $activity['clase'];
        $activity_type = $activity['tipo'];
        return strtolower($activity_class.'_'.$activity_type);
    }

    function evaluate_activity($process_code, $activity_code, $participant_id, $values) {
        if(!isset($activity_code)) {
            return TRUE;
        }
        $actividad = $this->Proceso->get_activity($activity_code);
        $clase = $actividad['clase'];
        if($clase == 'contenido' || $clase == 'especial') {

            $resultado = NULL;
            $this->Participant->guardar_valor($process_code, $activity_code, $participant_id, $resultado, 0);
            return TRUE;
        }
        if(!isset($values[$activity_code])) {
            return FALSE;
        }
        $resultado = $values[$activity_code];
        $time_spent = $values['time_spent'];
        $this->Participant->guardar_valor($process_code, $activity_code, $participant_id, $resultado, $time_spent);

        return TRUE;
    }

    function obtener_campos_login($process_code) {
        
    }

    function get_step($process_code, $activity_code, $participant_id) {
        $step = $this->Participant->get_step($process_code, $activity_code, $participant_id);
        print_r($step);
    }

    function ranking($process_code) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));
        $ranking = $this->Participant->ranking($proceso);
        print_r($ranking);
    }
     
}

