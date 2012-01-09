<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
<fieldset class="formstyle">
    <div style="vertical-align: top">
        <span class="ui-icon ui-icon-contact" style="display:inline-block"></span><span style="vertical-align:top; display:inline-block" class="ui-button-text"><b>Documento</b></span>
    </div>
    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_dni_nuevo" name="dni_carnet" label="DNI (Nuevo Carnet)" value="1" input_type="radio"/>
    </div>
    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_dni_libreta" name="dni_carnet" label="DNI (Libreta)" value="2" input_type="radio"/>
        <ui:field id="documentacion_libreta_civica" name="dni_carnet" label="Libreta C&iacute;vica" value="22" input_type="radio"/>
        <ui:field id="documentacion_libreta_enrolamiento" name="dni_carnet" label="Libreta de Enrolamiento" value="21" input_type="radio"/>
    </div>
    <div class="row" id="row_detalle_dni" style="display:none">
        <table width="100%" border="0" align="left" cellpadding="5" cellspacing="0">
            <tr>
                <td width="15%">
                    <ui:field id="documentacion_foto_ok" label="Foto OK" value="3" input_type="checkbox"/>
                </td>
                <td width="15%">
                    <ui:field id="documentacion_troquelado" label="Troquelado" value="4" input_type="checkbox"/>
                </td>
                <td width="15%">
                    <ui:field id="documentacion_sello_registro_civil" label="Sello Registro Civil" value="5" input_type="checkbox"/>
                </td>
                <td width="15%">
                    <ui:field id="documentacion_hoja_voto" label="Hoja de Votos" value="20" input_type="checkbox"/>
                </td>
                <td >
                    <ui:field id="documentacion_complementaria" label="Doc. Complementaria" value="26" input_type="checkbox"/>
                    <button id="button_complementaria_dni"/>
                </td>
            </tr>
        </table>
    </div>   

    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_tirilla" name="dni_carnet" label="Tirilla" value="0" input_type="radio"/>
    </div>
    <div class="row" id="row_detalle_tirilla" style="display:none">
        <table width="100%" border="0" align="left" cellpadding="5" cellspacing="0">
            <tr>
                <td width="15%">
                    <ui:field id="documentacion_ci_pasaporte" name="dni_tirilla" label="CI o Pasaporte" value="6" input_type="checkbox"/>
                </td>
                <td width="15%">
                    <ui:field id="documentacion_dni_viejo" name="dni_tirilla" label="DNI Viejo" value="23" input_type="checkbox"/>
                </td>
                <td width="15%">
                    <ui:field id="documentacion_doc_complementaria" name="dni_tirilla" label="Doc. Complementaria" value="7" input_type="checkbox"/>
                    <button id="button_complementaria_tirilla"/>
                </td>
            </tr>
        </table>
    </div>
</fieldset>
<br/>
<fieldset class="formstyle">
    <div style="vertical-align: top">
        <span class="ui-icon ui-icon-document" style="display:inline-block"></span><span style="vertical-align:top; display:inline-block" class="ui-button-text"><b>Servicios</b></span>
    </div>
    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_servicio_titular" name="tipo_servicio" label="Servicio a nombre del titular" value="TIT" input_type="radio"/>
    </div>
    <div class="row" id="row_servicios_titular" style="display:none">
        <table width="100%">
            <tr>
                <td>
                    <ui:field id="documentacion_luz" name="servicio_titular" label="Luz" value="8" input_type="radio"/>
                </td>
                <td>
                    <ui:field id="documentacion_gas" name="servicio_titular" label="Gas" value="9" input_type="radio"/>
                </td>
                <td>
                    <ui:field id="documentacion_telefono" name="servicio_titular" label="Tel&eacute;fono" value="10" input_type="radio"/>
                </td>
                <td>
                    <ui:field id="documentacion_agua" name="servicio_titular" label="Agua" value="24" input_type="radio"/>
                </td>
            </tr>
        </table>
    </div>
	
    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_servicio_terceros" name="tipo_servicio" label="Servicio a nombre de terceros" value="TER" input_type="radio"/>
    </div>
    <div class="row" id="row_servicios_terceros" style="display:none">
        <ui:field id="documentacion_acredita_vinculo" name="servicio_terceros" label="Acredita V&iacute;nculo" value="11" input_type="radio"/>
        <ui:field id="documentacion_coincide_domicilio_dni" name="servicio_terceros" label="Coincide Domicilio con DNI" value="12" input_type="radio"/>
    </div>

    <div class="row" style="color:#1c94c4; font-weight:bold">
        <ui:field id="documentacion_otros_servicios" name="tipo_servicio" label="Otros servicios" value="OTR" input_type="radio"/>
    </div>
    <div class="row formstyle" id="row_servicios_otros" style="display:none">
        <ui:field id="documentacion_factura_celular" name="otros_servicios" label="Factura celular a nombre de titular" value="13" input_type="radio"/>
        <ui:field id="documentacion_resumen_tarjeta" name="otros_servicios" label="Resumen de tarjeta de cr&eacute;dito a nombre del titular" value="14" input_type="radio"/>
        <ui:field id="documentacion_contrato_alquiler" name="otros_servicios" label="Contrato de alquiler" value="15" input_type="radio"/>
        <ui:field id="documentacion_certificado_domicilio_original" name="otros_servicios" label="Certificado Domicilio (original)" value="16" input_type="radio"/>
        <ui:field id="documentacion_certificado_domicilio_copia" name="otros_servicios" label="Certificado Domicilio (copia)" value="25" input_type="radio"/>
        <ui:field id="documentacion_certificado_declaracion_jurada" name="otros_servicios" label="Declaracion Jurada" value="17" input_type="radio"/>
    </div>
    <ui:field id="documentacion_pendiente_entrega" label="Documentaci&oacute;n pendiente de entrega" value="" input_type="checkbox"/>
</fieldset>
