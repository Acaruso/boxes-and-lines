function userFunction(logger) {
    let str = "hello world\ntest";
    let id = logger.newNode("", null);
    logger.appendToNode(str, id);
    logger.appendToNode("\n", id);
    logger.appendToNode("\n", id);
    logger.appendToNode("more test", id);
}
