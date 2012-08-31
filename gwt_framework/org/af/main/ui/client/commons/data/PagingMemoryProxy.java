/*
 * GWT-Ext Widget Library
 * Copyright(c) 2007-2008, GWT-Ext.
 * licensing@gwt-ext.com
 * 
 * http://www.gwt-ext.com/license
 */
package org.af.main.ui.client.commons.data;

import com.google.gwt.core.client.JavaScriptObject;
import com.gwtext.client.data.MemoryProxy;

/**
 * A paging proxy that supports paging of local array data. Usage :
 * <p/>
 * <pre>
 * <code>
 * <p/>
 *  Object[][] data = new Object[][]{
 *               new Object[]{"3m Co", new Double(71.72), new Double(0.02), new Double(0.03), "9/1 12:00am", "MMM"},
 *               new Object[]{"Alcoa Inc", new Double(29.01), new Double(0.42), new Double(1.47), "9/1 12:00am", "AA"}};
 * <p/>
 *  MemoryProxy proxy = new PagingMemoryProxy(data);
 *  RecordDef recordDef = new RecordDef(
 *          new FieldDef[]{
 *                  new StringFieldDef("company"),
 *                  new FloatFieldDef("price"),
 *                  new FloatFieldDef("change"),
 *                  new FloatFieldDef("pctChange"),
 *                  new DateFieldDef("lastChanged", "n/j h:ia")
 *          }
 *  );
 * <p/>
 *  ArrayReader reader = new ArrayReader(recordDef);
 *  final Store store = new Store(proxy, reader);
 *  store.load();
 * <p/>
 *  ...
 *  ComboBox cb = new ComboBox(new ComboBoxConfig() {
 *        {
 *          setMinChars(1);
 *          setFieldLabel("Company");
 *          setStore(store);
 *          setDisplayField("company");
 *          setTriggerAction("all");
 *          setEmptyText("Enter company");
 *          setLoadingText("Searching...");
 *          setTypeAhead(true);
 *          setSelectOnFocus(true);
 *          setWidth(250);
 *          setPageSize(10);
 *        }
 *  });
 * </code>
 * </pre>
 */
public class PagingMemoryProxy extends MemoryProxy {

    static {
        init();
    }

/*
  * Ext.ux.data.PagingMemoryProxy
  *
  * A proxy for local / in-browser data structures
  * supports paging / sorting / filtering / etc
  *
  * @author Ing. Ido Sebastiaan Bas van Oostveen
  * http://extjs.com/learn/Extention:PagingMemoryProxy
  */

    private static native void init() /*-{
        $wnd.Ext.namespace("Ext.ux");
        $wnd.Ext.namespace("Ext.ux.data");

         if (!$wnd.Array.prototype.filter) {
            $wnd.Array.prototype.filter = function(fun) {
                var len = this.length;
                if (typeof fun != "function")
                    throw new TypeError();

                var res = new Array();
                var thisp = arguments[1];
                for (var i = 0; i < len; i++) {
                    if (i in this) {
                        var val = this[i]; // in case fun mutates this
                        if (fun.call(thisp, val, i, this))
                            res.push(val);
                    }
                }
                return res;
            };
        }
       //Fix for Opera, which does not seem to include the map function on Array's
       if(!$wnd.Array.prototype.map){
            $wnd.Array.prototype.map = function(fun){
                var len = this.length;
                if(typeof fun != "function"){
                    throw new TypeError();
                }
                var res = new Array(len);
                var thisp = arguments[1];
                for(var i = 0; i < len; i++){
                    if(i in this){
                    res[i] = fun.call(thisp, this[i], i, this);
                }
            }
            return res;
        };
}

        $wnd.Ext.ux.data.PagingMemoryProxy = function(data, config) {
            $wnd.Ext.ux.data.PagingMemoryProxy.superclass.constructor.call(this);
            this.data = data;
            $wnd.Ext.apply(this, config);
        };

        $wnd.Ext.extend($wnd.Ext.ux.data.PagingMemoryProxy, $wnd.Ext.data.MemoryProxy, {
            customFilter: null,

            load : function(params, reader, callback, scope, arg) {
                params = params || {};
                var result;
                try {
                    result = reader.readRecords(this.data);
                }catch(e){
                    this.fireEvent("loadexception", this, arg, null, e);
                    callback.call(scope, null, arg, false);
                    return;
                }

            // filtering
            if (this.customFilter!=null) {
                result.records = result.records.filter(this.customFilter);
                result.totalRecords = result.records.length;
            } else if (params.filter!==undefined) {
                result.records = result.records.filter(function(el){
                    if (typeof(el)=="object"){
                        var att = params.filterCol || 0;
                        return String(el.data[att]).match(params.filter)?true:false;
                    } else {
                        return String(el).match(params.filter)?true:false;
                    }
                });
                result.totalRecords = result.records.length;
            } else if (params.query!==undefined) {
                result.records = result.records.filter(function(el){
                    if (typeof(el)=="object"){
                        var att = params.filterCol || 0;
                        return String(el.data[att]).toLowerCase().match(params.query.toLowerCase());
                   } else {
                        return String(el).toLowerCase().match(params.query.toLowerCase());
                    }
                });
                result.totalRecords = result.records.length;
             }
              // sorting
              if (params.sort!==undefined) {
                    // use integer as params.sort to specify column, since arrays are not named
                    // params.sort=0; would also match a array without columns
                    var dir = String(params.dir).toUpperCase() == "DESC" ? -1 : 1;
                    var fn = function(r1, r2){
                        return r1==r2 ? 0 : r1<r2 ? -1 : 1;
                    };
                    var st = reader.recordType.getField(params.sort).sortType;
                    result.records.sort(function(a, b) {
                        var v = 0;
                        if (typeof(a)=="object"){
                            v = fn(st(a.data[params.sort]), st(b.data[params.sort])) * dir;
                        } else {
                            v = fn(a, b) * dir;
                        }
                        if (v==0) {
                            v = (a.index < b.index ? -1 : 1);
                        }
                        return v;
                    });
                }

                // paging (use undefined cause start can also be 0 (thus false))
                if (params.start!==undefined && params.limit!==undefined) {
                    result.records = result.records.slice(params.start, params.start+params.limit);
                }

                callback.call(scope, result, arg, true);
            }
        });
    }-*/;

    /**
     * Construct a new paging memory proxy using the data passed.
     *
     * @param data the array data
     */
    public PagingMemoryProxy(Object[][] data) {
        super(data);
    }

    protected native JavaScriptObject create(JavaScriptObject data) /*-{
        return new $wnd.Ext.ux.data.PagingMemoryProxy(data);
    }-*/;
}

