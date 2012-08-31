package org.af.core.ui.client.component;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.WindowCloseListener;

import java.util.HashMap;

import org.af.core.ui.client.AsyncCallbackJSON;
import org.af.core.ui.client.CallbackJSONEvent;
import org.af.core.ui.client.CallbackTarget;
import org.af.core.ui.client.ServiceHandler;
import org.af.core.ui.client.ServiceCommand;


public abstract class AbstractComponent implements CallbackTarget {
    
    protected HashMap commandServicesMap = new HashMap();
    private JSONObject contextoSession = null;
    private JSONObject controlesPermisosRole = null;
    private ServiceHandler serviceHandler = new ServiceHandler();    
	protected HashMap commandMap = new HashMap();
    private HashMap controlesPermisos= new HashMap();
    
    public AbstractComponent() {
        registerServices();
    }

	public void addWindowListener() {
		Window.addWindowCloseListener(new WindowCloseListener() {
			public void onWindowClosed() {

			}
			
			public String onWindowClosing() {
				destroy();
				return  null;
			}

		});

	}

    public void executeService(String serviceId) {
		executeService(serviceId, new JSONObject());
	}

    public void executeServiceJson(String serviceId) {
		executeService(serviceId, new JSONObject(), true);
	}

    public void executeServiceJson(String serviceId, JSONObject valueObject) {
		executeService(serviceId, valueObject, true);
	}

    public void executeService(String serviceId, JSONObject valueObject) {
		executeService(serviceId, valueObject, false);
	}

    public void executeService(String serviceId, JSONObject valueObject, boolean jsonService) {
		if(!commandMap.containsKey(serviceId)) {
			Window.alert("El servicio no esta registrado.");
		}
		AsyncCallbackJSON callBack = new AsyncCallbackJSON(this);
		if(jsonService) {
			serviceHandler.executeServiceAsync(serviceId, callBack, valueObject, true);           
		} else {
			serviceHandler.executeServiceAsync(serviceId, callBack, valueObject);           
		}
    }

    private void registerServices() {

    }

    public void checkObjectsRefresh(CallbackJSONEvent event) {
		if(!commandMap.containsKey(event.getServiceId()) || commandMap.get(event.getServiceId()) == null) {
			showWarning(event.getServiceId()+" carece de command para ejecutar..."); 
			return;
		}
		ServiceCommand command = (ServiceCommand) commandMap.get(event.getServiceId()); 
        if (event.getResultJSONObject().get("ERROR") != null) {
        	showError(((JSONString)event.getResultJSONObject().get("ERROR")).stringValue());
            command.onError(event.getResultJSONObject());
			return;
		}

        if (event.getResultJSONObject().get("EXCEPTION") != null) {
        	showError(((JSONString)event.getResultJSONObject().get("EXCEPTION")).stringValue());
            command.onException(event.getResultJSONObject());
			return;
		}

        if (event.getResultJSONObject().get("WARNING") != null) {
            command.onWarning(event.getResultJSONObject());
		}

		command.execute(event.getResultJSONObject());
	}

	public void registerCommandService(String serviceId, ServiceCommand command) {
		commandMap.put(serviceId, command);
	}

	public boolean assertNull(JSONValue value) {
		if (value != null && value.isNull() == null) {
			return false;
		}
		return true;
	}

	public boolean assertArray(JSONValue value) {
		if (value != null && value.isArray() != null) {
			return true;
		}
		return false;
	}

	public void destroy() {
		//ToDo: implementar en cada una de las instancias... -lg
	}

	public static void showProcesando() {
		showStatus();
	}

	public static void hideProcesando() {
		hideStatus();
	}
	
	public static native void showStatus()/*-{
	$doc.getElementById('loading').style.display= 'block';
	}-*/;


	public static native void hideStatus()/*-{
	$doc.getElementById('loading').style.display= 'none';
	}-*/;

	public static native void destroyElement(com.google.gwt.user.client.Element element)/*-{
	var garbageBin = document.getElementById('IELeakGarbageBin');
	if (!garbageBin) {
		garbageBin = document.createElement('DIV');
		garbageBin.id = 'IELeakGarbageBin';
		garbageBin.style.display = 'none';
		document.body.appendChild(garbageBin);
	}
	// move the element to the garbage bin
	garbageBin.appendChild(element);
	garbageBin.innerHTML = '';
	}-*/;

    public native String getContextoSessionString()/*-{
    return $wnd.contextoSession;
    }-*/;
    
     public native String getControlesPremisosRoleString()/*-{
     return $wnd.controlesPermisosRole;
     }-*/;
    
    public JSONObject getContextoSession() {
        if(contextoSession == null) {
            try {
                String contextoSessionString = getContextoSessionString();
                contextoSession = (JSONObject)((JSONObject) JSONParser.parse(contextoSessionString)).get("context");
                if(!assertNull(contextoSession.get("ERROR"))) {
                    showError(contextoSession.get("ERROR").isString().stringValue());
                }
            } catch(Exception ex) {
                contextoSession = new JSONObject();
            }
        }
        return this.contextoSession;
    }

    public void putCommand(String commandId, ServiceCommand command) {
        commandServicesMap.put(commandId, command);
    } 

    public ServiceCommand getCommand(String commandId) {
        if(commandServicesMap.containsKey(commandId)) {
            return (ServiceCommand) commandServicesMap.get(commandId);
        }
        return null;
    }

    public void executeCommand(String commandId, JSONObject jsonObject) {
        ServiceCommand command = getCommand(commandId);
        if(command == null) {
        	showError("El comando '"+commandId+"' no se encuentra registrado.");
        } 
        command.execute(jsonObject);  
    }


    public void showError(String errorMessage) {
        com.google.gwt.user.client.Window.alert(errorMessage);
    }

    public void showWarning(String warningMessage) {
        com.google.gwt.user.client.Window.alert(warningMessage);
    }


}
