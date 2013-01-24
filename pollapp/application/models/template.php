<?php 
class Template extends CI_Model {

    private $collection_name = 'TEMPLATES';
    function __construct() {
        parent::__construct();
    }

    function regenerar_templates($process_code, $tal) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));

        $has_generations = isset($proceso['template_generation']);
        if($has_generations) {
            $this->mongo_db->where(array('proceso'=>$process_code))->delete_all($this->collection_name);
        }

        if($proceso['tipo'] == 'contenido') {

            $tal->proceso = $proceso;
            $template_name = 'workflow/wrapper/content_main.html';
            $result_html = $this->tal->display($template_name, TRUE);
            $to_persist = array(
                'proceso' => $process_code,
                'html' => $result_html,
                '$inc' => array(
                    'version' => 1
                )
            );
            $this->mongo_db->insert($this->collection_name, $to_persist);

        } else {

            $activities = $proceso['activities'];
            foreach($activities as $activity) {
                $activity_code = $activity['codigo'];
                $this->tal->proceso = $proceso;
                $this->tal->actividad = $activity;
                $this->tal->fragment = strtolower($activity['clase'].'_'.$activity['tipo']);
                //$template_name = $this->get_activity_template($activity);
                $template_name = 'workflow/wrapper/fragments/content_each.html';
                $result_html = $this->tal->display($template_name, TRUE);
                $to_persist = array(
                    'proceso' => $process_code,
                    'actividad' => $activity_code,
                    'html' => $result_html,
                    'version' => 1
                    /*
                    '$inc' => array(
                        'version' => 1
                    )
                    */
                );
                $this->mongo_db->insert($this->collection_name, $to_persist);
            }

            $this->tal->proceso = $proceso;
            $this->tal->actividad = array(
                'codigo' => '' 
            );
            $this->tal->campos = $proceso['identity_fields'];
            $this->tal->fragment = 'login';

            //$template_name = 'workflow/steps/login.html';
            $template_name = 'workflow/wrapper/fragments/content_each.html';
            $result_html = $this->tal->display($template_name, TRUE);
            $to_persist = array(
                'proceso' => $process_code,
                'actividad' => 'login',
                'html' => $result_html,
                'version' => 1
                /*
                '$inc' => array(
                    'version' => 1
                )
                */
            );
 
            $this->mongo_db->insert($this->collection_name, $to_persist);
        }
	}

    function get_activity_template($activity) {
        $activity_class = $activity['clase'];
        $activity_type = $activity['tipo'];
        return strtolower('workflow/steps/'.$activity_class.'_'.$activity_type.'.html');
    }

    function get_template($process_code, $activity_code) {

        $result = $this->mongo_db-> where(array(
             'proceso' => $process_code,
             'actividad' => $activity_code
        ))->get($this->collection_name);
        return $result;
    }

}
