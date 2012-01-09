package org.ampf.nosis.agents;

import org.ampf.nosis.domain.SessionUser;

import org.apache.camel.Body;
import org.apache.camel.language.XPath;
import org.apache.camel.Header;
import se.scalablesolutions.akka.camel.consume;
import java.util.Map;


public interface INosisClient {
    public void init(SessionUser sessionUserLog);

    @consume("activemq:topic:ampfTest.nosis.peticion")
    public void process(@Body Map values);

    public void setHttpHost(String httpHost);
    public String getHttpHost();
    public void setUrlPedidoInforme(String urlPedidoInforme);
    public String getUrlPedidoInforme();
    public void setProxy(String proxy);
    public String getProxy();
    public void setProxyPort(int proxyPort);
    public int getProxyPort();
    public void setProxyUser(String proxyUser);
    public String getProxyUser();
    public void setProxyPassword(String proxyPassword);
    public String getProxyPassword();
    public void setNosisUser(String nosisUser);
    public String getNosisUser();
    public void setNosisPassword(String nosisPassword);
    public String getNosisPassword();
}
