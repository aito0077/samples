package org.af.core.ui.client.service;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.AsyncCallback;

public interface MessageServiceAsync extends RemoteService {

    public void execute(String value, AsyncCallback callback);

}
