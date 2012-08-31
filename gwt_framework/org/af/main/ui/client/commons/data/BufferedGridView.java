package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.util.JavaScriptObjectHelper;
import com.gwtext.client.widgets.grid.GridView;

public class BufferedGridView extends GridView {

    public BufferedGridView() {
        super();
        
    }

    public BufferedGridView(JavaScriptObject jsObj) {
        super(jsObj);
    }
    
    protected native JavaScriptObject create(JavaScriptObject config) /*-{
        var gridJ = this;
        var gridV = new $wnd.Ext.ux.grid.BufferedGridView(config);
        gridV.getRowClass = function(record, index, rp, store) {
            var recordJ = @com.gwtext.client.data.Record::instance(Lcom/google/gwt/core/client/JavaScriptObject;)(record);
            var rpJ = @com.gwtext.client.widgets.grid.RowParams::instance(Lcom/google/gwt/core/client/JavaScriptObject;)(rp);
            var storeJ = @com.gwtext.client.data.Store::instance(Lcom/google/gwt/core/client/JavaScriptObject;)(store);         
            return gridJ.@com.gwtext.client.widgets.grid.GridView::getRowClass(Lcom/gwtext/client/data/Record;ILcom/gwtext/client/widgets/grid/RowParams;Lcom/gwtext/client/data/Store;)(recordJ, index, rpJ, storeJ);
        }
        return gridV;
    }-*/;    
    
    public void setNearLimit(int nearLimit) {
        JavaScriptObjectHelper.setAttribute(configJS, "nearLimit", nearLimit);
    }
    
    public int getNearLimit() {
        return JavaScriptObjectHelper.getAttributeAsInt(configJS, "nearLimit");
    }
    
    public void setLoadMask(String message) {
        JavaScriptObject config = JavaScriptObjectHelper.createObject();
        JavaScriptObjectHelper.setAttribute(config, "msg", message);
        JavaScriptObjectHelper.setAttribute(configJS, "loadMask", config);
    }
}
