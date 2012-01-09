package clienteWeb;

import au.id.jericho.lib.html.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpHost;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthPolicy;
import org.apache.commons.httpclient.auth.AuthScope;
import clienteWeb.StrictSSLProtocolSocketFactory;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.protocol.Protocol;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.FileNotFoundException;

public class FormularioAnses {

    public static void main(String[] args) throws Exception {
        String MASCARA =     "                                                  "
                            +"                                                  "
                            +"                                                  "
                            +"                                                  "
                            +"    ";
        int STATUS = -1;

        String RESULTADO = "";
        String ERROR = null;
        String COD_RTA = "00";
        String TRANSACCION = "";
        String FIRMA = "";
        String FECHA = "";
        String HORA = "";
        String PRIMERMENSUAL = "";
        String FECHA_FORMATO = "";

        String [] PARAMETROS = args[0].replaceAll("ç"," ").split(":");

        String usuario = PARAMETROS[0];
        String password = PARAMETROS[1];
        String beneficio = PARAMETROS[2];
        String apellidoNombre = PARAMETROS[3];
        boolean nombreControl = (PARAMETROS[4] != null && PARAMETROS[4].trim().toUpperCase().equals("S"));
        String tipoDescuento = PARAMETROS[5];
        String codigoDescuento = PARAMETROS[6];
        String importe = PARAMETROS[7];
        String cuotas = PARAMETROS[8];
        String comprobante = PARAMETROS[9];
        String rutaTxt = PARAMETROS[10];

        try {
            String txtApellido = "";

            StrictSSLProtocolSocketFactory ASSL = new StrictSSLProtocolSocketFactory(false);
            Protocol protocolo = new Protocol("https", ASSL, 443);
            Protocol.registerProtocol("https", protocolo);

            HttpHost HOST = new HttpHost("200.26.56.113",443,protocolo);

            HttpClient httpclient = new HttpClient();
            httpclient.getHostConfiguration().setHost(HOST);
            httpclient.getState().setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(usuario, password));
            
            List authPrefs = new ArrayList(3);
            authPrefs.add(AuthPolicy.BASIC);
            authPrefs.add(AuthPolicy.NTLM);
            
            httpclient.getParams().setParameter(AuthPolicy.AUTH_SCHEME_PRIORITY, authPrefs);
            httpclient.getParams().setParameter(httpclient.getParams().USER_AGENT, "MSIE 6.0");
            httpclient.getParams().setCookiePolicy(CookiePolicy.BROWSER_COMPATIBILITY);
            
            //Seteo de campos
            NameValuePair __EVENTTARGET         = new NameValuePair("__EVENTTARGET","");
            NameValuePair __EVENTARGUMENT       = new NameValuePair("__EVENTARGUMENT","");
            NameValuePair __VIEWSTATE           = new NameValuePair("__VIEWSTATE","");
            NameValuePair TxtIdBenef            = new NameValuePair("TxtIdBenef",beneficio.trim());
            NameValuePair txtIDNovedad          = new NameValuePair("txtIDNovedad","");
            NameValuePair TxtApellidoNombre     = new NameValuePair("TxtApellidoNombre","");
            NameValuePair DDLTipoConcepto       = new NameValuePair("DDLTipoConcepto",tipoDescuento.trim());
            NameValuePair DDLConceptoOPP        = new NameValuePair("DDLConceptoOPP",codigoDescuento.trim());
            NameValuePair TxtComprobante        = new NameValuePair("TxtComprobante",comprobante.trim().replaceAll("%"," "));
            NameValuePair TxtImpTotal           = new NameValuePair("TxtImpTotal",importe.trim());
            NameValuePair TxtCantCuotas         = new NameValuePair("TxtCantCuotas",cuotas.trim());
            NameValuePair __CURRENTREFRESHTICKET= new NameValuePair("__CURRENTREFRESHTICKET","2");

            //Navegamos hasta llegar al formulario

            GetMethod httpget = new GetMethod("/");
            STATUS = httpclient.executeMethod(httpget);

            httpget = new GetMethod("https://200.26.56.113/datsite/");
            STATUS = httpclient.executeMethod(httpget);

            httpget = new GetMethod("https://200.26.56.113/datsite/home.aspx");
            STATUS = httpclient.executeMethod(httpget);

            httpget = new GetMethod("https://200.26.56.113/datsite/ABMNovedades.aspx");
            STATUS = httpclient.executeMethod(httpget);

            //SEGUNDO FORMULARIO - Cargamos id beneficio y Buscamos

            __VIEWSTATE.setValue(getViewState(httpget.getResponseBodyAsString()));
            __CURRENTREFRESHTICKET.setValue("2");
            TxtIdBenef.setValue(beneficio);
            httpget.setQueryString(new NameValuePair[]{TxtIdBenef,  __VIEWSTATE, __CURRENTREFRESHTICKET});
            STATUS = httpclient.executeMethod(httpget);

            //PRESIONAMOS BUSCAR
            __EVENTTARGET.setValue("btnBuscar:_ctl0");
            __EVENTARGUMENT.setValue("");
            __CURRENTREFRESHTICKET.setValue("3");
            __VIEWSTATE.setValue(getViewState(httpget.getResponseBodyAsString()));
            httpget.setQueryString(new NameValuePair[]{TxtIdBenef, __VIEWSTATE, __CURRENTREFRESHTICKET,__EVENTTARGET,__EVENTARGUMENT});
            STATUS = httpclient.executeMethod(httpget);

            __EVENTTARGET.setValue("BtnNuevo:_ctl0");
            __EVENTARGUMENT.setValue("");
            __CURRENTREFRESHTICKET.setValue("4");
            __VIEWSTATE.setValue(getViewState(httpget.getResponseBodyAsString()));
            
            txtApellido = getValorFormulario(httpget.getResponseBodyAsString(),"TxtApellidoNombre");
            if(nombreControl && STATUS == 200) {
                if(txtApellido == null) {
                    txtApellido = "";
                }
                if(!txtApellido.trim().equals(apellidoNombre.replaceAll("_"," ").trim())) {
                    RESULTADO = "01"+txtApellido+MASCARA.substring(2+txtApellido.length()-1);
                    generarTxt(rutaTxt, RESULTADO);
                    return;
                }
            }
            TxtApellidoNombre.setValue(txtApellido);

            httpget.setQueryString(new NameValuePair[]{TxtIdBenef, TxtApellidoNombre,__VIEWSTATE, __CURRENTREFRESHTICKET,__EVENTTARGET,__EVENTARGUMENT});
            STATUS = httpclient.executeMethod(httpget);
            
            __EVENTTARGET.setValue("DDLTipoConcepto");
            __EVENTARGUMENT.setValue("");
            __CURRENTREFRESHTICKET.setValue("5");
            __VIEWSTATE.setValue(getViewState(httpget.getResponseBodyAsString()));
            httpget.setQueryString(new NameValuePair[]{TxtIdBenef, TxtApellidoNombre,DDLTipoConcepto,__VIEWSTATE, __CURRENTREFRESHTICKET,__EVENTTARGET,__EVENTARGUMENT});
            STATUS = httpclient.executeMethod(httpget);

            __EVENTTARGET.setValue("BtnGuardar:_ctl0");
            __EVENTARGUMENT.setValue("");
            __CURRENTREFRESHTICKET.setValue("6");
            __VIEWSTATE.setValue(getViewState(httpget.getResponseBodyAsString()));

            switch(Integer.parseInt(tipoDescuento)) {
                case 1:
                    httpget.setQueryString(new NameValuePair[]{TxtIdBenef, TxtApellidoNombre,DDLTipoConcepto,DDLConceptoOPP,TxtImpTotal, TxtComprobante,__VIEWSTATE, __CURRENTREFRESHTICKET,__EVENTTARGET,__EVENTARGUMENT});
                    break;
                case 3:
                    TxtCantCuotas.setValue(cuotas);
                    httpget.setQueryString(new NameValuePair[]{TxtIdBenef, TxtApellidoNombre,DDLTipoConcepto,DDLConceptoOPP,TxtImpTotal,TxtCantCuotas, TxtComprobante,__VIEWSTATE, __CURRENTREFRESHTICKET,__EVENTTARGET,__EVENTARGUMENT});
                    break;
                default:
                    break;
            }
            STATUS = httpclient.executeMethod(httpget);

            if(STATUS != 200) {
                if(STATUS == 401) {
                    RESULTADO = "91"+"USUARIO Y PASSWORD INCORRECTOS (CODIGO CONEXION "+STATUS+")";
                    generarTxt(rutaTxt, RESULTADO);
                    return;
                }
                RESULTADO = "90"+"NO SE PUDO ESTABLECER LA CONEXION (CODIGO CONEXION "+STATUS+")";
                generarTxt(rutaTxt, RESULTADO);
                return;
            }
            
            switch(validarMensaje(httpget.getResponseBodyAsString())) {
                case 9: 
                    RESULTADO = "09"+"Afectacion disponible insuficiente";
                    generarTxt(rutaTxt, RESULTADO);
                    return;
                case 8:  
                    RESULTADO = "08"+"Solo se puede ingresar una novedad para el concepto ingresado";
                    generarTxt(rutaTxt, RESULTADO);
                    return;
                case 7:  
                    RESULTADO = "07"+"Maxima cantidad de intentos permitidos";
                    generarTxt(rutaTxt, RESULTADO);
                    return;
                default:
                    break;
            }

            TRANSACCION = getValorFormulario(httpget.getResponseBodyAsString(),"TxtTransaccion");
            FIRMA = getValorFormulario(httpget.getResponseBodyAsString(),"TxtMAC");

            String certificado = "";
            try {
                httpget= new GetMethod("https://200.26.56.113/datsite/comprobante.aspx?IDNov="+TRANSACCION);
                STATUS = httpclient.executeMethod(httpget);
                certificado = httpget.getResponseBodyAsString();
            } catch(Exception ex1) {
                COD_RTA = "99";
                ERROR = ex1.toString();
            }

            FECHA = getCampoValor(certificado,"LblFecha");
            HORA = getCampoValor(certificado,"LblHora");
            PRIMERMENSUAL = getCampoValor(certificado,"lblPrimerMensual");

            httpget.releaseConnection();

        } catch(Exception ex) {
            COD_RTA = "99";
            if(ERROR != null) {
                ERROR = ERROR+" "+ex.getMessage();
            } else {
                ERROR = ex.getMessage();
            }
        }

