package org.af.core.ui.client;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

import org.af.core.ui.client.ServiceCommandInterface;


public abstract class ServiceCommand implements ServiceCommandInterface {

	public abstract void execute(JSONObject jsonObject);

	public void onError(JSONObject jsonObject) {

    }

	public void onWarning(JSONObject jsonObject) {
        com.google.gwt.user.client.Window.alert(((JSONString)jsonObject.get("WARNING")).stringValue());
    }

	public void onException(JSONObject jsonObject) {

    }

}
