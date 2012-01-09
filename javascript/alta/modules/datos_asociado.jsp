<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>
<fieldset >
    <legend><strong>Alta socio</strong></legend>
    <table width="100%" border="0" align="left" cellpadding="10" cellspacing="0">
        <tr>
            <td >
                <div align="left">
                    <label>Apellido</label>:&nbsp;&nbsp;
                    <input type="text" id='asociado_apellido' size="20"/>
                </div>
            </td>
            <td >
                <div align="left">
                    <label>Nombres</label>:&nbsp;&nbsp;
                    <input type="text" id='asociado_nombres' size="25"/>
                    &nbsp;&nbsp;
                    <img src="images/Info.gif" width="15" height="15" />
                </div>
            </td>
            <td >
                <div align="left">
                    <label>Documento</label>:&nbsp;&nbsp;
                    <select id="asociado_select_documento_tipo" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                    <input type="text" id='asociado_documento_numero' size="10"/>
                    &nbsp;&nbsp;
                    <img src="images/Info.gif" width="15" height="15" />
                </div>
            </td>				
        </tr>
        <tr>
            <td >
                <div align="left">
                    <label>Nacionalidad</label>:&nbsp;&nbsp;
                    <select id="asociado_select_nacionalidad" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </div>
            </td>
            <td >
                <div align="left">
                    <label>Estado civil</label>:&nbsp;&nbsp;
                    <select id="asociado_select_estado_civil" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </div>
            </td>
            <td >
                &nbsp;&nbsp;				  	
            </td>				
        </tr>			
    </table>		
    <br/>
    <fieldset >
        <legend><strong>Datos personales</strong></legend>
        <table width="100%" border="0" align="left" cellspacing="0">
            <tr>
                <td width="50%">
                    <fieldset >
                        <legend><strong>Domicilio</strong></legend>
                        <div align="left">
                            <label>Tipo</label>:&nbsp;&nbsp;
                            <select id="asociado_select_tipo_domicilio" >
                                <option value="seleccione">Seleccione...</option>	
                            </select>
                            &nbsp;&nbsp;
                            <img src="images/iconosButtons/agregar.gif" width="16" height="16" />
                            <img src="images/iconosButtons/eliminar.gif" width="16" height="16" />
                        </div>
                    </fieldset>
                </td>
                <td >
                    <fieldset >
                        <legend><strong>Tel&eacute;fono</strong></legend>
                        <table width="100%" border="0" align="left" cellpadding="10" cellspacing="0">
                            <tr>
                                <td width="30">
                                    <label>Principal</label>:
                                </td>
                                <td align="left">
                                    [Tel&eacute;fono principal]
                                    &nbsp;&nbsp;
                                    <img src="images/iconosButtons/agregar.gif" width="16" height="16" />
                                    <img src="images/iconosButtons/eliminar.gif" width="16" height="16" />
                                </td>							
                            </tr>
                            <tr>
                                <td >
                                    <label>Alternativo</label>:
                                </td>
                                <td align="left">
                                    [Tel&eacute;fono Alternativo]
                                    &nbsp;&nbsp;
                                    <img src="images/iconosButtons/agregar.gif" width="16" height="16" />
                                    <img src="images/iconosButtons/eliminar.gif" width="16" height="16" />
                                </td>							
                            </tr>
                            <tr>
                                <td >
                                    <label>Email</label>:
                                </td>
                                <td align="left">
                                    <input type="text" id='asociado_email' size="50"/>
                                </td>							
                            </tr>																
                        </table>		
                    </fieldset>
                </td>
            </tr>
            <tr>
                <td >
                    <fieldset >
                        <legend><strong>Padrino</strong></legend>
                        <table width="100%" border="0" align="left" cellpadding="10" cellspacing="0">
                            <tr>
                                <td width="15">
                                    <label>Cuil</label>:
                                </td>
                                <td >
                                    <input id="asociado_cuil" type="text"/>&nbsp;&nbsp;
                                    <img src="images/atb_search.gif" width="15" height="15" />
                                </td>
                            </tr>
                        </table>						
                    </fieldset>
                </td>
                <td >
                    <table width="100%" border="0" align="left" cellpadding="10" cellspacing="0">
                        <tr>
                            <td width="100">
                                <label>Conoci&oacute; la mutual por</label>:
                            </td>
                            <td >
                                <select id="asociado_select_conocio_mutual" >
                                    <option value="seleccione">Seleccione...</option>	
                                </select>
                            </td>
                        </tr>
                    </table>											
                </td>
            </tr>			
        </table>
    </fieldset>	
    <br />
    <fieldset >
        <legend><strong>Informaci&oacute;n adicional</strong></legend>
        <table width="50%" border="0" align="left" cellpadding="0" cellspacing="10">
            <tr>
                <td width="90">
                    <label>Actividad</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_actividad" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>				
            </tr>
            <tr>
                <td >
                    <label>Estudios</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_estudios" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>				
            </tr>
            <tr>
                <td >
                    <label>Profesi&oacute;n</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_profesion" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>										
            </tr>
            <tr>
                <td >
                    <label>Deporte</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_deporte" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>
            </tr>
            <tr>
                <td >
                    <label>Pasatiempo</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_pasatiempo" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>
            </tr>														
        </table>
        <table width="50%" border="0" align="left" cellpadding="0" cellspacing="10">
            <tr>
                <td width="110">
                    <label>Tipo obra social</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_tipo_obra_social" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>						
            </tr>
            <tr>
                <td >
                    <label>Situaci&oacute;n vivienda</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_situacion_vivienda" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>						
            </tr>
            <tr>
                <td >
                    <label>Bancarizado</label>:
                </td>
                <td align="left">
                    <input type="checkbox" id='asociado_checkbox_bancarizado' value="opci&oacute;n" />
                </td>						
            </tr>
            <tr>
                <td >
                    <label>Caja ahorro/Cta. cte.</label>:
                </td>
                <td align="left">
                    <input type="checkbox" id='asociado_checkbox_caja_ahorro' value="opci&oacute;n" />
                </td>
                <td width="75">
                    <label>Tarjeta cr&eacute;dito</label>:
                </td>
                <td align="left">
                    <input type="checkbox" id='asociado_checkbox_tarjeta_cr&eacute;dito' value="opci&oacute;n" />
                </td>						
            </tr>
            <tr>
                <td >
                    <label>Banco de cobro</label>:
                </td>
                <td align="left">
                    <select id="asociado_select_banco_cobro" >
                        <option value="seleccione">Seleccione...</option>	
                    </select>
                </td>										
            </tr>														
        </table>		
    </fieldset>
    <br />
    <fieldset >
        <legend><strong>Autorizado al cobro</strong></legend>
        <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">
            <tr>
                <td width="100">
                    <label>Apellido y nombres</label>:
                </td>
                <td align="left">
                    <input type="text" id='asociado_asociado_apellido_nombre' size="80"/>
                </td>
                <td width="120">
                    <label>Tipo y Nro. Documento</label>:
                </td>
                <td align="left">
                    <input type="text" id='asociado_asociado_documento' size="12"/>
                </td>							
            </tr>															
        </table>		
        
    </fieldset>
</fieldset>
