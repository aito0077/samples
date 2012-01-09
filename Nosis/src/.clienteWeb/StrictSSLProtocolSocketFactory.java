package clienteWeb;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.net.ssl.SSLPeerUnverifiedException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.security.cert.X509Certificate;

import org.apache.commons.httpclient.ConnectTimeoutException;
import org.apache.commons.httpclient.params.HttpConnectionParams;
import org.apache.commons.httpclient.protocol.ControllerThreadSocketFactory;
import org.apache.commons.httpclient.protocol.ReflectionSocketFactory;
import org.apache.commons.httpclient.protocol.SecureProtocolSocketFactory;


public class StrictSSLProtocolSocketFactory implements SecureProtocolSocketFactory {
    
    private boolean verifyHostname = true;

    public StrictSSLProtocolSocketFactory(boolean verifyHostname) {
        super();
        this.verifyHostname = verifyHostname;
    }

    public StrictSSLProtocolSocketFactory() {
        super();
    }

    public void setHostnameVerification(boolean verifyHostname) {
        this.verifyHostname = verifyHostname;
    }

    public boolean getHostnameVerification() {
        return verifyHostname;
    }

    
    public Socket createSocket(String host, int port, InetAddress clientHost, int clientPort) throws IOException, UnknownHostException {
        SSLSocketFactory sf = (SSLSocketFactory) SSLSocketFactory.getDefault();
        SSLSocket sslSocket = (SSLSocket) sf.createSocket(host, port, clientHost, clientPort);
        verifyHostname(sslSocket);

        return sslSocket;
    }

    public Socket createSocket( final String host, final int port, final InetAddress localAddress, final int localPort, final HttpConnectionParams params) throws IOException, UnknownHostException, ConnectTimeoutException {
        if (params == null) {
            throw new IllegalArgumentException("Parameters may not be null");
        }
        int timeout = params.getConnectionTimeout();
        if (timeout == 0) {
            return createSocket(host, port, localAddress, localPort);
        } else {
            
            SSLSocket sslSocket = (SSLSocket) ReflectionSocketFactory.createSocket(
                "javax.net.ssl.SSLSocketFactory", host, port, localAddress, localPort, timeout);
            if (sslSocket == null) {
                sslSocket = (SSLSocket) ControllerThreadSocketFactory.createSocket(
                    this, host, port, localAddress, localPort, timeout);
            }
            verifyHostname(sslSocket);
            return sslSocket;
        }
    }

    public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
        SSLSocketFactory sf = (SSLSocketFactory) SSLSocketFactory.getDefault();
        SSLSocket sslSocket = (SSLSocket) sf.createSocket(host, port);
        verifyHostname(sslSocket); 
        return sslSocket;
    }

    public Socket createSocket(Socket socket, String host, int port, boolean autoClose) throws IOException, UnknownHostException {
        SSLSocketFactory sf = (SSLSocketFactory) SSLSocketFactory.getDefault();
        SSLSocket sslSocket = (SSLSocket) sf.createSocket(socket, host, port, autoClose);
        verifyHostname(sslSocket); 
        return sslSocket;
    }


    private void verifyHostname(SSLSocket socket) throws SSLPeerUnverifiedException, UnknownHostException {
        if (! verifyHostname) return;

        SSLSession session = socket.getSession();
        String hostname = session.getPeerHost();
        try {
            InetAddress addr = InetAddress.getByName(hostname);
        } catch (UnknownHostException uhe) {
            throw new UnknownHostException("Could not resolve SSL sessions " + "server hostname: " + hostname);
        }
        
        X509Certificate[] certs = session.getPeerCertificateChain();
        if (certs == null || certs.length == 0) 
            throw new SSLPeerUnverifiedException("No server certificates found!");
        
        
        String dn = certs[0].getSubjectDN().getName();
        for (int i = 0; i < certs.length; i++) {
            System.out.println("X509Certificate[" + i + "]=" + certs[i]);
        }
        
        String cn = getCN(dn);
        if (hostname.equalsIgnoreCase(cn)) {
                System.out.println("Target hostname valid: " + cn);
        } else {
            throw new SSLPeerUnverifiedException(
                "HTTPS hostname invalid: expected '" + hostname + "', received '" + cn + "'");
        }
    }


    private String getCN(String dn) {
        int i = 0;
        i = dn.indexOf("CN=");
        if (i == -1) {
            return null;
        }
        
        dn = dn.substring(i + 3);  
        
        char[] dncs = dn.toCharArray();
        for (i = 0; i < dncs.length; i++) {
            if (dncs[i] == ','  && i > 0 && dncs[i - 1] != '\\') {
                break;
            }
        }
        return dn.substring(0, i);
    }
    
    public boolean equals(Object obj) {
        if ((obj != null) && obj.getClass().equals(StrictSSLProtocolSocketFactory.class)) {
            return ((StrictSSLProtocolSocketFactory) obj).getHostnameVerification() 
                == this.verifyHostname;
        } else {
            return false;
        }
    }

    public int hashCode() {
        return StrictSSLProtocolSocketFactory.class.hashCode();
    }

}
