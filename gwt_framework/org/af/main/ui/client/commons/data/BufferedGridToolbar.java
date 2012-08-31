package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.widgets.Toolbar;
import org.af.main.ui.client.commons.data.BufferedGridView;

public class BufferedGridToolbar extends Toolbar {

    static{
        init();
    }
    
    private static JavaScriptObject configPrototype;
    
    private BufferedGridView view;

    protected JavaScriptObject getConfigPrototype() {
        return configPrototype;
    }    
    
    private static native void init()/*-{
        $wnd.Ext.reg("bufferedgridtoolbar", $wnd.Ext.ux.BufferedGridToolbar);
        var c = new $wnd.Ext.Toolbar();
        @com.gwtext.client.widgets.Toolbar::configPrototype = c.initialConfig;
    }-*/;
    
    public BufferedGridToolbar(BufferedGridView view) {
        setView(this.view=view);
    }


    protected native JavaScriptObject create(JavaScriptObject config) /*-{
        if(!config.items) config.items = @com.gwtext.client.util.JavaScriptObjectHelper::createJavaScriptArray()();
        return new $wnd.Ext.ux.BufferedGridToolbar(config);
    }-*/;

    public String getXType() {
        return "bufferedgridtoolbar";
    }

    public void setDisplayInfo(boolean displayInfo) {
        setAttribute("displayInfo", displayInfo, false);
    }

    public BufferedGridView getView() {
        return view;
    }

    public void setView(BufferedGridView view) {
        this.view = view;
        setAttribute("view", view.getJsObj(), false);
    }

    

}
