package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.data.JsonReader;
import com.gwtext.client.data.RecordDef;
import com.gwtext.client.util.JavaScriptObjectHelper;

public class BufferedJsonReader extends JsonReader {

    public BufferedJsonReader(RecordDef recordDef) {
        super(recordDef);
    }

    public BufferedJsonReader(String root, RecordDef recordDef) {
        super(root, recordDef);
    }
    
    protected native JavaScriptObject create(JavaScriptObject config, JavaScriptObject recordDef) /*-{
        return new $wnd.Ext.ux.data.BufferedJsonReader(config, recordDef);
    }-*/;
    
    public  void setVersionProperty(String versionProperty){
        JavaScriptObjectHelper.setAttribute(configJS, "versionProperty", versionProperty);
    }
    
}
