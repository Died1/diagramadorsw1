
var guardarArchivo = function (ui, forceDialog) {
    console.log("HOLAAA GUARDAR")
    if (!forceDialog && ui.editor.filename != null) {
        update(ui, ui.editor.getOrCreateFilename());
    } else {
        var dlg = new FilenameDialog(ui,
            ui.editor.getOrCreateFilename(),
            mxResources.get('save'),
            mxUtils.bind(ui, function (name) { save(ui, name); }),
            null,
            mxUtils.bind(ui, function (name) {
                if (name != null && name.length > 0) { return true; }
                mxUtils.confirm(mxResources.get('invalidName'));
                return false;
            }
            ));




        ui.showDialog(dlg.container, 300, 100, true, true);
        dlg.init();
    }
};

var update = function (ui, name) {
    if (name != null) {
        if (ui.editor.graph.isEditing()) {
            ui.editor.graph.stopEditing();
        }
        var xml = mxUtils.getXml(ui.editor.getGraphXml());
        download(xml, name);
        ui.editor.setModified(false);
        ui.editor.setFilename(name);
        ui.updateDocumentTitle();
    }
}

var save = async function (ui, name) {
    if (name != null) {
        if (ui.editor.graph.isEditing()) {
            ui.editor.graph.stopEditing();
        }
        try {
            var xml = mxUtils.getXml(ui.editor.getGraphXml());
            if (xml.length < MAX_REQUEST_SIZE) {
                var blob = new Blob([xml], { type: 'application/xml' });
                var formData = new FormData();
                formData.append('file', blob, name);
                const { data } = await axios.post('/room/save', formData, { headers: { 'Content-Type': 'multipart/form-data', }, });
                console.log(data);
            } else {
                mxUtils.alert(mxResources.get('drawingTooLarge'));
                mxUtils.popup(xml);
                return;
            }
            download(xml, name);
            ui.editor.setModified(false);
            ui.editor.setFilename(name);
            ui.updateDocumentTitle();
        } catch (e) {
            ui.editor.setStatus('Error saving file', e);
        }
    }
};
var download = function (xml, name) {
    var data = new Blob([xml], { type: 'text/plain' });
    textFile = window.URL.createObjectURL(data);
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = name;
        link.href = textFile;
        link.click();
        document.body.removeChild(link); // remove the link when done
    } else {
        location.replace(uri);
    }
}

var cargarDiagrama = (ui) => {
    console.log(ui.editor.graph)
    window.openNew = false;
    window.openKey = 'open';
    window.openFile = new OpenFile(mxUtils.bind(ui, function (cancel) {
        ui.hideDialog(cancel);
    }));

    window.openFile.setConsumer(mxUtils.bind(ui, function (xml, filename) {
        try {
            var doc = mxUtils.parseXml(xml);
            editor.graph.setSelectionCells(editor.graph.importGraphModel(doc.documentElement));
        }
        catch (e) {
            mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
        }
    }));
    // Removes openFile if dialog is closed
    ui.showDialog(new OpenDialog(ui).container, (Editor.useLocalStorage) ? 640 : 320,
    (Editor.useLocalStorage) ? 480 : 220, true, true, function () {
        window.openFile = null;
        // Llama a la función de carga del diagrama cuando el diálogo se cierra
        
    });
    console.log(window.openFile)

}



