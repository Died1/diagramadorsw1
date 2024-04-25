"use strict";

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
  };

  mxResources.loadDefaultBundle = false;
  var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) || mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage); // Fixes possible asynchronous requests

  mxUtils.getAll([bundle, "/files/Dibujo2.xml"], function _callee2(xhr) {
    var _this = this;

    var init, url, partes, sala, user, a, refrescar;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.socket = io(); //var params = new URLSearchParams(window.location.search);                        
            // Main                        

            init = function init() {
              mxResources.parse(xhr[0].getText()); // Adds bundle text to resources            

              var themes = new Object(); // Configures the default graph theme

              themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
              return new EditorUi(new Editor(urlParams["chrome"] == "0", themes), document.querySelector("#editorUI"));
            };

            _context2.next = 4;
            return regeneratorRuntime.awrap(init());

          case 4:
            this.editor = _context2.sent;
            this.socket.on("connect", function () {});
            url = window.location.href;
            partes = url.split("/");
            sala = partes[partes.length - 1];
            user = {
              sala: sala,
              user: "Eddy Flores Campozano"
            };
            this.socket.emit('join', user);
            a = true;
            this.socket.on("actualizar-diagrama", function _callee(data) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      a = false;
                      _context.next = 3;
                      return regeneratorRuntime.awrap(refrescar(data));

                    case 3:
                      a = true;

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });

            refrescar = function refrescar(data) {
              var parser = new DOMParser();
              var xmlDoc = parser.parseFromString(data.xml, "text/xml");

              var model = _this.editor.editor.graph.getModel();

              model.clear();
              var decoder = new mxCodec(model);
              decoder.decode(xmlDoc.documentElement, model);

              _this.editor.editor.graph.refresh();
            };

            this.editor.editor.graph.getModel().addListener(mxEvent.CHANGE, function (sender, evt) {
              if (a) {
                var model = mxUtils.getXml(_this.editor.editor.getGraphXml());

                _this.socket.emit("update-diagram", {
                  xml: model,
                  sala: sala
                });
              }
            });
            this.socket.on('confirmar-participante', function (_ref) {
              var user = _ref.user;
              var resultado = confirm("".concat(user, " a pedido unirse."));

              if (resultado === true) {
                // El usuario hizo clic en "Aceptar" en el cuadro de diálogo de confirmación
                console.log("El usuario ha confirmado.");
              } else {
                // El usuario hizo clic en "Cancelar" en el cuadro de diálogo de confirmación
                console.log("El usuario ha cancelado.");
              }
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this);
  }, function () {
    document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
  });
})();