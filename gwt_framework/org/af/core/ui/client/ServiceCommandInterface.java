package org.af.core.ui.client;

import com.google.gwt.json.client.JSONObject;

public interface ServiceCommandInterface {

	public void execute(JSONObject jsonObject);

	public void onError(JSONObject jsonObject);

	public void onWarning(JSONObject jsonObject);

	public void onException(JSONObject jsonObject);

}