        if(ERROR != null) {
            COD_RTA = "99";
            if(ERROR.length() > 100) {
                ERROR = ERROR.substring(0,100);
            } else {
                if(ERROR.length() < 100) {
                    ERROR = ERROR+MASCARA.substring(0,100-ERROR.length());
                }
            }
        } else {
            ERROR = MASCARA.substring(0,100);
        }

        if(FIRMA.length() < 60) {
            FIRMA = FIRMA+MASCARA.substring(0,60-FIRMA.length());
        }

        if(TRANSACCION.length() < 20) {
            TRANSACCION = MASCARA.substring(0,20-TRANSACCION.length())+TRANSACCION;
        }

        if(FECHA != null && COD_RTA.equals("00")) {
            if(FECHA.trim().length() == 10) {
                FECHA_FORMATO = FECHA.trim().substring(6)+FECHA.trim().substring(3,5)+FECHA.trim().substring(0,2);
                if(HORA != null) {
                    if(HORA.trim().length() == 8) {
                        FECHA_FORMATO = FECHA_FORMATO+" "+HORA;
                    } else {
                        FECHA_FORMATO = FECHA_FORMATO+" "+HORA;
                        COD_RTA = "12";
                        ERROR = ERROR+" MAL FORMATO HORA";
                    }
                } else {
                    FECHA_FORMATO = FECHA_FORMATO+" "+HORA;
                    COD_RTA = "13";
                    ERROR = ERROR+" NO SE ENCUENTRA LA HORA";
                }
            } else {
                FECHA_FORMATO = FECHA_FORMATO+" "+HORA;
                COD_RTA = "10";
                ERROR = ERROR+" MAL FORMATO FECHA";
            }
        } else {
            FECHA_FORMATO = FECHA_FORMATO+" "+HORA;
            COD_RTA = "11";
            ERROR = ERROR+" NO SE ENCUENTRA LA FECHA";
        }

