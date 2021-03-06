package org.af.core.ui.client;

import org.af.core.ui.client.CallbackJSONEvent;
import com.google.gwt.user.client.Window;
import com.google.gwt.json.client.JSONException;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.rpc.ServiceDefTarget;
import com.google.gwt.user.client.HTTPRequest;

import org.af.core.ui.client.AsyncCallbackJSON;
import org.af.core.ui.client.service.MessageService;
import org.af.core.ui.client.service.MessageServiceAsync;

import com.google.gwt.http.client.URL;

public class ServiceHandler {
		
	public void executeServiceAsync(String serviceName, AsyncCallbackJSON  callback) {
		executeServiceAsync(serviceName, callback, new JSONObject());
	}

	public void executeServiceAsync(String serviceName, AsyncCallbackJSON callback, JSONObject value) {
        if(serviceName != null && serviceName.equals("traerParametrosSession") && getContextoSessionString() != null) {
            getContextoSession(serviceName, callback);
            return;
        }
		showStatus();
		//callback.getSource().showProcesando();
		MessageServiceAsync messageService = getMessageServiceAsync(serviceName);
		callback.setServiceId(serviceName);
		messageService.execute(value.toString(), callback);
	}

    private MessageServiceAsync getMessageServiceAsync(String messageServiceId) {
        MessageServiceAsync messageService = (MessageServiceAsync) GWT.create(MessageService.class);

        ServiceDefTarget endpoint = (ServiceDefTarget) messageService;
        String moduleRelativeURL = getRPCUrl(messageServiceId);
        endpoint.setServiceEntryPoint(moduleRelativeURL);

        return messageService;
    }

    private static String getRPCUrl(String service) {
        String url;
        if (!GWT.isScript()) {
            url =  service + ".rpc";
        } else {
            url = service + ".rpc";
        }
        return url;
    }

	public void executeServiceAsync(String serviceName, AsyncCallbackJSON callback, JSONObject value, boolean zipped) {
		//callback.getSource().showProcesando();
		showStatus();
		callback.setServiceId(serviceName);
	    try {
            //RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, getJSONServiceUrl(serviceName, value.toString()));
            RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, getJSONServiceUrl(serviceName, value.toString()));
            builder.setHeader("Content-Type", "application/x-www-form-urlencoded");

            Request request = builder.sendRequest(null, callback);
            
	    } catch (RequestException e) {
	        hideStatus();
            com.google.gwt.user.client.Window.alert("Problema de conexi\u00F3n con el servidor. ["+e.toString()+"]");
	    }
	    //HTTPRequest.asyncGet(getJSONServiceUrl(serviceName, value.toString()), callback);
	}

    private static String getJSONServiceUrl(String service, String jsonString) {
        String url;
        if (!GWT.isScript()) {
            url =  service + ".json?jsonValue="+URL.encodeComponent(jsonString);
        } else {
            url = service + ".json?jsonValue="+URL.encodeComponent(jsonString);
        }
        return url;
    }

	public native String showStatus()/*-{
        if($doc.getElementById('loading')) {
            $doc.getElementById('loading').style.display= 'block';
        }
	}-*/;

    public void getContextoSession(String serviceName, AsyncCallbackJSON callback) {
        String contextoSessionString = null;
        try {
            contextoSessionString = getContextoSessionString();
            callback.setServiceId(serviceName);
            callback.setResultCallback((JSONObject) JSONParser.parse(contextoSessionString));
            CallbackJSONEvent callbackJSONEvent = new CallbackJSONEvent(callback.getServiceId(), callback.getResultCallback());
            callback.getSource().checkObjectsRefresh(callbackJSONEvent);
        } catch (Exception e) {
            return;
        }
    }

    public native String getContextoSessionString()/*-{
    return $wnd.contextoSession;
    }-*/;
    
     public native String hideStatus()/*-{
         if($doc.getElementById('loading')){
             $doc.getElementById('loading').style.display= 'none';
         }
     }-*/;
}
