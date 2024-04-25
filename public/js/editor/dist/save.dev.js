"use strict";

var guardarArchivo = function guardarArchivo(ui, forceDialog) {
  console.log("HOLAAA GUARDAR");

  if (!forceDialog && ui.editor.filename != null) {
    update(ui, ui.editor.getOrCreateFilename());
  } else {
    var dlg = new FilenameDialog(ui, ui.editor.getOrCreateFilename(), mxResources.get('save'), mxUtils.bind(ui, function (name) {
      save(ui, name);
    }), null, mxUtils.bind(ui, function (name) {
      if (name != null && name.length > 0) {
        return true;
      }

      mxUtils.confirm(mxResources.get('invalidName'));
      return false;
    }));
    ui.showDialog(dlg.container, 300, 100, true, true);
    dlg.init();
  }
};

var update = function update(ui, name) {
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
};

var save = function save(ui, name) {
  var xml, blob, formData, _ref, data;

  return regeneratorRuntime.async(function save$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(name != null)) {
            _context.next = 27;
            break;
          }

          if (ui.editor.graph.isEditing()) {
            ui.editor.graph.stopEditing();
          }

          _context.prev = 2;
          xml = mxUtils.getXml(ui.editor.getGraphXml());

          if (!(xml.length < MAX_REQUEST_SIZE)) {
            _context.next = 15;
            break;
          }

          blob = new Blob([xml], {
            type: 'application/xml'
          });
          formData = new FormData();
          formData.append('file', blob, name);
          _context.next = 10;
          return regeneratorRuntime.awrap(axios.post('/room/save', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }));

        case 10:
          _ref = _context.sent;
          data = _ref.data;
          console.log(data);
          _context.next = 18;
          break;

        case 15:
          mxUtils.alert(mxResources.get('drawingTooLarge'));
          mxUtils.popup(xml);
          return _context.abrupt("return");

        case 18:
          download(xml, name);
          ui.editor.setModified(false);
          ui.editor.setFilename(name);
          ui.updateDocumentTitle();
          _context.next = 27;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](2);
          ui.editor.setStatus('Error saving file', _context.t0);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 24]]);
};

var download = function download(xml, name) {
  var data = new Blob([xml], {
    type: 'text/plain'
  });
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
};

var cargarDiagrama = function cargarDiagrama(ui) {
  console.log(ui.editor.graph);
  window.openNew = false;
  window.openKey = 'open';
  window.openFile = new OpenFile(mxUtils.bind(ui, function (cancel) {
    ui.hideDialog(cancel);
  }));
  window.openFile.setConsumer(mxUtils.bind(ui, function (xml, filename) {
    try {
      var doc = mxUtils.parseXml(xml);
      editor.graph.setSelectionCells(editor.graph.importGraphModel(doc.documentElement));
    } catch (e) {
      mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
    }
  })); // Removes openFile if dialog is closed

  ui.showDialog(new OpenDialog(ui).container, Editor.useLocalStorage ? 640 : 320, Editor.useLocalStorage ? 480 : 220, true, true, function () {
    window.openFile = null; // Llama a la función de carga del diagrama cuando el diálogo se cierra
  });
  console.log(window.openFile);
};