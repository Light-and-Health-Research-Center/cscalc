var add = function (a, b, c) {
    return a+b+c;
}
var subtract = function (a, b, c) {
    return a-b-c;
}

var handle_data = function (func, params, z) {
    // get data from user or other external source
    var x = params[0];
    var y = params[1];
    return func(x, y, z);
}