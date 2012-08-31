package org.af.main.ui.client.commons.data;

import com.gwtext.client.data.Record;

public interface BufferedStoreListener {
    void onVersionChange(BufferedStore store, String oldValue, String newValue);
    void onBeforeSelectionLoad(BufferedStore store, int[][] ranges);
    void onSelectionLoad(BufferedStore store, Record[] records, int[][] ranges);
}
