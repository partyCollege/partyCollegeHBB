angular.module('app.filters', [])
.filter("columnDisplayFilter", function ($filter) {
    return function (input) {
        if (input.filter != "") {
            if (input.filter == "date") {
                return inputdate = $filter("date")(input.value, input.format);
            }
            else {
                return input.value;
            }
        }
        else {
            return input.value;
        }
    }
})
.filter("chatDateFilter", function ($filter) {
    return function (input) {
        var returnVal="";
        if (input) {
            if ($filter("date")(input, 'yyyy-MM-dd') == $filter("date")(new Date(), 'yyyy-MM-dd')) {
                returnVal = $filter("date")(input, 'HH:mm');
            }
            else {
                returnVal = $filter("date")(input, 'MM-dd');
            }
        }
        return returnVal;
    }
})
.filter("dateFilter", function ($filter) {
    return function (input) {
        if (input) {
            return inputdate = new Date(input);
        }
    }
})
.filter('nl2br', ['$filter',
  function ($filter) {
      return function (str) {
          if (!str) return str;
          str = str.replace(/</g, '<；');
          str = str.replace(/>/g, '>；');
          str = str.replace(/ /g, '<；br/>；');
          if (str.indexOf("[em_" > -1)) {
              for (var c = 1; c <= 75; c++) {
                  if (str.indexOf("[em_" + c > -1)) {
                      str = str.replace("[em_" + c + "]", "<img src='../bower_components/jquery/arclist/" + c + ".gif'>")
                  }
              }
          }
          return str.replace(/\n\r?/g, '<br />');
      };
  }
])
.filter("queryItem", function () {
    return function (list, query) {
        if (query) {
            var returnVal = new Array();
            for (var j = 0; j < list.length; j++) {
                item = list[j];
                for (var i = 0; i < item.rowListColumnData.length; i++) {
                    if (item.rowListColumnData[i].istitle == true) {
                        if (item.rowListColumnData[i].value.indexOf(query) > -1) {
                            returnVal.push(item);
                        }
                    }
                }
            }
            return returnVal;
        }
        else {
            return list;
        }
    }
})
.filter("filterQueryOneCard", function () {
    return function (list, query) {
        if (query) {
            var returnVal = new Array();
            for (var j = 0; j < list.length; j++) {
                item = list[j];
                if (item.TypeName.indexOf(query) > -1) {
                    returnVal.push(item);
                }
                //for (var i = 0; i < item.rowListColumnData.length; i++) {
                //    if (item.rowListColumnData[i].istitle == true) {
                //        if (item.rowListColumnData[i].value.indexOf(query) > -1) {
                //            returnVal.push(item);
                //        }
                //    }
                //}
            }
            return returnVal;
        }
        else {
            return list;
        }
    }
})
.filter("SPZTFilter", function ($filter) {
    return function (input) {
        var returnVal = "";
        switch (input) {
            case "0": returnVal = "未审核"; break;
            case "1": returnVal = "同意"; break;
            case "-1": returnVal = "不同意"; break;
            case "-2": returnVal = "已撤销"; break;
        }
        return returnVal;
    }
})
.filter("queryStuList", function () {
    return function (list, query) {
        if (query) {
            var returnVal = new Array();
            for (var j = 0; j < list.length; j++) {
                var item = list[j];
                if (item.bt.indexOf(query) > -1 || (item.bt2 != undefined && item.bt2.indexOf(query) > -1)) {
                    returnVal.push(item);
                }
            }
            return returnVal;
        }
        else {
            return list;
        }
    }
})
.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
