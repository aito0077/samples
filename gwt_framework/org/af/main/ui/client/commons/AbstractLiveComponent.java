package org.af.main.ui.client.commons;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.WindowCloseListener;

import com.gwtext.client.data.FieldDef;
import com.gwtext.client.data.IntegerFieldDef;
import com.gwtext.client.data.JsonReader;
import com.gwtext.client.data.Record;
import com.gwtext.client.data.RecordDef;
import com.gwtext.client.data.Store;
import com.gwtext.client.data.StringFieldDef;
import com.gwtext.client.widgets.MessageBox;
import com.gwtext.client.widgets.Panel;

import java.util.HashMap;

import org.af.core.ui.client.AsyncCallbackJSON;
import org.af.core.ui.client.CallbackJSONEvent;
import org.af.core.ui.client.CallbackTarget;
import org.af.core.ui.client.ServiceHandler;
import org.af.main.ui.client.commons.ServiceCommand;


public abstract class AbstractLiveComponent extends Panel implements CallbackTarget {
    
    protected HashMap commandServicesMap = new HashMap();
    private JSONObject contextoSession = null;
    private ServiceHandler serviceHandler = new ServiceHandler();    
	protected HashMap commandMap = new HashMap();
  
    
    


    public AbstractLiveComponent() {
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

		}
		 );

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
			MessageBox.alert("ATENCION", event.getServiceId()+" carece de command para ejecutar..."); 
			return;
		}
		ServiceCommand command = (ServiceCommand) commandMap.get(event.getServiceId()); 
        if (event.getResultJSONObject().get("ERROR") != null) {
        	MessageBox.alert("ERROR", ((JSONString)event.getResultJSONObject().get("ERROR")).stringValue());
            command.onError(event.getResultJSONObject());
			return;
		}

        if (event.getResultJSONObject().get("EXCEPTION") != null) {
        	MessageBox.alert("EXCEPTION", ((JSONString)event.getResultJSONObject().get("EXCEPTION")).stringValue());
            command.onException(event.getResultJSONObject());
			return;
		}

        if (event.getResultJSONObject().get("WARNING") != null) {
        	//MessageBox.alert("ATENCION", ((JSONString)event.getResultJSONObject().get("WARNING")).stringValue());
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

	public void destroy(com.gwtext.client.widgets.BaseExtWidget component) {
		if(component != null) {
			destroyElement(component.getElement());
		}
	}

	public void disposeDialog(com.gwtext.client.widgets.Window dialog) {
        //ToDo: Re-implementar. -lg
		//dialog.getEl().remove(); 
	}

	public static void showProcesando() {
		showStatus();
	}

	public static void hideProcesando() {
		hideStatus();
	}
	
	public static native String showStatus()/*-{
	$doc.getElementById('loading').style.display= 'block';
	}-*/;


	public static native String hideStatus()/*-{
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
    
    

    public JSONObject getContextoSession() {
        if(contextoSession == null) {
            try {
                String contextoSessionString = getContextoSessionString();
                contextoSession = (JSONObject)((JSONObject) JSONParser.parse(contextoSessionString)).get("context");
                if(!assertNull(contextoSession.get("ERROR"))) {
                    MessageBox.alert(contextoSession.get("ERROR").isString().stringValue());
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
        	MessageBox.alert("ERROR", "El comando '"+commandId+"' no se encuentra registrado.");
        } 
        command.execute(jsonObject);  
    }

	public native String getApplicationParameters()/*-{
        return $wnd.parent.parametrosAplicacion;
	}-*/;

    public void resetParameterStore() {
        parameterStore = null;
    }

    public void updateApplicationParameters(String params) {
        parameterStore = null;
        setApplicationParameters(params);
    }

	public native void setApplicationParameters(String params)/*-{
        return $wnd.parent.parametrosAplicacion = params;
	}-*/;

    private Store parameterStore;
    private JsonReader reader;

    public Store getApplicationParametersAsStore() {
        if(parameterStore == null) {
            if(reader == null) {
                RecordDef recordDef = new RecordDef(new FieldDef[]{
                     new IntegerFieldDef("index"), 
                     new StringFieldDef("mode"), 
                     new StringFieldDef("name"), 
                     new StringFieldDef("value")
                });

                reader = new JsonReader(recordDef);
                reader.setRoot("parametros");
                reader.setId("name");
            }

            parameterStore = new Store(reader);
            parameterStore.loadJsonData(getApplicationParameters(), true);
        }
        return parameterStore; 
    }

    public String getApplicationParameterValue(String id) {
        Record record = getApplicationParametersAsStore().getById(id);
        String result = "";
        if(record != null) {
            result = record.getAsString("value");
        }
        return result;
    }

    public void putApplicationParameterValue(String id, String value) {
        Record record = getApplicationParametersAsStore().getById(id);
        if(record != null) {
            Object [] data = new Object[4];
            data[0] = record.getAsInteger("index");
            data[1] = record.getAsString("mode");
            data[2] = record.getAsString("name");
            data[3] = value;
            getApplicationParametersAsStore().remove(record);
            Record newRecord = reader.getRecordDef().createRecord(data);
            getApplicationParametersAsStore().add(newRecord);
            getApplicationParametersAsStore().commitChanges();
        }
    }

    public void persistStore() {
        JSONObject context = new JSONObject();
        JSONArray parametros = new JSONArray();
        Record[] records = getApplicationParametersAsStore().getRecords();
        for(int i=0; i < records.length; i++) {
            JSONObject param = new JSONObject();
            param.put("index", new JSONNumber(records[i].getAsInteger("index")));
            param.put("mode", new JSONString(records[i].getAsString("mode")));
            param.put("name", new JSONString(records[i].getAsString("name")));
            param.put("value", new JSONString(records[i].getAsString("value")));
            parametros.set(i, param);
        }
        context.put("parametros", parametros);
        updateApplicationParameters(context.toString());
    }
        
  
}
