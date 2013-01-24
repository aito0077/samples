<?php 
class Participant extends CI_Model {
    private $collection_name = 'CANDIDATES';
    private $participant_collection = 'PARTICIPANT';
    private $process_collection = 'PROCESOS';

    function __construct() {
        parent::__construct();
    }

    function list_batches() {
        $batches = $this->mongo_db->get($this->collection_name);
        return $batches;
    }

    function get_batch_by_id($id) {
        $result = $this->mongo_db->where(array('_id' => new MongoId($id)))->get($this->collection_name);
        if(count($result) >= 1) {
            return $result[0];
        } else {
            return NULL;
        }
    }

    function update_batch($batch_id, $batch, $options) {
        $persisted_batch = array_merge($batch, $options);
        unset($persisted_batch['_id']);
 
        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->update($this->collection_name, $persisted_batch);
        return TRUE;
    }

    function batch_remove($batch_id) {
        $batch = $this->get_batch_by_id($batch_id);

        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->delete($this->collection_name);

        $processes = $this->mongo_db->where(array('batch_id' => new MongoId($batch_id)))->get($this->process_collection);

        foreach($processes as $process) {
            $this->mongo_db->where(array('codigo' => $process['codigo']))->unset_field('batch_id')->update($this->process_collection);
            $this->mongo_db->where(array('proceso' => $process['codigo']))->delete($this->participant_collection);
        }

        return TRUE;
    }

    function create_record($batch_id, $values, $definitions) {
        $record = array();
        foreach($definitions as $definition) {
            $index = $definition['order'];
            $record[$definition['name']] = $values[$index];
        }
        return $record;
    }

    function add_record($batch_id, $values) {
        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->push(array('participants' => $values))->update($this->collection_name);
        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->inc(array('cantidad'=> 1))->update($this->collection_name);
        $processes = $this->mongo_db->where(array('batch_id' => new MongoId($batch_id)))->get($this->process_collection);

        $batch = $this->get_batch_by_id($batch_id);
        $definitions = $batch['definicion_columnas'];
        
        foreach($processes as $process) {
            $record = array();
            $record['proceso'] = $process['codigo'];
            $record['steps'] = array();

            foreach($definitions as $field) {
                $field_name = $field['name'];
                if($field['describe']) {
                    $record['describe'] = $record[$field_name];
                }
            }  

            $record_to_persist = array_merge($values, $record);
            $this->mongo_db->insert($this->participant_collection, $record_to_persist);
        }
    }

    function get_identity_fields_from_definition($batch) {
        $identities = array();
        $definitions = $batch['definicion_columnas'];
        foreach($definitions as $definition) {
            if($definition['login']) {
                array_push($identities, $definition['name']);
            }
        }
        return $identities;
    }

    function remove_record($batch_id, $values) {
        $batch = $this->get_batch_by_id($batch_id);
        $identities = $this->get_identity_fields_from_definition($batch);
        $query = array();
        foreach($identities as $identity) {
            $query[$identity] =  $values[$identity];
        }

        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->pull('participants', $query)->update($this->collection_name);
        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->inc(array('cantidad'=> -1))->update($this->collection_name);

        $processes = $this->mongo_db->where(array('batch_id' => new MongoId($batch_id)))->get($this->process_collection);

        foreach($processes as $process) {
            $process_query = array_merge($query, array('proceso' => $process['codigo']));
            $this->mongo_db->where($process_query)->delete($this->participant_collection);
        }
    }

    function update_activity($process_code, $activity, $session) {
        $activity_code = $activity['codigo'];
        $activity_old = $this->get_activity($process_code, $activity_code);
        $activity_to_persist = array_merge($activity_old, $activity);

        $this->mongo_db->where(array('codigo'=>$process_code))->pull('activities', array('codigo'=>$activity_code))->update($this->collection_name);
        $this->mongo_db->where(array('codigo'=>$process_code))->push('activities', $activity_to_persist)->update($this->collection_name);
    }

