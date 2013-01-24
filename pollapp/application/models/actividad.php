<?php 
class Actividad extends CI_Model {
    private $collection_name = 'ACTIVIDAD';

    function __construct() {
        parent::__construct();
    }

    function listAll() {
        return $this->mongo_db->order_by(array('codigo' => 'ASC'))->get($this->collection_name);
    }

    function getByCode($code) {
        $result = $this->mongo_db-> where(array(
            'codigo' => $code
        ))->get($this->collection_name);
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
        $proceso['codigo'] = strtoupper($process['codigo']);
        $process_id = $this->mongo_db->insert($this->collection_name, $proceso);
        return $process_id;
    }

    function update($process, $session) {
        $persisted_process = array_merge($this->getByCode($process['codigo']), array(
            'modificado_por' => $session->userdata('user_id')
        ));
        $proceso = array_merge($persisted_process, $process);
        unset($proceso['_id']);
        $process_id = $this->mongo_db->where(array('codigo'=>$proceso['codigo']))->update($this->collection_name, $proceso);
        return $process_id;
    }

    function add_activity($process_code, $activity, $session) {

        $this->mongo_db->where(array('codigo'=>$process_code))->inc(array('cantidad_actividades' => 1))->update($this->collection_name);
        $this->mongo_db->where(array('codigo'=>$process_code))->push('activities', $activity)->update($this->collection_name);
    }

    function remove_activity($activity_code, $session) {
        $query = array("codigo" => 'COD7');

        $command = array( '$pull' => 
            array( "activities" => 
                array( '$elemMatch' =>
                    array( "codigo" => $activity_code)
                )
            )
        );

        print(json_encode($command));
        $this->db->PROCESOS->update($query, $command);

        /*
        $this->db->PROCESOS->activities->remove(array(
            '$elemMatch' => array(
                'codigo' => $activity_code
            )
        ));
        */
        /*
        $this->db->PROCESOS->update(array('codigo' => 'COD7'), array('$pull' =>array('activities' =>array(
            '$elemMatch' => array(
                'codigo' => $activity_code)
            )
        )));
        */
        //$this->mongo_db->where(array('codigo'=>'COD7'))->pull('activities', array('$elemMatch' => array('codigo' => $activity_code)))->update($this->collection_name);

        //$this->mongo_db->where('activities.codigo', $activity_code)->unset_field('activities.$.codigo')->update($this->collection_name);
        //$this->mongo_db->pull('activities.codigo', NULL)->update($this->collection_name);

        //$this->mongo_db->where('items', "5678")->unset_field('items.$')->update('mycollection');
        //$this->mongo_db->pull('items', NULL)->update('mycollection');
    }

    function remove() {

    }

    function reorder_activities($process_code, $activities_order, $session) {
        foreach($activities_order as $activity) {
            $activity_persisted = $this->get_activity($activity->codigo);
            print_r($activity);
            $this->mongo_db->pull('activities', array('codigo'=>$activity->codigo))->update($this->collection_name);
            $activity_persisted['orden'] = $activity->order;
            $this->mongo_db->where(array('codigo'=>$process_code))->push('activities', $activity_persisted)->update($this->collection_name);
            //$this->mongo_db->where(array('activities.codigo'=>$activity->codigo))->set('activities.$.order', $activity->order)->update($this->collection_name);
        }
    }

    function update_activity($process_code, $activity, $session) {
        $activity_code = $activity['codigo'];

        $activity_old = get_activity($process_code, $activity_code);
        $activity_to_persist = array_merge($activity_old, $activity);
        $this->mongo_db->where(array('codigo'=>$process_code))->pull('activities', array('codigo'=>$activity_code))->update($this-collection_name);
        $this->mongo_db->where(array('codigo'=>$process_code))->push('activities', $activity_to_persist)->update($this->collection_name);
    }

    function get_activity($activity_code) {
        $result = $this->mongo_db->where(array('activities.codigo'=>$activity_code))->get($this->collection_name);
        if(count($result) >= 1) {
            $activity_found = NULL;
            foreach($result[0]['activities'] as $activity) {
                if($activity['codigo'] == $activity_code) {
                    $activity_found = $activity;
                }
            } 
            return $activity_found;
        }
        return $result;
    }


    function get_next_activity($activities, $current_activity_code) {
        if(!isset($current_activity_code)) {
            return $activities[0];
        }
        $_next = false;
        $next_activity = NULL;
        usort($activities, function ($a, $b) {
            if($a['orden'] > $b['orden']) return 1;
            if($a['orden'] < $b['orden']) return -1;
            return 0;
        });

        foreach($activities as $activity) {
            if($_next) {
                $next_activity = $activity;
            }
            $_next = ($activity['codigo'] == $current_activity_code);
        } 
        return $next_activity;
    }

	private function connection_string($CI) 
	{
		
		$host	= trim($CI->config->item('mongo_host'));
		$port = trim($CI->config->item('mongo_port'));
		$user = trim($CI->config->item('mongo_user'));
		$pass = trim($CI->config->item('mongo_pass'));
		$dbname = trim($CI->config->item('mongo_db'));
		$persist_key = trim($CI->config->item('mongo_persist_key'));
		$query_safety = trim($CI->config->item('mongo_query_safety'));
		$dbhostflag = (bool)$CI->config->item('host_db_flag');
		
		$connection_string = "mongodb://";
		
		if (empty($host))
		{
			show_error("The Host must be set to connect to MongoDB", 500);
		}
		
		if (empty($dbname))
		{
			show_error("The Database must be set to connect to MongoDB", 500);
		}
		
		if ( ! empty($user) && ! empty($pass))
		{
			$connection_string .= "{$user}:{$pass}@";
		}
		
		if (isset($port) && ! empty($port))
		{
			$connection_string .= "{$host}:{$port}";
		}
		else
		{
			$connection_string .= "{$host}";
		}
		
		if ($dbhostflag === TRUE)
		{
			$connection_string = trim($connection_string) . '/' . $dbname;
		}
		
		else
		{
			$connection_string = trim($connection_string);
		}
        return $connection_string;
	}

	private function connect() {
		$CI = get_instance();
		$CI->config->load($this->config_file);
		$dbname = trim($CI->config->item('mongo_db'));
		$persist = trim($CI->config->item('mongo_persist'));
		
		$options = array();
		if ($persist === TRUE) {
			$options['persist'] = isset($this->persist_key) && !empty($this->persist_key) ? $this->persist_key : 'ci_mongo_persist';
		}
		try {
			$connection = new Mongo($this->connection_string($CI), $options);
			$this->db = $connection->{$dbname};
			return ($this);	
		} catch (MongoConnectionException $e) {
			if($CI->config->item('mongo_supress_connect_error')) {
				show_error("Unable to connect to MongoDB", 500);
			} else {
				show_error("Unable to connect to MongoDB: {$e->getMessage()}", 500);
			}
		}
	}


}
