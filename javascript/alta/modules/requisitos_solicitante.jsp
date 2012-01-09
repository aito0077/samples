<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui"%>
<fieldset class="formstyle">
    <div class="row">
        <ui:field id="requisitos_tipo_ayuda" row_id="row_tipo_ayuda" label="Tipo de ayuda" input_type="select"/>
        <input id="button_requisitos_carga_detalle" type="button" title="Carga Detalles" style="display:none"/>
    </div>
    <div id="row_ventas_contado" class="row" style="display:none">
        <table width="100%" id="requisitos_grid_ventas_contado"></table>
    </div>
    <div id="row_detalle_venta" class="row" style="display:none">
        <table width="100%" id="requisitos_grid_detalle_ventas"></table>
    </div>
    <div class="row">
        <fieldset>
            <table>
                <tr valign="middle">
                    <td>
                        <ui:field id="requisitos_tipo_monto" label="Maximo" value="MAX" input_type="radio"/>
                    </td>
                    <td>
                        <ui:field id="requisitos_tipo_monto" label="Neto (en mano)" value="NET" input_type="radio"/>
                    </td>
                    <td>
                        <ui:field id="requisitos_tipo_monto" label="Bruto (solicitado)" value="SOL" input_type="radio"/>
                    </td>
                </tr>
            </table>
        </fieldset>
    </div>
    <div class="row">
        <table>
            <tr>
                <td>
                    <ui:field id="requisitos_monto" row_id="row_requisitos_monto" label="Monto" input_type="text" extension="style='display:none'"/>
                </td>
                <td>
                    <ui:field id="requisitos_cuotas_desde" row_id="row_cantidad_cuotas" label="Entre" input_type="text"/>
                </td>
                <td>
                    <ui:field id="requisitos_cuotas_hasta" row_id="row_cantidad_cuotas" label="y" input_type="text"/>
                </td>
            </tr>
        </table>
    </div>
    <ui:field id="requisitos_check_forma_pago_especial" label="Desea una forma de pago especial?" input_type="checkbox"/>
    <ui:field id="requisitos_forma_pago_especial" row_id="row_formas_pago_especial" label="Forma de pago" input_type="select"/>
</fieldset>
