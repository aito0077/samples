package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.widgets.grid.RowSelectionModel;

public class BufferedRowSelectionModel extends RowSelectionModel {

    protected native JavaScriptObject create(boolean singleSelect)/*-{
        return new $wnd.Ext.ux.grid.BufferedRowSelectionModel({singleSelect: singleSelect});
    }-*/;

    public BufferedRowSelectionModel() {
        super();
    }

    public BufferedRowSelectionModel(boolean singleSelect) {
        super(singleSelect);
        
    }

    public BufferedRowSelectionModel(JavaScriptObject jsObj) {
        super(jsObj);
    }

}
