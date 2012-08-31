package org.af.main.ui.client.commons;

import com.gwtext.client.widgets.Panel;
import com.gwtext.client.widgets.form.Field;


public abstract class DinamicAbstractForm extends AbstractLiveComponent{
    
    abstract public Panel getViewPanel();
    
    abstract public void registerServices();

    abstract public void loadStores();
    
    abstract public void generateForm();
    
    abstract public Field[] instantiateFields();
}