    function update_record($batch_id, $values) {
        $batch = $this->get_batch_by_id($batch_id);
        $identities = $this->get_identity_fields_from_definition($batch);

        $record_old = $this->get_batch_record($batch, $identities, $values);

        if($record_old == NULL) {
            return FALSE;
        }

        unset($values['id']);
        $record_to_persist = array_merge($record_old, $values);

        $query = array();
        foreach($identities as $identity) {
            $query[$identity] =  $values[$identity];
        }

        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->pull('participants', $query)->update($this->collection_name);
        $this->mongo_db->where(array('_id' => new MongoId($batch_id)))->push('participants', $record_to_persist)->update($this->collection_name);


        $processes = $this->mongo_db->where(array('batch_id' => new MongoId($batch_id)))->get($this->process_collection);

        foreach($processes as $process) {

            $process_query = array_merge($query, array('proceso' => $process['codigo']));
            $old_participant = $this->mongo_db->where($process_query)->get($this->participant_collection);
            unset($old_participant['_id']);
            $participant_to_persist = array_merge($old_participant, $values);
            $this->mongo_db->where(array('codigo'=>$proceso['codigo']))->update($this->collection_name, $participant_to_persist);
        }

        return TRUE;
    }

    function get_batch_record($batch, $identities, $values) {
        $record_found = NULL;
        foreach($batch['participants'] as $participant) {
            $find = FALSE;
            foreach($identities as $identity) {
                $find = ($participant[$identity] == $values[$identity]);
            }
            if($find) {
                $record_found = $participant;
            }
        }
        return $record_found;
    }

    function init_batch($file_name, $file_path, $options) {
        $batch = array(
            'file_name' => $file_name,
            'file_path' => $file_path,
            'descripcion' => $options['batch_descripcion'],
            'cantidad' => 0
        );
        $batch_id = $this->mongo_db->insert($this->collection_name, $batch);
        return $batch;
    }

    function associate_batch_process($batch, $process, $session) {
        $batch_id = $batch['_id'];
        $process_code = $process['codigo'];
        $participants = array();
        $candidates = $batch['participants'];
        $definitions = $batch['definicion_columnas'];
        $identity_fields = array();
        foreach($definitions as $definition) {
            if($definition['login']) {
                //array_push($identity_fields, $definition['name']);
                array_push($identity_fields, $definition);
            }
        }
        
        $this->mongo_db->where(array('proceso'=>$process_code))->delete_all($this->participant_collection);

        foreach($candidates as $candidate) {
            $record = array();
            $record['proceso'] = $process_code;
            $record['steps'] = array();
            //foreach($identity_fields as $field) {
            foreach($definitions as $field) {
                $field_name = $field['name'];
                $record[$field_name] = $candidate[$field_name];   
                if($field['describe']) {
                    $record['describe'] = $record[$field_name];
                }
            }  
            $this->mongo_db->insert($this->participant_collection, $record);
        }

        $this->update_batch($batch_id, $batch, array(
            'codigo_proceso' => $process_code 
        ));

        $persisted_process = array_merge($process, array(
            'batch_id' => $batch_id,
            'modificado_por' => $session->userdata('user_id'),
            'identity_fields' => $identity_fields
        ));
        $proceso = array_merge($process, $persisted_process);
        unset($proceso['_id']);
        $this->mongo_db->where(array('codigo'=>$process_code))->update('PROCESOS', $proceso);

    }


    function get_participant($participant_id) {
        $participant = $this->mongo_db->where(array('_id' => new MongoId($participant_id)))->limit(1)->get($this->participant_collection);
        return $participant[0];
    }

    function identificar_participante($process_code, $values_map) {
        $proceso = $this->Proceso->getByCode(urldecode($process_code));
        $identity_fields = $proceso['identity_fields'];
        $filter = array();
        foreach($identity_fields as $field) {
            $filter[$field['name']] = $values_map[$field['name']];
        }
        return $this->mongo_db->where($filter)->limit(1)->get($this->participant_collection);
    }


    function get_step($process_code, $activity_code, $participant_id) {
        $participant = $this->mongo_db->where(array(
            '_id' => new MongoId($participant_id)
        ))->get($this->participant_collection);
        $steps = $participant[0]['steps'];
        $result = array();
        foreach($steps as $step) {
            if($step['activity_code'] = $activity_code) {
                $result = $step;
                break;
            }
        }

        return $result;

    }

