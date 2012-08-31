package org.af.core.ui.client.util;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.rpc.ServiceDefTarget;
import com.google.gwt.user.client.HTTPRequest;

import org.af.core.ui.client.AsyncCallbackJSON;
import org.af.core.ui.client.service.MessageService;
import org.af.core.ui.client.service.MessageServiceAsync;

import com.google.gwt.http.client.URL;

public class GwtUtil {
		
	public static void showPrcesando() {
		showStatus();
	}

	public static void hideProcesando() {
		hideStatus();
	}
	
	public static native String showStatus()/*-{
        if($doc.getElementById('loading')) {
            $doc.getElementById('loading').style.display= 'block';
        }
	}-*/;


	public static native String hideStatus()/*-{
        if($doc.getElementById('loading')){
            $doc.getElementById('loading').style.display= 'none';
        }
	}-*/;
}
