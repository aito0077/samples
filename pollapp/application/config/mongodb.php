<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['mongo_persist'] = TRUE;
$config['mongo_persist_key'] = 'ci_mongo_persist';
$config['mongo_return'] = 'array';
$config['mongo_query_safety'] = 'fsync';
$config['mongo_supress_connect_error'] = TRUE;
$config['host_db_flag'] = FALSE;

// For OPENSHIFT deployment
/*
$config['mongo_host'] = getenv('OPENSHIFT_NOSQL_DB_HOST');
$config['mongo_port'] = getenv('OPENSHIFT_NOSQL_DB_PORT');
$config['mongo_db'] = getenv('OPENSHIFT_APP_NAME');
$config['mongo_user'] = getenv('OPENSHIFT_NOSQL_DB_USERNAME');
$config['mongo_pass'] = getenv('OPENSHIFT_NOSQL_DB_PASSWORD');
*/

$config['mongo_host'] = "localhost";
$config['mongo_port'] = 27017;
$config['mongo_db'] = "pollapp";
$config['mongo_user'] = "";
$config['mongo_pass'] = "";

