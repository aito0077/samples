package org.ampf.nosis.domain;

import org.ampf.af.framework.Entity;

public class SessionUser extends Entity {

    String usuario;
    String password;

    public SessionUser() {
    }

    public SessionUser(SessionUser sessionUserOld) {
        this.usuario = sessionUserOld.getUsuario();
        this.password = sessionUserOld.getPassword();
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setPassword(String password) {
        this.password = password ;
    }

    public String getPassword() {
        return password;
    }

}

