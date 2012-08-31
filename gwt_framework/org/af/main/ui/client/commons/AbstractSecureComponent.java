package org.af.main.ui.client.commons;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;

import com.gwtext.client.widgets.Component;
import com.gwtext.client.widgets.Panel;
import com.gwtext.client.widgets.event.ComponentListenerAdapter;
import com.gwtext.client.widgets.form.FormPanel;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;


public abstract class AbstractSecureComponent extends AbstractLiveComponent {
    public HashMap controls=new HashMap();
    private FormPanel form;
    public static final int SOLO_CONSULTA=1;
    public static final int ACCESO_TOTAL=2;
    public static final int ACCESO_NIVEL_3=3;
    private HashMap controlesPermisos= new HashMap();
    private JSONObject controlesPermisosRole = null;
    
    public AbstractSecureComponent(){
        setControlesPermisosRole();
        this.addListener(new ComponentListenerAdapter() {
            public void onRender(Component component){
                registerComponents();
                evalStates();
           }
        });
    }
   
    abstract public void registerComponents();
    
    public void setForm(FormPanel form){
        this.form=form;
    }
    
    public FormPanel getForm(){
        return form;
    }
    
    public void addControl(String key, Component component){
        controls.put(key, component);
    }
    
    public HashMap getControls(){
        return controls;
    }
    
  
    
    public void evalStates(){
        int idNivelAcceso;
        HashMap estados=getControlesPermisos();
        HashMap controlesPantalla=getControls();
        Set keys=null;
        if(controlesPantalla!=null && controlesPantalla.size()>0){
            keys=controlesPantalla.keySet();          
        }
        if(estados!=null && estados.size()>0 && keys!=null){
            for(Iterator it = keys.iterator(); it.hasNext();){
                    String keyAux=(String)it.next();
                    if(estados.containsKey(keyAux)){
                        idNivelAcceso=(Integer)estados.get(keyAux);    
                        switch(idNivelAcceso){
                        case ACCESO_TOTAL:
                            ((Component)controlesPantalla.get(keyAux)).setDisabled(false);
                            break;                
                        case SOLO_CONSULTA:
                            ((Component)controlesPantalla.get(keyAux)).setDisabled(true);
                            break;
                        case ACCESO_NIVEL_3:
                            ((Component)controlesPantalla.get(keyAux)).setDisabled(false);
                            break;
                        }
                    }
              }
        }
    }
    
    public void registerControls(Panel panel){
        for(int i=0; i<panel.getComponents().length; i++){
            com.google.gwt.user.client.Window.alert("componente : " + panel.getComponents()[i].toString());
        }
    }
    
    public native String getControlesPremisosRoleString()/*-{
    return $wnd.controlesPermisosRole;
    }-*/;
    
    public void setControlesPermisosRole(){
       
       if(assertNull(controlesPermisosRole)){
           try {
                 String controlesPermisosRoleString = getControlesPremisosRoleString();
                 controlesPermisosRole = (JSONObject)((JSONObject) JSONParser.parse(controlesPermisosRoleString)).get("context");
                 JSONArray array = controlesPermisosRole.isObject().get("controlesPermisosRole").isArray();
                 for(int i=0; i<array.size(); i++){
                     String clave=array.get(i).isObject().get("descripcion").isString().stringValue();
                     String idNivelAcceso=array.get(i).isObject().get("idNivelAcceso").isString().stringValue();
                     controlesPermisos.put(clave, Integer.parseInt(idNivelAcceso));
                 }
             } catch(Exception ex) {
                 controlesPermisosRole = new JSONObject();
             }
       }
    }
    
    public JSONObject getControlesPermisosRole(){
       return this.controlesPermisosRole;
    }
    
    public HashMap getControlesPermisos(){
        return this.controlesPermisos;
    }
}
