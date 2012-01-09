package org.ampf.nosis.bootstrap;

import org.ampf.af.bootstrap.StandaloneApplication;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import org.ampf.nosis.agents.INosisClient;
import org.apache.camel.CamelContext;

public class NosisBootstrap extends StandaloneApplication {

    public NosisBootstrap(AbstractApplicationContext applicationContext) {
        super(applicationContext);
    }

    public static void main(String[] args) {
        AbstractApplicationContext context = new ClassPathXmlApplicationContext("/"+SPRING_CONFIGURATION_FILE);
        NosisBootstrap client = new NosisBootstrap(context);
        try {
            context.start();
            context.getBean("nosisClient");
            CamelContext camelContext = (CamelContext) context.getBean("camelContext");
            camelContext.start();
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }


}
