<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>

<fieldset class="formstyle">
    <legend><strong>Verificaci&oacute;n Identidad</strong></legend>
    <div class="row" id="div_mensaje_respuesta_nosis"> </div>
    <div class="row" id="div_informacion_asociado"> </div>
</fieldset>
<fieldset class="formstyle">
    <div id="nosis_tab">
        <ul id="ul_nosis_tab">
            <li><a href="#div_carga_manual">Carga Manual</a></li>
            <li><a href="#div_omitir_carga">Omitir Carga</a></li>
        </ul>
        <div id="div_carga_manual" height="100%" style="overflow:auto;">
            <div class="row">
                <ui:field id="nosis_entidades" row_id="row_nosis_entidades" label="Entidad" input_type="select"/>
                <button id="button_nosis_web"/>
            </div>
            <div class="row">
                <label>Situaci&oacute;n</label>
                <table>
                    <tr>
                        <td>
                            <ui:field id="nosis_situacion_1" name="nosis_situacion" label="1" value="1" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_situacion_2" name="nosis_situacion" label="2" value="2" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_situacion_3" name="nosis_situacion" label="3" value="3" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_situacion_4" name="nosis_situacion" label="4" value="4" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_situacion_5" name="nosis_situacion" label="5" value="5" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_situacion_6" name="nosis_situacion" label="6" value="6" input_type="radio"/>
                        </td>
                        <td>
                            <ui:field id="nosis_judicializada" name="nosis_judicializada" label="Judicializada" input_type="checkbox"/>
                        </td>
                    </tr>
                </table>
            </div>
            <ui:field id="nosis_deuda_monto" row_id="row_nosis_deuda_monto" label="Monto" input_type="text"/>
            <ui:field id="nosis_deuda_periodo" row_id="row_nosis_deuda_periodo" label="Periodo" input_type="text"/>
            <div class="row">
                <button id="button_agregar_deuda"/>
            </div>
        </div>
        <div id="div_omitir_carga" height="100%" style="overflow:auto">
            <div class="row">
                <label for="nosis_motivo_omision" style="horizontal-align:left;vertical-align:top">Motivo:</label>
                <input type="textarea" id="nosis_motivo_omision" rows="7" style="resize:none; width:100%"/>
            </div>
        </div>
    </div>
</fieldset>
<table width="100%" id="nosis_grilla_deuda"> </table>
