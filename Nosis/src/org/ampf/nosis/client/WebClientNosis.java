package org.ampf.nosis.client;

import org.w3c.dom.*;
import java.net.URL;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import com.gargoylesoftware.htmlunit.DefaultCredentialsProvider;
import com.gargoylesoftware.htmlunit.ProxyConfig;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;  
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.*;  
import com.gargoylesoftware.htmlunit.html.HtmlAnchor;
import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.xml.XmlPage;

import org.ampf.nosis.domain.SessionUser;
import org.ampf.nosis.agents.INosisClient;

import se.scalablesolutions.akka.actor.TypedActor;
import se.scalablesolutions.akka.camel.CamelContextManager;
import se.scalablesolutions.akka.actor.TypedActor;

import org.apache.commons.httpclient.NameValuePair;
import org.apache.camel.ProducerTemplate;
import org.apache.xpath.XPathAPI;

public class WebClientNosis extends TypedActor implements INosisClient {

    String [] clavesVI = {"RZ", "Sexo", "FecNac", "Edad", "Fallecido", "Doc", "Doc_Tipo"};
    String [] clavesCI = {"Ent_Cod", "Sit", "Periodo", "Monto", "Proc_Jud"};
    String [] clavesDom = {"Dom", "Loc", "CP", "Prov"};
    String [] clavesDomAlt = {"Dom"};
    String [] clavesTel = {"Tel"};
    String urlPedidoInforme = "/SAC_ServicioSF/Consulta_test.asp";
    String rutaVerificacionIdentidad = "/Respuesta/ParteXML/Dato[1]";
    String rutaInformacionCrediticia = "/Respuesta/ParteXML/Dato[2]";
    String rutaEstado = "/Respuesta/Consulta/Resultado";

    SessionUser sessionUser;
    String httpHost;
    String proxy;
    int proxyPort;
    String proxyUser;
    String proxyPassword;
    String nosisUser;
    String nosisPassword;

    public void setHttpHost(String httpHost) {
        this.httpHost = httpHost;
    }

    public String getHttpHost() {
        return this.httpHost;
    }

    public void setUrlPedidoInforme(String urlPedidoInforme) {
        this.urlPedidoInforme = urlPedidoInforme;
    }

    public String getUrlPedidoInforme() {
        return this.urlPedidoInforme;
    }

    public void setProxy(String proxy) {
        this.proxy = proxy;
    }

    public String getProxy() {
        return this.proxy;
    }

    public void setProxyPort(int proxyPort) {
        this.proxyPort = proxyPort;
    }

    public int getProxyPort() {
        return this.proxyPort;
    }

    public void setProxyUser(String proxyUser) {
        this.proxyUser = proxyUser;
    }

    public String getProxyUser() {
        return this.proxyUser;
    }

    public void setProxyPassword(String proxyPassword) {
        this.proxyPassword = proxyPassword;
    }

    public String getProxyPassword() {
        return this.proxyPassword;
    }

    public void setNosisUser(String nosisUser) {
        this.nosisUser = nosisUser;
    }

    public String getNosisUser() {
        return this.nosisUser;
    }

    public void setNosisPassword(String nosisPassword) {
        this.nosisPassword = nosisPassword;
    }

    public String getNosisPassword() {
        return this.nosisPassword;
    }

    public void init(SessionUser sessionUserLog) {
        sessionUser = sessionUserLog;
    }

