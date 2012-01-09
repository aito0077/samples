<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib prefix="ui" tagdir="/WEB-INF/tags/ui" %>

    <script type="text/javascript" src="<c:url value="/static/javascript/jquery/plugins/jquery.maskedinput-1.3.min.js"/>"></script>


    <script type="text/javascript" src="<c:url value="/static/jquery/jqueryLib/jquery-ui-1.8.13.custom/development-bundle/ui/jquery.ui.tabs.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/jquery/jqueryLib/jquery-ui-1.8.13.custom/development-bundle/ui/jquery.ui.accordion.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/javascript/backbone/json2.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/javascript/backbone/underscore-min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/backbone/backbone.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/javascript/jquery/plugins/jquery.tmpl.min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/backbone/synapse.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/compontents/datacombo.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/af/uif.js?VERSION_TIME"/>"></script>

    <link rel="stylesheet" type="text/css" href="<c:url value="/static/framework/resource/lib/dev/notifier/notifier.css"/>"/>
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/notifier/notifier.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/utils/validaciones.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/date/date_format.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/date/date_util.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/compontents/combobox.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/compontents/combocollection.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/core/utils/formatos.js"/>"></script>

    <link rel="stylesheet" type="text/css" href="<c:url value="/static/framework/uif/ayudas/alta/page.css"/>"/>
<!-- PLUGINS -->
    <script type="text/javascript" src="<c:url value="/static/framework/resource/lib/dev/plugins/spinner/ui.spinner.min.js?VERSION_TIME"/>"></script>
    <link rel="stylesheet" type="text/css" href="<c:url value="/static/framework/resource/lib/dev/plugins/spinner/ui.spinner.css?VERSION_TIME"/>"/>

</head>
<body style="{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px;}">

    <ui:component uri="ayudas/alta/wizard"/>

    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/dialogs/busqueda_asociados.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/wizard.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/identificar_solicitante.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/requisitos_solicitante.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/consulta_margen.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/control_documentacion.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/informacion_nosis.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/modules/planes_formas_pago.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/models.js?VERSION_TIME"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/framework/uif/ayudas/alta/page.js?VERSION_TIME"/>"></script>
</body>
</html>


