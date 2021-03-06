package org.af.core.ui.client;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.Window;

public class CallbackJSONEvent {

	private JSONObject resultJSONObject;
	private String serviceId;

	public CallbackJSONEvent(String serviceId, JSONObject resultJSONObject) {
		this.serviceId = serviceId;
		this.resultJSONObject = resultJSONObject;
	}

	public void setResultJSONObject(JSONObject resultJSONObject) {
		this.resultJSONObject = resultJSONObject;
        Window.alert(" 0 "+this.resultJSONObject.toString());
	}

	public JSONObject getResultJSONObject() {
		if(this.resultJSONObject != null && this.resultJSONObject.containsKey("context")) {
			JSONObject result = (JSONObject) this.resultJSONObject.get("context");
			if(this.resultJSONObject.get("ERROR") != null) {
                result.put("ERROR", this.resultJSONObject.get("ERROR"));
            }
			if(this.resultJSONObject.get("EXCEPTION") != null) {
                result.put("EXCEPTION", this.resultJSONObject.get("EXCEPTION"));
            }
			if(this.resultJSONObject.get("WARNING") != null) {
                result.put("WARNING", this.resultJSONObject.get("WARNING"));
            }
            
            this.resultJSONObject = result;
		}
		return this.resultJSONObject;
	}

	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}

	public String getServiceId() {
		return this.serviceId;
	}
}
