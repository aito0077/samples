<!DOCTYPE html>
<html metal:use-macro="./wrapper/main.html/layout">
    <div id="main_edit" metal:fill-slot="main_content">
        <section id="section_proceso">
            <div class="page-header">
                <h3>Proceso</h3>
            </div>
            <div id="form_proceso">
                <div class="controls controls-row">
                    <label class="span2" for="proceso_codigo">Codigo</label>
                    <input type="text" id="proceso_codigo" class="input-small span2"  placeholder="Codigo..."/>
                </div>
                <div class="controls controls-row">
                    <label class="span2" for="proceso_sumario">Sumario</label>
                    <input type="text" id="proceso_sumario" class="input-xxlarge span6"  placeholder="Sumario..."/>
                </div>

                <div class="controls controls-row">
                    <label class="span2" for="proceso_tipo">Tipo</label>
                    <select class="span5" id="proceso_tipo">
                        <option value="concurso" selected="true">Concurso</option>
                        <option value="evaluacion">Evaluaci&oacute;n</option>
                        <option value="encuesta">Encuesta</option>
                    </select>
                </div>

                <div class="controls controls-row">
                    <label class="span2" for="proceso_fecha_inicio">Fecha Inicio</label>
                    <input type="text" id="proceso_fecha_inicio" class="input-small span2 datepicker"  placeholder="Fecha Inicio..."/>
                    <label class="span2" for="proceso_fecha_fin">Fecha Fin</label>
                    <input type="text" id="proceso_fecha_fin" class="input-small span2 datepicker"  placeholder="Fecha Fin..."/>
                 </div>
             </div>
        </section>

        <section id="section_cuestionario">
            <div class="page-header">
                <div class="row">
                    <div class="span2">
                        <h3>Cuestionario</h3>
                    </div>
                    <div class="span3 offset9">
                        <div class="btn btn-primary" id="button_agregar_pregunta">Agregar Pregunta</div>
                    </div>
                </div>

            </div>
            <div class="accordion" id="cuestionario">
                <div class="accordion-group">
                    <div class="accordion-heading">
                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#cuestionario" href="#pregunta_1">
                           <i class="icon-list"></i> Pregunta 1
                        </a>
                    </div>
                    <div id="pregunta_1" class="accordion-body collapse in">
                        <div class="accordion-inner">
                            <div class="row">
                                <div class="span5">Primera Respuesta</div>
                                <div class="span1"></div>
                                <div class="span1"><button class="btn btn-link"><i class="icon-pencil"></i></button></div>
                                <div class="span1"><button class="btn btn-link"><i class="icon-remove-sign"></i></button></div>
                                <div class="span1"></div>
                                <div class="span1"><button class="btn btn-link"><i class="icon-arrow-up"></i></button></div>
                                <div class="span1"><button class="btn btn-link"><i class="icon-arrow-down"></i></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <div class="form-actions">
            <button type="button" id="button_guardar_proceso" class="btn btn-primary">Guardar</button>
            <button type="button" id="button_cancelar_proceso" class="btn">Cancelar</button>
        </div>

        <!--dialogs-->
        <div class="modal" id="dialog_editar_pregunta" style="display:none" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-show="false">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 id="myModalLabel">Editor Pregunta</h3>
            </div>
            <div class="modal-body">

                <div class="form-horizontal">
                    <label>Descripcion</label>
                    <input type="text" id="proceso_pregunta" class="input-small"  placeholder="Codigo..."/>
                    <label>Tipo</label>
                    <select>
                        <option>Seleccion &uacute;nica</option>
                        <option>Seleccion m&uacute;ltiple</option>
                        <option>Libre</option>
                        <option>Valor</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button id="button_cancelar_pregunta" class="btn" data-dismiss="modal" aria-hidden="true">Cancelar</button>
                <button id="button_guardar_pregunta" class="btn btn-primary">Guardar</button>
            </div>
        </div>
        <!-- /dialogs -->
    </div>

    <tal:block metal:fill-slot="main_js_templates">
    <!-- templates -->
    <script type="text/template" id="item-pregunta-template">
        <div class="accordion-group" id="grupo_pregunta_{{codigo_pregunta}}"> 
            <div class="accordion-heading"> 
                <div class="row">
                    <div class="span9">
                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#cuestionario" href="#{{codigo_pregunta}}">                    <i class="icon-list"></i> {{descripcion_pregunta}}
                        </a>
                    </div>
                </div>
            </div> 
            <div id="{{codigo_pregunta}}" class="accordion-body collapse in"> 
               <div class="accordion-inner"> 
                    <div class="row">
                        <div class="span3 offset9">
                            <div class="btn btn-success" id="button_agregar_pregunta">Agregar Respuesta</div>
                        </div>
                    </div>
                    <div id="respuestas_{{codigo_pregunta}}">
                    </div>
                </div> 
            </div> 
         </div> 
    </script>
    <script type="text/template" id="item-respuesta-template">
        <div id="{{codigo_respuesta}}" class="row"> 
            <div class="span5">{{descripcion_respuesta}}</div> 
            <div class="span1"></div> 
            <div class="span1">
                <button class="btn btn-link">
                   <i class="icon-pencil"></i>
                </button>
            </div> 
            <div class="span1">
                <button class="btn btn-link">
                    <i class="icon-remove-sign"></i>
                </button>
            </div> 
            <div class="span1"> </div> 
            <div class="span1"></div> 
            <div class="span1"></div> 
        </div> 
    </script>

    <script src="/static/js/admin/edit.js"></script>
    <script>
        var edit = new Admin.Edit({
            el: $('#main_edit')
        });
    </script>

    </tal:block> <!-- /container -->
</html>
