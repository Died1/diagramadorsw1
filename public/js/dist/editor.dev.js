"use strict";

var socket = io();

if (socket && mxClient) {
  (function () {
    var editorUiInit = EditorUi.prototype.init;

    EditorUi.prototype.init = function () {
      editorUiInit.apply(this, arguments);
      this.actions.get("export").setEnabled(false); // Actualiza los estados de acción que requieren un backend.        

      if (!Editor.useLocalStorage) {
        mxUtils.post(OPEN_URL, "", mxUtils.bind(this, function (req) {
          var enabled = req.getStatus() != 404;
          this.actions.get("open").setEnabled(enabled || Graph.fileSupport);
          this.actions.get("import").setEnabled(enabled || Graph.fileSupport);
          this.actions.get("save").setEnabled(enabled);
          this.actions.get("saveAs").setEnabled(enabled);
          this.actions.get("export").setEnabled(enabled);
        }));
      }

      var graph = this.editor.graph;
      var model = graph.getModel();
      model.local = true;
      var diagr = window.diagrama;

      if (diagr) {
        setModel(diagr);
      }

      var url = window.location.href;
      var partes = url.split("/");
      var sala = partes[partes.length - 1];
      var hist = [];
      var user = {
        sala: sala,
        user: "Eddy Flores Campozano"
      };
      socket.emit('join', user);
      model.addListener(mxEvent.CHANGE, function (sender, evt) {
        var change = evt.getProperty('edit').changes[0]; // Obtener el primer cambio del evento

        var aux = window.eui.editor.undoManager;
        var url = window.location.href;
        var partes = url.split("/");
        var sala = partes[partes.length - 1];

        if (model.local) {
          var enc = new mxCodec();
          var node = enc.encode(model);
          socket.emit('update-diagram', {
            xml: mxUtils.getXml(node),
            sala: sala
          });
        }

        model.local = true;
        window.eui.editor.undoManager = aux;
      });
      model.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
        console.log('Se han agregado celdas al modelo');
      });
      model.addListener(mxEvent.CELLS_REMOVED, function (sender, evt) {
        console.log('Se han eliminado celdas del modelo');
      });
      model.addListener(mxEvent.CELLS_MOVED, function (sender, evt) {
        console.log('Se han movido celdas dentro del modelo');
      });
      model.addListener(mxEvent.STYLE_CHANGED, function (sender, evt) {
        console.log('Se ha cambiado el estilo de una celda');
      });
      model.addListener(mxEvent.LABEL_CHANGED, function (sender, evt) {
        console.log('Se ha cambiado la etiqueta de una celda');
      });
      model.addListener(mxEvent.CELL_CONNECTED, function (sender, evt) {
        console.log('Se ha conectado una celda a otra celda');
      });
      model.addListener(mxEvent.CELLS_RESIZED, function (sender, evt) {
        console.log('Se ha cambiado el tamaño de celdas');
      });
      model.addListener(mxEvent.CELL_VERTEX_CONNECTED, function (sender, evt) {
        console.log('Se ha conectado un vértice a otro vértice');
      });
      socket.on('actualizar-diagrama', function _callee(node) {
        var aux;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                aux = window.eui.editor.undoManager;
                model.beginUpdate();

                try {
                  setModel(node);
                  model.local = false;
                } finally {
                  model.endUpdate();
                }

                window.eui.editor.undoManager = aux;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        });
      });

      function setModel(node) {
        console.log(node);
        var doc = mxUtils.parseXml(node);
        var codec = new mxCodec(doc);
        codec.decode(doc.documentElement, model);
      }
    };

    mxResources.loadDefaultBundle = false;
    var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) || mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage); // Fixes possible asynchronous requests

    mxUtils.getAll([bundle, "/files/Dibujo2.xml"], function (xhr) {
      mxResources.parse(xhr[0].getText()); // Configures the default graph theme

      var themes = new Object();
      themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
      var container = document.getElementById('container');
      var isEditor = hasPermission('write');
      var editorUI = new EditorUi(new Editor(urlParams['chrome'] == '0', themes), container, null, isEditor);
      window.eui = editorUI;
      editorUI.actions.get('pageView').funct();
      editorUI.setGridColor('#A9C4EB');
      editorUI.editor.graph.setGridSize(15);
      editorUI.editor.graph.setEnabled(isEditor);
    }, function () {
      document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    });

    function hasPermission(permissionType) {
      return true; // Simulación de que el usuario tiene permisos de escritura
    }
  })();
}