    function guardar_valor($process_code, $activity_code, $participant_id, $resultado, $time_spent) {
        //$this->mongo_db->where(array('activities.codigo'=>$activity->codigo))->set('activities.$.orden', $activity->order)->update($this->collection_name);

        $valor_actividad = array(
            'activity_code' => $activity_code,
            'timestamp' => $this->mongo_db->date(),
            'time_spent' => $time_spent
        );
        if(isset($resultado)) {
            $valor_actividad['activity_value'] = $resultado;
        }
        $this->mongo_db->where(array('_id' => new MongoId($participant_id)))->push('steps', $valor_actividad)->update($this->participant_collection);

    }


    function ranking($process) {
        $participants = $this->mongo_db->where(array('proceso' => $process['codigo']))->get($this->participant_collection);
        $activities = $process['activities'];
        $responses = array();
        foreach($activities as $activity) {
            if(isset($activity['respuestas'])) {
                $respuestas = $activity['respuestas']; 
                foreach($respuestas as $respuesta) {
                    if($respuesta['correcta']) {
                        $responses[$activity['codigo']] = $respuesta['valor'];
                        break;
                    }
                }
            }
        }
        $results = array();
        foreach($participants as $participant) {
            $ranking = array_reduce($participant['steps'], function($result, $item) { 
                if(isset($item['time_spent'])) {
                    $result['time_spent'] += $item['time_spent']; 
                }
                $activity_code = $item['activity_code'];
                if(array_key_exists($activity_code, $result['responses'])) {
                    if($result['responses'][$activity_code] == $item['activity_value']) {
                        $result['respuestas_correctas'] += 1; 
                    }
                }
                $result['cantidad_respuestas'] += 1; 
                return $result; 
            }, array(
                'responses' => $responses,
                'participant' => $participant['_id'],
                'id' => $participant[$process['identity_fields'][0]['name']],
                'describe' => $participant['describe'],
                'cantidad_respuestas' => 0,
                'respuestas_correctas' => 0,
                'time_spent' => 0
            )); 
            array_push($results, array(
                'participant_id' => $ranking['participant'],
                'describe' => $ranking['describe'],
                'id' => $ranking['id'],
                'time_spent' => $ranking['time_spent'],
                'tiempo' => $this->millis_to_seconds($ranking['time_spent']),
                'cantidad_respuestas' => $ranking['cantidad_respuestas'],
                'cantidad_respuestas_correctas' => $ranking['respuestas_correctas']
            ));     
        }
        usort($results, function ($b, $a) {
            if($a['cantidad_respuestas'] > $b['cantidad_respuestas']) return 1;
            if($a['cantidad_respuestas'] < $b['cantidad_respuestas']) return -1;
            if($a['cantidad_respuestas_correctas'] > $b['cantidad_respuestas_correctas']) return 1;
            if($a['cantidad_respuestas_correctas'] < $b['cantidad_respuestas_correctas']) return -1;
            if($a['time_spent'] > $b['time_spent']) return -1;
            if($a['time_spent'] < $b['time_spent']) return 1;
            return 0;
        });

        return ($results);

    }

