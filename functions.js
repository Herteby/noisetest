toRadians = function (angle) {
    return angle * (Math.PI / 180);
};
isInt = function (value) {
    return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10));
};
objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
equalsOneOf = function(value, array){
    return (array.indexOf(value) >= 0);
};
randOneOf = function (array) {
  return array[randInt(0, array.length - 1)];
};

mode = function (array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
};

function thousandSeparate(number) {
    var array = number.toString().split('');
    for (var i = 0; i < array.length; i++) {
        if(i % 4 === 3){
            array.splice(-i,0,',');
            i++;
        }
    }
    array = array.join('');
    return array;
}
function flash($object, classString) {
    $object.addClass(classString,{
        duration:400,
        complete: function(){
            $(this).removeClass(classString,400);
        }
    });
}