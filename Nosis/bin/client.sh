#!/bin/sh

#SET CLIENT_HOME directory

java -jar -Dlog4j.configuration=file:../.dist/conf/log4j.properties ../.dist/WebNosis.jar $1 $2