        if(FECHA_FORMATO.length() > 17) {
            FECHA_FORMATO = FECHA_FORMATO.substring(0,18);
        } else {
            if(FECHA_FORMATO.length() < 17) {
                FECHA_FORMATO = FECHA_FORMATO+MASCARA.substring(0,17-FECHA_FORMATO.length());
            }
        }

        if(PRIMERMENSUAL != null && COD_RTA.equals("00")) {
            if(PRIMERMENSUAL.trim().length() == 7) {
                PRIMERMENSUAL = PRIMERMENSUAL.substring(3)+PRIMERMENSUAL.substring(0,2);
            } else {
                COD_RTA = "15";
                ERROR = ERROR+" PRIMER MENSUAL ERRONEO";
            }
        } else {
            PRIMERMENSUAL = MASCARA.substring(0,8);
            COD_RTA = "15";
            ERROR = ERROR+" PRIMER MENSUAL ERRONEO";
        }
        
        if(ERROR != null) {
            if(ERROR.length()>100) {
                ERROR = ERROR.substring(0,100);
            } else {
                if(ERROR.length()<100) {
                    ERROR = ERROR+MASCARA.substring(0,100-ERROR.length());
                }
            }
        } else {
            ERROR = MASCARA.substring(0,100);
        }
        
        RESULTADO = COD_RTA+ERROR+FIRMA+TRANSACCION+FECHA_FORMATO+PRIMERMENSUAL;
        generarTxt(rutaTxt, RESULTADO);

    }

    public static void generarTxt(String rutaTxt, String Mensaje) {
        try {
            FileWriter fw = new FileWriter(rutaTxt.replaceAll("_",":"), false); 
            fw.write(Mensaje);
            fw.close();
            FileWriter fw2 = new FileWriter(rutaTxt.replaceAll("_",":").replaceAll(".txt","FLAG.txt"), false);
            fw2.write("ARCHIVO GENERADO");
            fw2.close();
        } catch(Exception ioe) {
            System.out.println("EXCEPTION COMETIDA AL GENERAR ARCHIVOS: " + ioe.toString());
        }
        System.gc();
    }

    public static String getViewState(String flujo) {
        String VIEWSTATE = "";
        if(flujo != null) {
            Source source = new Source(flujo);
            FormFields formFields = source.findFormFields();

            for (Iterator i = formFields.iterator(); i.hasNext();) {
                FormField formField = (FormField)i.next();
                String nombre = formField.getName();
                if(nombre != null && nombre.toLowerCase().equals("__viewstate")) {
                    if(!formField.getValues().isEmpty()) {
                        VIEWSTATE = formField.getValues().iterator().next().toString();
                        break;
                    }
                }
            }
        }
        return VIEWSTATE;
    }
    
    public static String[] getErrores(String flujo) {
        String [] Resultado = null;
        Source source = new Source(flujo);
        Element TABLA = source.getElementById("sValidacion");
        if(TABLA != null) {
            Segment segmento = TABLA.getContent();
            if(segmento != null) {
                List lista = segmento.findAllStartTags("LI");
                if(!lista.isEmpty()) {
                    Resultado = new String[lista.size()];
                    for(int i = 0; i<lista.size();i++) {
                        Resultado[i] = "  *   "+((StartTag)lista.get(i)).getElement().getTextExtractor().toString();
                    }
                }
            }
        }
        return Resultado;
    }
    
    public static String getCampoValor(String flujo, String campo) {
        String valor = "";
        if(flujo != null) {
            Source source = new Source(flujo);
            Element ELEMENTO = source.getElementById(campo);
            if(ELEMENTO != null) {
                valor = ELEMENTO.getTextExtractor().toString();
            }
        }
        return valor;
    }
    
    public static String getValorFormulario(String flujo, String Campo) {
        String resultado = "";
        if(flujo != null) {
            Source source = new Source(flujo);
            FormFields formFields = source.findFormFields();
            
            for (Iterator i = formFields.iterator(); i.hasNext();) {
                FormField formField = (FormField)i.next();
                String nombre = formField.getName();
                if(nombre != null && nombre.toLowerCase().equals(Campo.toLowerCase())) {
                    if(!formField.getValues().isEmpty()) {
                        resultado = formField.getValues().iterator().next().toString();
                        break;
                    }
                }
            }
        }
        
        return resultado;
    }
    
    public static int validarMensaje(String cuerpo) {
        int res = -1;
        if(cuerpo.indexOf("Disponible Insuficiente") != -1) {
            res = 9;
        }
        if(cuerpo.indexOf("Solo se puede ingresar una novedad para el concepto ingresado") != -1) {
            res = 8;
        }
        if(cuerpo.indexOf("ima cantidad de intentos permitidos") != -1) {
            res = 7;
        }
        return res;
    }
    
}
