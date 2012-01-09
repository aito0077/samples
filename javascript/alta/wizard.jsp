<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
    <div id="div_wizard_manager">

        <table width="100%" height="100%" border="0" align="center" cellpadding="5" cellspacing="1" id="navigator_table">
            <tr heigth="90%">
                <td colspan="2" valign="top" width="80%" height="100%">
                    <div id="navigator">
                        <ul id="ul_navigator">
                        </ul>
                        <div id="IDENTIFICACION" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/identificar_solicitante"/>
                        </div>
                        <div id="REQUISITOS" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/requisitos_solicitante"/>
                        </div>
                        <div id="MARGEN" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/consulta_margen"/>
                        </div>
                        <div id="DOCUMENTACION" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/control_documentacion"/>
                        </div>
                        <div id="NOSIS" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/informacion_nosis"/>
                        </div>
                        <div id="PLANES" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/planes_formas_pago"/>
                        </div>
                        <div id="ASOCIADO" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/datos_asociado"/>
                        </div>
                        <div id="IMPRESION" height="100%" style="overflow:scroll;">
                            <ui:component uri="ayudas/alta/modules/impresion"/>
                        </div>
                    </div>
                </td>
                <td valign="top" width="20%">
                    <div id="div_summary">
                    </div>
                </td>
            </tr>
            <tr height="10%">
                <td align="left">
                    <button id="button_wizard_volver" class="ui-widget"/>
                </td>
                <td align="right">
                    <button id="button_wizard_continuar" class="ui-widget"/>
                </td>
                <td align="center" id="footer_column_1" width="20%"> 
                    <button id="button_wizard_cancelar" class="ui-widget"/>
                </td>
            </tr>
        </table>

    </div>
        
<!--Dialogs-->
<div id="div_busqueda_asociado" style="display:none" >
    <ui:component uri="ayudas/alta/dialogs/busqueda_asociados"/>
</div>

