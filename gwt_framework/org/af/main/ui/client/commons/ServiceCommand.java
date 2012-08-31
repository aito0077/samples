package org.af.main.ui.client.commons;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

import com.gwtext.client.widgets.MessageBox;

import org.af.core.ui.client.ServiceCommandInterface;

public abstract class ServiceCommand extends org.af.core.ui.client.ServiceCommand implements ServiceCommandInterface {

	public void onWarning(JSONObject jsonObject) {
        MessageBox.alert("ATENCION", ((JSONString)jsonObject.get("WARNING")).stringValue());
    }

}
