
(function () {

    var editorUiInit = EditorUi.prototype.init;

    EditorUi.prototype.init = function () {
        editorUiInit.apply(this, arguments);
        this.actions.get("export").setEnabled(false);
        // Actualiza los estados de acción que requieren un backend.        
        if (!Editor.useLocalStorage) {
            mxUtils.post(
                OPEN_URL,
                "",
                mxUtils.bind(this, function (req) {
                    var enabled = req.getStatus() != 404;
                    this.actions.get("open").setEnabled(enabled || Graph.fileSupport);
                    this.actions.get("import").setEnabled(enabled || Graph.fileSupport);
                    this.actions.get("save").setEnabled(enabled);
                    this.actions.get("saveAs").setEnabled(enabled);
                    this.actions.get("export").setEnabled(enabled);
                })
            );
        }
    };
    
    mxResources.loadDefaultBundle = false;
    var bundle =
        mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
        mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

    // Fixes possible asynchronous requests
    mxUtils.getAll(
        [bundle, "/files/Dibujo2.xml"],

        async function (xhr) {
            this.socket = io();

            //var params = new URLSearchParams(window.location.search);                        

            // Main                        
            const init = () => {
                mxResources.parse(xhr[0].getText());// Adds bundle text to resources            
                var themes = new Object();// Configures the default graph theme
                themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
                return new EditorUi(new Editor(urlParams["chrome"] == "0", themes), document.querySelector("#editorUI"));

            }
            this.editor = await init();
            this.socket.on("connect", () => { });
            const url = window.location.href;
            const partes = url.split("/");
            const sala = partes[partes.length - 1];

            const user = {
                sala: sala,
                user: "Eddy Flores Campozano"
            }
            this.socket.emit('join', user);
            let a = true;
            this.socket.on("actualizar-diagrama", async (data) => {
                a = false
                await refrescar(data)
                a = true
            });
            const refrescar = (data) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.xml, "text/xml");
                const model = this.editor.editor.graph.getModel();
                model.clear();
                const decoder = new mxCodec(model);
                decoder.decode(xmlDoc.documentElement, model);
                this.editor.editor.graph.refresh();
            }

            this.editor.editor.graph.getModel().addListener(mxEvent.CHANGE, (sender, evt) => {
                if (a) {
                    const model = mxUtils.getXml(this.editor.editor.getGraphXml())
                    this.socket.emit("update-diagram", { xml: model, sala: sala});
                } 
            });

            this.socket.on('confirmar-participante', ({user}) => {

                const resultado = confirm(`${user} a pedido unirse.`);

                if (resultado === true) {
                    // El usuario hizo clic en "Aceptar" en el cuadro de diálogo de confirmación
                    console.log("El usuario ha confirmado.");
                } else {
                    // El usuario hizo clic en "Cancelar" en el cuadro de diálogo de confirmación
                    console.log("El usuario ha cancelado.");
                }

                

            });
        },



        function () {
            document.body.innerHTML =
                '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
        }
    );


})();


