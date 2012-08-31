package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.core.UrlParam;
import com.gwtext.client.data.DataProxy;
import com.gwtext.client.data.Reader;
import com.gwtext.client.data.RecordDef;
import com.gwtext.client.data.SortState;
import com.gwtext.client.data.Store;
import com.gwtext.client.util.JavaScriptObjectHelper;

public class BufferedStore extends Store {

    public BufferedStore(DataProxy dataProxy, Reader reader, boolean remoteSort) {
        super(dataProxy, reader, remoteSort);
        
    }

    public BufferedStore(DataProxy dataProxy, Reader reader, UrlParam[] baseParams, SortState initialSortState,
            boolean remoteSort) {
        super(dataProxy, reader, baseParams, initialSortState, remoteSort);
        
    }

    public BufferedStore(DataProxy dataProxy, Reader reader) {
        super(dataProxy, reader);
        
    }

    public BufferedStore(Reader reader) {
        super(reader);
        
    }

    public BufferedStore(RecordDef recordDef) {
        super(recordDef);
        
    }

    protected BufferedStore() {
    }

    public BufferedStore(JavaScriptObject jsObj) {
        super(jsObj);
    }    
    
    public JavaScriptObject getJsObj() {
        if(jsObj == null) {
            jsObj = create(configJS);
        }
        return jsObj;
    }
    
    native JavaScriptObject create(JavaScriptObject config) /*-{
        return new $wnd.Ext.ux.grid.BufferedStore(config);
    }-*/;

    public void setBufferSize(int bufferSize) {
        JavaScriptObjectHelper.setAttribute(configJS, "bufferSize", bufferSize);
    }    
}
