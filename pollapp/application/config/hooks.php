<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/*
    File: hooks.php
    System hooks to add extra functionality to CI. This code can be added to
    your own config/hooks.php file

    - http://www.codeigniter.com/user_guide/general/hooks.html
*/


/*
    Variable: allow_query_string
    Allows $_GET query strings
*/
$hook['post_controller_constructor'][] = array(
                                'function' => 'allow_query_string',
                                'filename' => 'allow_query_string.php',
                                'filepath' => 'hooks'
                                );
/*
    Variable: flash_helper
    Initiates the flash helper
*/
$hook['post_controller_constructor'][] = array(
                                'function' => 'init_flash',
                                'filename' => 'flash_helper.php',
                                'filepath' => 'helpers'
                                );

/*
    Variable: debug
    Debug output for ezpdo
*/
$hook['post_system'] = array(
                        'function' => 'debug',
                        'filename' => 'debug.php',
                        'filepath' => 'hooks'
                        );

?>