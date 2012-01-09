<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
<fieldset class="formstyle" height="100%">
    <div class="row">
        <label for="identifica_cuil">Cuil:</label>
        <input type="text" name="identifica_cuil" id="identifica_cuil" class="ui-widget-content ui-corner-all ui-state-default" autocomplete="off"/>
        <button id="button_identifica_buscar_asociado" style="display: inline-block;" title="B&uacute;squeda"/>
        <div class="ui-corner-all"  style="border:1px; border-style:dashed; border-color:#DAA520; background-color:#FFFFE0; display: inline-block;">
            <div id="div_datos_socio"></div>
        </div>
    </div>
    <ui:field id="identifica_fecha_nacimiento" label="Fecha Nacimiento" input_type="date"/>
    <div class="row">
        <label for="firstname">Sexo:</label>
        <table>
            <tr valign="middle">
                <td>
                    <ui:field id="identifica_sexo" label="Femenino" value="FEM" input_type="radio"/>
                </td>
                <td>
                    <ui:field id="identifica_sexo" label="Masculino" value="MAS" input_type="radio"/>
                </td>
            </tr>
        </table>
    </div>
    <div id="div_info_entidades" style="display:none">
        <ui:field id="identifica_select_entidad" row_id="row_entidad" label="Entidad" input_type="select"/>
        <div id="row_legajo" class="row">
            <label for="identifica_select_legajos">Legajo:</label>
            <div id="legajo_seleccion" style="display: block">
                <select id="identifica_select_legajos"> </select>
                <button id="button_identifica_ingresar_legajo" style="display: inline-block;" title="Agregar Legajo"/>
            </div>

            <div id="legajo_edicion" style="display: none">
                <input id="identifica_legajo" type="text" class="ui-widget-content ui-corner-all ui-state-default" autocomplete="off"/>
                <div style="display: inline-block">
                    <button id="button_identifica_agregar_legajo" style="display: inline-block;" title="Aceptar"/>
                </div>
                <div style="display: inline-block">
                    <button id="button_identifica_cancelar_legajo" style="display: inline-block;" title="Cancelar"/>
                </div>
            </div>
        </div>
        <ui:field id="identifica_select_sub_entidad" row_id="row_sub_entidad" label="Sub-Entidad" input_type="select"/>
        <ui:field id="identifica_select_categoria" row_id="row_categoria" label="Categor&iacute;a" input_type="select"/>
        <ui:field id="identifica_select_mutual" row_id="row_mutual" label="Mutual" input_type="select"/>
        <ui:field id="identifica_fecha_ingreso" row_id="row_fecha_ingreso" label="Fecha Ingreso" input_type="date"/>
        <ui:field id="identifica_cargo" row_id="row_cargo" label="Cargo" input_type="text"/>
        <ui:field id="identifica_fecha_vencimiento" row_id="row_fecha_vencimiento" label="Fecha Vencimiento" input_type="date"/>
        <ui:field id="identifica_codigo_seguridad" row_id="row_codigo_seguridad" label="C&oacute;digo de Seguridad" input_type="text"/>
        <div id="row_garante" style="display:none" class="row">
            <label for="identifica_codigo_seguridad">Garante:</label>
            <input id="identifica_garante" type="text" class="ui-widget-content ui-corner-all ui-state-default" autocomplete="off"/>
            <button id="button_identifica_buscar_garante" style="display: inline-block;" title="B&uacute;squeda"/>
        </div>
        <ui:field id="checkbox_zona_rural" label="Vive Zona Rural" input_type="checkbox"/>
        <ui:field id="checkbox_cobra_solicitante" label="Cobra Solicitante" input_type="checkbox"/>
        <ui:field id="checkbox_telefono_fijo" label="Tiene Tel&eacute;fono fijo" input_type="checkbox"/>
    </div>
</fieldset>
