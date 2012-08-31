package org.af.core.ui.client;

import org.af.core.ui.client.CallbackJSONEvent;


public interface CallbackTarget {

	//public void showProcesando();
	//public void hideProcesando();
	public void checkObjectsRefresh(CallbackJSONEvent event);

}
