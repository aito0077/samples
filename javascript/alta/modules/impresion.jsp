<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
<fieldset >
    <legend><strong>Datos ayuda econ&oacute;mica</strong></legend>
    <table width="70%" border="0" align="left" cellpadding="10" cellspacing="0">
        <tr>
            <td width="33%">
                <label>Nro. Ayuda</label>:&nbsp;&nbsp;[Nro. ayuda]
            </td>
            <td width="33%">
                <label>Tipo Ayuda</label>:&nbsp;&nbsp;[Tipo ayuda]				  		
            </td>
            <td >
                <label>Per&iacute;odo Inicio de Descuento</label>:&nbsp;&nbsp;[Per&iacute;odo]
            </td>
        </tr>
        <tr>
            <td >
                <label>Monto Solicitado</label>:&nbsp;&nbsp;
                <label>$</label>&nbsp;&nbsp;[Monto]
            </td>
            <td >
                <label>Cantidad Cuotas</label>:&nbsp;&nbsp;[Cuotas]
            </td>
            <td >
                <label>Importe Cuota</label>:&nbsp;&nbsp;
                <label>$</label>&nbsp;&nbsp;[Monto]
            </td>
        </tr>
        <tr>
            <td >
                <label>Proveedor Financiero</label>:&nbsp;&nbsp;
                <label>$</label>&nbsp;&nbsp;[Monto]
            </td>
            <td >
                <label>Forma Pago</label>:&nbsp;&nbsp;[Cuotas]
            </td>
            <td >&nbsp;</td>
        </tr>			
    </table>		
</fieldset>	
<br /><br />
<fieldset >
    <legend><strong>Datos solicitante</strong></legend>
    <table width="70%" border="0" align="left" cellpadding="10" cellspacing="0">
        <tr>
            <td width="50%">
                <label>CUIL</label>:&nbsp;&nbsp;[Nro. CUIL]
            </td>
            <td >
                <label>Nombre</label>:&nbsp;&nbsp;[Nombre]				  		
            </td>
        </tr>
        <tr>
            <td >
                <label>Entidad</label>:&nbsp;&nbsp;[Entidad]
            </td>
            <td >
                <label>Legajo</label>:&nbsp;&nbsp;[Legajo]
            </td>							
    </table>		
</fieldset>
<br /><br />
<fieldset >
    <legend><strong>Documentos a imprimir</strong></legend>
    <table width="70%" border="0" align="left" cellpadding="10" cellspacing="0">
        <tr>
            <td >
                <div >
                  <input type="checkbox" id='checkbox_caratula_impresiones' value="opción" />
                  <label>Car&aacute;tula de Impresiones</label>
                </div>
            </td>
        </tr>
    </table>		
</fieldset>	
