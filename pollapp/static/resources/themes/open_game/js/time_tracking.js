function start_tracking() { 
    this.start_time = new Date();
}

function stop_tracking() {
    return (new Date() - this.start_time);
}

