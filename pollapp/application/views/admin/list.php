<!DOCTYPE html>
<html metal:use-macro="./wrapper/main.html/layout">
    <div id="main_edit" metal:fill-slot="main_content">
        <table class="table table-striped table-hover">
            <caption><h2>Procesos</h2></caption>
            <thead>
                <tr>
                    <th>Codigo</th>
                    <th>Sumario</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr tal:repeat="proceso result/procesos"  tal:attributes="class php: proceso.estado == 'INACTIVO' ? 'error' : NULL">
                    <td tal:content="proceso/codigo">COD1</td>
                    <td tal:content="proceso/sumario">Sumario de ejemplo para concurso</td>
                    <td tal:content="proceso/estado">ACTIVO</td>
                    <td><a class="btn btn-small btn-primary" href="/admin/edit/visualizar/${proceso/codigo}">Ver</a></td>
                </tr>
           </tbody>
        </table>

    </div> <!-- /container -->

</html>
