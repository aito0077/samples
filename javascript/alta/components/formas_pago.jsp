<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>

<fieldset class="formstyle">
    <legend><strong>Selecci&oacute;n de forma de pago</strong></legend>
    <ui:field id="fpago_forma_pago" row_id="row_fpago_forma_pago" label="Forma de pago" input_type="select"/>
    <ui:field id="fpago_banco" row_id="row_fpago_banco" label="Boca de pago" input_type="select"/>
    <div class="row">
        <ui:field id="fpago_sucursal" row_id="row_fpago_sucursal" label="Sucursal" input_type="text"/>
        <button id="button_fpago_sucursales"></button>
    </div>
    <div class="row" id="row_git_gir">
        <ui:field id="fpago_git_gir" label="Sucursal" input_type="text"/>
        <button id="button_fpago_sucursales"></button>
    </div>
    <ui:field id="fpago_boca" row_id="row_fpago_boca" label="Boca de pago" input_type="select"/>
    <ui:field id="fpago_cuenta" row_id="row_fpago_cuenta" label="Cuenta" input_type="select"/>
    <ui:field id="fpago_delegacion" row_id="row_fpago_delegacion" label="Delegaci&oacute;n" input_type="select"/>
</fieldset>
