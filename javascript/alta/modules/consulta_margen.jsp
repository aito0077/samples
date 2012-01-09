<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
<fieldset class="formstyle">
    <table width="100%" border="0" align="left" cellpadding="10" cellspacing="0">
        <tr>
            <td align="center">
                <ui:field id="margen_recibo_periodo" label="Recibo del Per&iacute;odo" input_type="date"/>
            </td>
            <td align="center">
                <ui:field id="margen_sueldo_basico" label="Sueldo B&aacute;sico" input_type="text"/>
            </td>
            <td align="center">
                <ui:field id="margen_descuento_ley" label="Descuento de Ley" input_type="text"/>
            </td>
        </tr>
    </table>
    <table width="100%" border="0" align="left" cellspacing="0">
        <tr>
            <td width="50%">
                <fieldset class="formstyle" style="height:100%">
                    <legend><strong>Detalle de descuentos</strong></legend>
                    <ui:field id="margen_total_descuento" label="Total de descuento" input_type="text"/>
                    <ui:field id="margen_proximo_descuento" label="Pr&oacute;ximo descuento" input_type="text"/>
                    <ui:field id="margen_con_salud" label="Con Salud" input_type="checkbox"/>
                </fieldset>
            </td>
            <td width="50%">
                <fieldset class="formstyle" style="height:100%">
                    <legend><strong>Libre deuda y margen</strong></legend>
                    <ui:field id="margen_libre_deuda" label="Libre deuda" input_type="text"/>
                    <ui:field id="margen_deseado" label="Margen deseado" input_type="text"/>
                </fieldset>
            </td>
        </tr>
    </table>
</fieldset>
    <table width="100%" align="right" cellpadding="10" cellspacing="0">
        <tr>
            <td align="right">
                <ui:field id="margen_margen" row_id="row_margen" label="Margen" input_type="text"/>
            </td>
        </tr>
    </table>