    function participant_performance($process, $participant_id) {
        $participant = $this->mongo_db->where(array( '_id' => new MongoId($participant_id)))->get($this->participant_collection);
        $activities = $process['activities'];
        $result = array();

        foreach($activities as $activity) {
            $activity_record = array();
            foreach($participant[0]['steps'] as $step) {
                if($step['activity_code'] == $activity['codigo']) {
                    if(isset($step['activity_value'])) {
                        $activity_record['valor'] = $step['activity_value'];
                    }
                    $activity_record['tiempo_milis'] = $step['time_spent'];
                    $activity_record['tiempo'] = $this->millis_to_seconds($step['time_spent']);
                    break;
                }
            }
            $activity_record['codigo'] = $activity['codigo'];
            $activity_record['orden'] = $activity['orden'];
            if(isset($activity['respuestas'])) {
                $activity_record['pregunta'] = $activity['pregunta'];
                $respuestas = $activity['respuestas']; 
                foreach($respuestas as $respuesta) {
                    if($respuesta['correcta']) {
                        $activity_record['respuesta_correcta'] = $respuesta['valor'];
                        $activity_record['codigo_respuesta_correcta'] = $respuesta['codigo'];
                        $activity_record['acerto'] = (isset($respuesta['valor'], $activity_record['valor']) && $respuesta['valor'] == $activity_record['valor']) ? TRUE: FALSE;
                        break;
                    }
                }
            } else {
                $activity_record['pregunta'] = '-';
                $activity_record['respuesta_correcta'] = '-';
                $activity_record['codigo_respuesta_correcta'] = '-';
                $activity_record['acerto'] = FALSE;
                $activity_record['valor'] = '-';

            }
            if(!isset($activity_record['valor'])) {
                $activity_record['valor'] = '-';
            }
            if(!isset($activity_record['tiempo'])) {
                $activity_record['tiempo']  = array(
                    'segundos' => '-',
                    'minutos' => '-'
                );
            }
            array_push($result, $activity_record);
        }
        return $result; 
    }
/*
    function ranking_per_activity($process) {
        $participants = $this->mongo_db->where(array('proceso' => $process['codigo']))->get($this->participant_collection);
        $activities = $process['activities'];

        foreach($activities as $activity) {
            if(isset($activity['respuestas'])) {
                $respuestas = $activity['respuestas']; 
                foreach($respuestas as $respuesta) {
                    if($respuesta['correcta']) {
                        $responses[$activity['codigo']] = $respuesta['valor'];
                        break;
                    }
                }
            }
        }
        $results = array();
        foreach($participants as $participant) {
            $ranking = array_reduce($participant['steps'], function($result, $item) { 
                if(isset($item['time_spent'])) {
                    $result['time_spent'] += $item['time_spent']; 
                }
                $activity_code = $item['activity_code'];
                if(array_key_exists($activity_code, $result['responses'])) {
                    if($result['responses'][$activity_code] == $item['activity_value']) {
                        $result['respuestas_correctas'] += 1; 
                    }
                }
                $result['cantidad_respuestas'] += 1; 
                return $result; 
            }, array(
                'responses' => $responses,
                'participant' => $participant['_id'],
                'describe' => $participant['describe'],
                'cantidad_respuestas' => 0,
                'respuestas_correctas' => 0,
                'time_spent' => 0
            )); 
            array_push($results, array(
                'participant_id' => $ranking['participant'],
                'describe' => $ranking['describe'],
                'time_spent' => $ranking['time_spent'],
                'tiempo' => $this->millis_to_seconds($ranking['time_spent']),
                'cantidad_respuestas' => $ranking['cantidad_respuestas'],
                'cantidad_respuestas_correctas' => $ranking['respuestas_correctas']
            ));     
        }
        usort($results, function ($b, $a) {
            if($a['cantidad_respuestas'] > $b['cantidad_respuestas']) return 1;
            if($a['cantidad_respuestas'] < $b['cantidad_respuestas']) return -1;
            if($a['cantidad_respuestas_correctas'] > $b['cantidad_respuestas_correctas']) return 1;
            if($a['cantidad_respuestas_correctas'] < $b['cantidad_respuestas_correctas']) return -1;
            if($a['time_spent'] > $b['time_spent']) return 1;
            if($a['time_spent'] < $b['time_spent']) return -1;
            return 0;
        });

        return ($results);

    }
    */



    function millis_to_seconds($input) {
        $uSec = $input % 1000;
        $input = floor($input / 1000);
        $seconds = $input % 60;
        $input = floor($input / 60);
        $minutes = $input % 60;
        $input = floor($input / 60); 

        return array(
            'milisegundos' => $uSec,
            'segundos' => ($seconds < 10 ? '0'.$seconds : $seconds),
            'minutos' => ($minutes < 10 ? '0'.$minutes: $minutes)
        );
    }
}



