<!DOCTYPE html>
<html metal:use-macro="./wrapper/main.html/layout">
    <div id="main_edit" metal:fill-slot="main_content">

        <div tal:condition="authentication">
            <div class="alert" tal:condition="authentication/error">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <strong tal:replace="authentication/error">Mensaje error</strong>
            </div>
        </div>

        <form class="form-horizontal" method="POST" action="/admin/login/ingresar">
            <div class="control-group">
                <label class="control-label" for="usuario">Usuario</label>
                <div class="controls">
                    <input type="text" id="usuario" name="usuario" placeholder="Usuario" />
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="password">Password</label>
                <div class="controls">
                    <input type="password" id="password" name="password" placeholder="Password" />
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <!--
                    <label class="checkbox">
                        <input type="checkbox"/> Recordarme
                    </label>
                    -->
                    <button type="submit" class="btn">Ingresar</button>
                </div>
            </div>
        </form>

    </div> <!-- /container -->

    <tal:block metal:fill-slot="main_js_templates">
        <script>
            $('#usuario').focus();
        </script>
    </tal:block>
</html>
