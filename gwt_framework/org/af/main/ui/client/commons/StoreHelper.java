package org.af.main.ui.client.commons;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

import com.gwtext.client.data.ArrayReader;
import com.gwtext.client.data.DataProxy;
import com.gwtext.client.data.FieldDef;
import com.gwtext.client.data.MemoryProxy;
import com.gwtext.client.data.Reader;
import com.gwtext.client.data.Record;
import com.gwtext.client.data.RecordDef;
import com.gwtext.client.data.Store;
import com.gwtext.client.data.StringFieldDef;
import com.gwtext.client.data.IntegerFieldDef;

import org.af.core.ui.client.CallbackTarget;


public abstract class StoreHelper implements CallbackTarget {

    public static Store getStore(String[] campos, JSONArray dataArray) {
        Object[][] data = generateDataMatrix(dataArray, campos);
        
        DataProxy proxy;
        FieldDef[] fields = new FieldDef[campos.length];
        for (int i = 0; i < campos.length; i++) {
            if(campos[i].equals("id")) {
                fields[i] = new IntegerFieldDef(campos[i]);
            } else {
                fields[i] = new StringFieldDef(campos[i]);
            }
        }
        proxy = new MemoryProxy(data);
        Reader reader = new ArrayReader(0, new RecordDef(fields));
        Store store = new Store(proxy, reader, false);
        store.load();
        return store;
    }

    public static DataProxy getProxy(String[] campos, JSONArray dataArray) {
        return new MemoryProxy(generateDataMatrix(dataArray, campos));
    }

    public static void reloadStore(Store storeToReload, String[] campos, JSONArray dataArray) {
        Object[][] data = generateDataMatrix(dataArray, campos);
        if(storeToReload==null){
            storeToReload=createStore(campos, data);
        }
        storeToReload.removeAll();   
        Record[] records = createRecords(campos, data);
        storeToReload.add(records);
        storeToReload.commitChanges();
    }


    public static Store createStore(String[] campos) {
        return createStore(campos, null);
    }

    public static Store createStore(String[] campos, Object[][] data) {
        DataProxy proxy;
        FieldDef[] fields = new FieldDef[campos.length];
        if (data == null) {
            data = new String[1][campos.length];
            for (int i = 0; i < campos.length; i++) {
                data[0][i] = "";
                if(campos[i].equals("id")) {
                    fields[i] = new IntegerFieldDef(campos[i]);
                } else {
                    fields[i] = new StringFieldDef(campos[i]);
                }
            }
        } else {
            for (int i = 0; i < campos.length; i++) {
                if(campos[i].equals("id")) {
                    fields[i] = new IntegerFieldDef(campos[i]);
                } else {
                    fields[i] = new StringFieldDef(campos[i]);
                }
            }
        }
        proxy = new MemoryProxy(data);
        Reader reader = new ArrayReader(new RecordDef(fields));
        Store store = new Store(proxy, reader, false);
        return store;
        
    }

    public static Record[] createRecords(String[] campos, Object[][] data) {
        Record[] records = new Record[data.length];
        for (int i = 0; i < data.length; i++) {
            records[i] = createRecord(campos, data[i]);
        }
        return records;
    }

    public static Record createRecord(String[] campos, Object[] data) {
        FieldDef[] fields = new FieldDef[campos.length];
        if (data != null) {
            for (int i = 0; i < campos.length; i++) {
                if(campos[i].equals("id")) {
                    fields[i] = new IntegerFieldDef(campos[i]);
                } else {
                    fields[i] = new StringFieldDef(campos[i]);
                }
            }
        }
        RecordDef recordDef = new RecordDef(fields);
        return recordDef.createRecord(data);
    }

    public static Object[][] generateDataMatrix(JSONArray array, String[] columnNames) {
        //Object[][] data = new Object[array.size()][columnNames.length+1];
        Object[][] data = new Object[array.size()][columnNames.length];
        for (int i = 0; i < array.size(); i++) {
            for (int j = 0; j < columnNames.length; j++) {
                JSONValue value = array.get(i);
                if (value != null && value.isNull() == null && value.isObject() != null) {
                    JSONValue valueField = ((JSONObject)value).get(columnNames[j]);
                    if (valueField != null && valueField.isNull() == null) {
                        if (valueField.isString() != null) {
                            data[i][j] = ((JSONString)valueField).stringValue();
                        } else {
                            if (valueField.isNumber() != null) {
                                data[i][j] = String.valueOf(((JSONNumber)valueField).getValue());
                            } else {
                                if (valueField.isArray() != null && valueField.isNull() == null) {
                                    Store store = processJSONArrayToRecordArray(valueField.isArray());
                                    data[i][j] = store;
                                }
                            }
                        }
                    } else {
                        data[i][j] = "";
                    }
                } else {
                    if (value.isNumber() != null) {
                        data[i][j] = String.valueOf(((JSONNumber)value).getValue());
                    } else {
                        data[i][j] = "";
                    }
                }
            }
            //data[i][columnNames.length] = "";
        }
        return data;
    }

    public static Store processJSONArrayToRecordArray(JSONArray array) {
        Store store = null;
        JSONObject objectInstance = null;
        Object[] fields = null;
        for (int i = 0; i < array.size(); i++) {
            if (i == 0) {
                objectInstance = array.get(i).isObject();
                fields = objectInstance.keySet().toArray();
                break;
            }
        }
        if (fields != null) {
            String[] campos = new String[fields.length];
            for (int k = 0; k < campos.length; k++) {
                campos[k] = (String)fields[k];
            }
            store = getStore(campos, array);
        }
        return store;
    }
    
   

}
