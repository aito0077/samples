<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui"%>
	
<fieldset class="formstyle">
    <table>
        <tr>
            <td colspan="3">
                <table width="100%" id="planes_grid_propuestas"></table>				
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" id="planes_grid_renovaciones"></table>
            </td>
            <td>
                <fieldset class="formstyle">
                    <ui:field id="planes_total_renovado" label="Saldo total renovado" input_type="text"/>
                    <ui:field id="planes_margen_liberado" label="Margen liberado" input_type="text"/>
                    <ui:field id="planes_cantidad_ayudas_renovadas" label="Cantidad ayudas renovadas" input_type="text"/>
                    <ui:field id="planes_margen_total" label="Margen total" input_type="text"/>
                    <div class="row">
                        <button id="button_planes_actualizar"></button>
                    </div>
                </fieldset>
            </td>						
            <td>
                <fieldset class="formstyle">
                    <legend><strong>Cobro morosidad</strong></legend>
                    <ui:field id="planes_total_deuda_morosidad" label="Total Deuda" input_type="text"/>
                    <div class="row">
                        <button id="button_ver_morosidad"></button>
                    </div>
                </fieldset>
            </td>
        </tr>									
        <tr>
            <td>
                <table id="planes_grid_planes"></table>
            </td>
            <td colspan="2">
                <div id="div_formas_pago"> 
                   <ui:component uri="ayudas/alta/components/formas_pago"/>
                </div>
            </td>
        </tr>
    </table>
</fieldset>