    public void process(Map values) {
        if(!values.containsKey("p_cuil")) {
            return;
        }
        String cuil = (String) values.get("p_cuil");
        System.out.println(cuil);

        Map informacionNosis = new HashMap();
        informacionNosis.put("key", cuil);
        try {
            WebClient webClient = instantiateWebClient();

            List parameters = new ArrayList();
            settingParameters(parameters);
            parameters.add(new NameValuePair("ConsXML_Doc", cuil));

            WebRequestSettings requestSettings = new WebRequestSettings(new URL("http://"+getHttpHost()+getUrlPedidoInforme()));
            requestSettings.setRequestParameters(parameters);
            Document documentAcceso = ((XmlPage) webClient.getPage(requestSettings)).getXmlDocument();

            String informeUrl = "";
            try {
                NodeList nodelist = org.apache.xpath.XPathAPI.selectNodeList(documentAcceso, "/Pedido/URL[1]"); 
                for (int i=0; i < nodelist.getLength(); i++) {
                    Element elem = (Element)nodelist.item(i); 
                    informeUrl = elem.getTextContent();
                } 
            } catch (javax.xml.transform.TransformerException e) { 
                e.printStackTrace();
            }

            WebRequestSettings requestSettingsInforme = new WebRequestSettings(new URL(informeUrl));
            XmlPage informeXML = (XmlPage) webClient.getPage(requestSettingsInforme);

            Document document = informeXML.getXmlDocument();            
            //Verificamos estado de consulta. -lg
            try {
                Node estadoNode = XPathAPI.selectSingleNode(document, rutaEstado);

                String estado = getValue(estadoNode, "EstadoOk");
                System.out.println("AITO: DEBUG: Estado: "+estado);
                if(estado != null && estado.trim().equals("No")) {
                    informacionNosis.put("ERROR", getValue(estadoNode, "Novedad"));
                }

            } catch(Exception ex) {
                ex.printStackTrace();
            }

            try {
                Node VI = XPathAPI.selectSingleNode(document, rutaVerificacionIdentidad);

                for(int i = 0; i < clavesVI.length; i++) {
                    informacionNosis.put(clavesVI[i], getValue(VI, clavesVI[i]));
                } 
            } catch(Exception ex) {
                ex.printStackTrace();
            }

            Node Dom;
            Vector domicilios = new Vector();
            try {
                Dom = XPathAPI.selectSingleNode(document, rutaVerificacionIdentidad+"DomFiscal");
                for(int i = 0; i < clavesVI.length; i++) {
                    HashMap domMap = new HashMap();
                    domMap.put(clavesDom[i], getValue(Dom, clavesDom[i]));
                    domicilios.add(domMap);
                } 
            } catch(Exception ex) {
                ex.printStackTrace();
            }
            try {
                Dom = XPathAPI.selectSingleNode(document, rutaVerificacionIdentidad+"DomAlternativos/Doms[1]");
                for(int i = 0; i < clavesVI.length; i++) {
                    HashMap domMap = new HashMap();
                    domMap.put(clavesDom[i], getValue(Dom, clavesDomAlt[i]));
                    domicilios.add(domMap);
                } 
            } catch(Exception ex) {
                ex.printStackTrace();
            }
            if(domicilios.isEmpty()) {
                informacionNosis.put("domicilios", domicilios);
            }
            Vector telefonos = new Vector();
            try {
                Dom = XPathAPI.selectSingleNode(document, rutaVerificacionIdentidad+"DomAlternativos/Tels[1]");
                for(int i = 0; i < clavesVI.length; i++) {
                    HashMap telMap = new HashMap();
                    telMap.put(clavesDom[i], getValue(Dom, clavesDomAlt[i]));
                    telefonos.add(telMap);
                } 
            } catch(Exception ex) {
                ex.printStackTrace();
            }
            if(telefonos.isEmpty()) {
                informacionNosis.put("telefonos", telefonos);
            }
            try {
                Dom = XPathAPI.selectSingleNode(document, rutaVerificacionIdentidad+"SSSalud/ObraSoc");
                informacionNosis.put("ObraSocial", getValue(Dom, "Descrip"));
            } catch(Exception ex) {
                ex.printStackTrace();
            }

            try {
                NodeList nodelist = XPathAPI.selectNodeList(document, rutaInformacionCrediticia+"/UltimoInforme/Deudas/*"); 
                Vector deudas = new Vector();
                for (int i=0; i < nodelist.getLength(); i++) {
                    HashMap deuda = new HashMap();
                    Element elem = (Element)nodelist.item(i); 
                    for(int k=0; k < clavesCI.length; k++) {
                        deuda.put(clavesCI[k], elem.getAttribute(clavesCI[k]));
                    }
                    deudas.add(deuda);
                } 
                informacionNosis.put("deudas", deudas);
            } catch(Exception ex) {
                ex.printStackTrace();
            }

        } catch(Exception ex) {
            ex.printStackTrace();
        }

        System.out.println("Informacion Nosis: "+informacionNosis);
        ProducerTemplate template = CamelContextManager.template();
        template.sendBody("activemq:topic:ampfTest.nosis.respuesta", informacionNosis);
    }

    public String getValue(Node nodo, String xpath) throws Exception {
        if(nodo == null) {
            return null;
        }
        Node selectedNode = XPathAPI.selectSingleNode(nodo, xpath+"/text()");
        if(selectedNode != null) {
            return selectedNode.getNodeValue();     
        }
        return null;
    }

    public WebClient instantiateWebClient() throws Exception {
        WebClient webClient = new WebClient(BrowserVersion.INTERNET_EXPLORER_6);
        webClient.setJavaScriptEnabled(true);
        webClient.setProxyConfig(new ProxyConfig(getProxy(), getProxyPort()));
        DefaultCredentialsProvider credentialsProvider = (DefaultCredentialsProvider) webClient.getCredentialsProvider();
        credentialsProvider.addProxyCredentials(getProxyUser(), getProxyPassword(), getProxy(), getProxyPort());
        webClient.setCredentialsProvider(credentialsProvider);
        webClient.setActiveXNative(true);
        webClient.setCssEnabled(true); 
        webClient.setRedirectEnabled(true);
        webClient.setUseInsecureSSL(true);
        return webClient;
    }

    public void settingParameters(List parameters) {
        parameters.add(new NameValuePair("Usuario", getNosisUser()));
        parameters.add(new NameValuePair("Password", getNosisPassword()));
        parameters.add(new NameValuePair("NroConsulta", "2254"));
        parameters.add(new NameValuePair("Cons_CDA", "2"));
        parameters.add(new NameValuePair("Cons_SoloPorDoc", "Si"));
        parameters.add(new NameValuePair("ConsXML_Filtro", "VI"));
        parameters.add(new NameValuePair("ConsXML_Filtro", "CI"));
    }

}
