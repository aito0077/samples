package org.af.core.ui.client;

import com.google.gwt.http.client.Request;
import com.google.gwt.json.client.JSONException;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.user.client.ResponseTextHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;

import org.af.core.ui.client.CallbackJSONEvent;
import org.af.core.ui.client.CallbackTarget;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;

public class AsyncCallbackJSON implements RequestCallback, ResponseTextHandler, AsyncCallback {

	private JSONObject resultCallback;
	private CallbackTarget source;
	private String serviceId;

	public AsyncCallbackJSON(CallbackTarget source) {
		this.source = source;
	}

	public void setResultCallback(JSONObject resultCallback) {
		this.resultCallback = resultCallback;
	}

	public JSONObject getResultCallback() {
		return this.resultCallback;
	}

	public void setSource(CallbackTarget source) {
		this.source = source;
	}

	public CallbackTarget getSource() {
		return this.source;
	}

	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}

	public String getServiceId() {
		return this.serviceId;
	}

	public void onCompletion(String responseText) {
		try {
			this.resultCallback = (JSONObject) JSONParser.parse(responseText);
			try {
				CallbackJSONEvent callbackJSONEvent = new CallbackJSONEvent(this.serviceId, this.resultCallback);
				this.source.checkObjectsRefresh(callbackJSONEvent);
			} catch (JSONException e) {
				Window.alert("Fallo: "+e.getMessage());
			}
		} catch (JSONException e) {
			Window.alert("Fallo: "+e.getMessage());
		} finally {
			hideStatus();
		}
		//this.source.hideProcesando();
	}

	public void onSuccess(Object result) {
		try {
		String message = (String) result;
        this.resultCallback = (JSONObject) JSONParser.parse(message);
		CallbackJSONEvent callbackJSONEvent = new CallbackJSONEvent(this.serviceId, this.resultCallback);
		this.source.checkObjectsRefresh(callbackJSONEvent);
		} catch (JSONException e) {
			Window.alert("Fallo: "+e.getMessage());
		} finally {
			hideStatus();
		}
		//this.source.hideProcesando();
	}

	public void onFailure(Throwable caught) {
		Window.alert("Fallo: "+caught.getMessage());
		hideStatus();
		//this.source.hideProcesando();
	}


	public native String hideStatus()/*-{
        if($doc.getElementById('loading')){
            $doc.getElementById('loading').style.display= 'none';
        }
	}-*/;
    
    public void onError(Request request, java.lang.Throwable exception) {
        onFailure(exception);   
     }
     
	public void onResponseReceived(Request request, Response response) {
         onSuccess(response.getText());   
     }
}
