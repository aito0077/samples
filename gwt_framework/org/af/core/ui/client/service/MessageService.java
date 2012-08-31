package org.af.core.ui.client.service;

import com.google.gwt.user.client.rpc.RemoteService;

public interface MessageService extends RemoteService {

	public String execute(String value);

}
