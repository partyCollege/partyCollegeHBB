
/** plugins\cordova-plugin-globalization\www\GlobalizationError.js */

cordova.define("cordova-plugin-globalization.GlobalizationError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/


/**
 * Globalization error object
 *
 * @constructor
 * @param code
 * @param message
 */
var GlobalizationError = function(code, message) {
    this.code = code || null;
    this.message = message || '';
};

// Globalization error codes
GlobalizationError.UNKNOWN_ERROR = 0;
GlobalizationError.FORMATTING_ERROR = 1;
GlobalizationError.PARSING_ERROR = 2;
GlobalizationError.PATTERN_ERROR = 3;

module.exports = GlobalizationError;

});

/** plugins\cordova-plugin-globalization\www\globalization.js */

cordova.define("cordova-plugin-globalization.globalization", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var globalization = {

/**
* Returns the string identifier for the client's current language.
* It returns the language identifier string to the successCB callback with a
* properties object as a parameter. If there is an error getting the language,
* then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {String}: The language identifier
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getPreferredLanguage(function (language) {alert('language:' + language.value + '\n');},
*                                function () {});
*/
getPreferredLanguage:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getPreferredLanguage', arguments);
    exec(successCB, failureCB, "Globalization","getPreferredLanguage", []);
},

/**
* Returns the string identifier for the client's current locale setting.
* It returns the locale identifier string to the successCB callback with a
* properties object as a parameter. If there is an error getting the locale,
* then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {String}: The locale identifier
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getLocaleName(function (locale) {alert('locale:' + locale.value + '\n');},
*                                function () {});
*/
getLocaleName:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getLocaleName', arguments);
    exec(successCB, failureCB, "Globalization","getLocaleName", []);
},


/**
* Returns a date formatted as a string according to the client's user preferences and
* calendar using the time zone of the client. It returns the formatted date string to the
* successCB callback with a properties object as a parameter. If there is an error
* formatting the date, then the errorCB callback is invoked.
*
* The defaults are: formatLenght="short" and selector="date and time"
*
* @param {Date} date
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return Object.value {String}: The localized date string
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.dateToString(new Date(),
*                function (date) {alert('date:' + date.value + '\n');},
*                function (errorCode) {alert(errorCode);},
*                {formatLength:'short'});
*/
dateToString:function(date, successCB, failureCB, options) {
    argscheck.checkArgs('dfFO', 'Globalization.dateToString', arguments);
    var dateValue = date.valueOf();
    exec(successCB, failureCB, "Globalization", "dateToString", [{"date": dateValue, "options": options}]);
},


/**
* Parses a date formatted as a string according to the client's user
* preferences and calendar using the time zone of the client and returns
* the corresponding date object. It returns the date to the successCB
* callback with a properties object as a parameter. If there is an error
* parsing the date string, then the errorCB callback is invoked.
*
* The defaults are: formatLength="short" and selector="date and time"
*
* @param {String} dateString
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return    Object.year {Number}: The four digit year
*            Object.month {Number}: The month from (0 - 11)
*            Object.day {Number}: The day from (1 - 31)
*            Object.hour {Number}: The hour from (0 - 23)
*            Object.minute {Number}: The minute from (0 - 59)
*            Object.second {Number}: The second from (0 - 59)
*            Object.millisecond {Number}: The milliseconds (from 0 - 999),
*                                        not available on all platforms
*
* @error GlobalizationError.PARSING_ERROR
*
* Example
*    globalization.stringToDate('4/11/2011',
*                function (date) { alert('Month:' + date.month + '\n' +
*                    'Day:' + date.day + '\n' +
*                    'Year:' + date.year + '\n');},
*                function (errorCode) {alert(errorCode);},
*                {selector:'date'});
*/
stringToDate:function(dateString, successCB, failureCB, options) {
    argscheck.checkArgs('sfFO', 'Globalization.stringToDate', arguments);
    exec(successCB, failureCB, "Globalization", "stringToDate", [{"dateString": dateString, "options": options}]);
},


/**
* Returns a pattern string for formatting and parsing dates according to the client's
* user preferences. It returns the pattern to the successCB callback with a
* properties object as a parameter. If there is an error obtaining the pattern,
* then the errorCB callback is invoked.
*
* The defaults are: formatLength="short" and selector="date and time"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return    Object.pattern {String}: The date and time pattern for formatting and parsing dates.
*                                    The patterns follow Unicode Technical Standard #35
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.timezone {String}: The abbreviated name of the time zone on the client
*            Object.utc_offset {Number}: The current difference in seconds between the client's
*                                        time zone and coordinated universal time.
*            Object.dst_offset {Number}: The current daylight saving time offset in seconds
*                                        between the client's non-daylight saving's time zone
*                                        and the client's daylight saving's time zone.
*
* @error GlobalizationError.PATTERN_ERROR
*
* Example
*    globalization.getDatePattern(
*                function (date) {alert('pattern:' + date.pattern + '\n');},
*                function () {},
*                {formatLength:'short'});
*/
getDatePattern:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getDatePattern', arguments);
    exec(successCB, failureCB, "Globalization", "getDatePattern", [{"options": options}]);
},


/**
* Returns an array of either the names of the months or days of the week
* according to the client's user preferences and calendar. It returns the array of names to the
* successCB callback with a properties object as a parameter. If there is an error obtaining the
* names, then the errorCB callback is invoked.
*
* The defaults are: type="wide" and item="months"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'narrow' or 'wide'
*            item {String}: 'months', or 'days'
*
* @return Object.value {Array{String}}: The array of names starting from either
*                                        the first month in the year or the
*                                        first day of the week.
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getDateNames(function (names) {
*        for(var i = 0; i < names.value.length; i++) {
*            alert('Month:' + names.value[i] + '\n');}},
*        function () {});
*/
getDateNames:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getDateNames', arguments);
    exec(successCB, failureCB, "Globalization", "getDateNames", [{"options": options}]);
},

/**
* Returns whether daylight savings time is in effect for a given date using the client's
* time zone and calendar. It returns whether or not daylight savings time is in effect
* to the successCB callback with a properties object as a parameter. If there is an error
* reading the date, then the errorCB callback is invoked.
*
* @param {Date} date
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.dst {Boolean}: The value "true" indicates that daylight savings time is
*                                in effect for the given date and "false" indicate that it is not.
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.isDayLightSavingsTime(new Date(),
*                function (date) {alert('dst:' + date.dst + '\n');}
*                function () {});
*/
isDayLightSavingsTime:function(date, successCB, failureCB) {
    argscheck.checkArgs('dfF', 'Globalization.isDayLightSavingsTime', arguments);
    var dateValue = date.valueOf();
    exec(successCB, failureCB, "Globalization", "isDayLightSavingsTime", [{"date": dateValue}]);
},

/**
* Returns the first day of the week according to the client's user preferences and calendar.
* The days of the week are numbered starting from 1 where 1 is considered to be Sunday.
* It returns the day to the successCB callback with a properties object as a parameter.
* If there is an error obtaining the pattern, then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {Number}: The number of the first day of the week.
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getFirstDayOfWeek(function (day)
*                { alert('Day:' + day.value + '\n');},
*                function () {});
*/
getFirstDayOfWeek:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getFirstDayOfWeek', arguments);
    exec(successCB, failureCB, "Globalization", "getFirstDayOfWeek", []);
},


/**
* Returns a number formatted as a string according to the client's user preferences.
* It returns the formatted number string to the successCB callback with a properties object as a
* parameter. If there is an error formatting the number, then the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {Number} number
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return Object.value {String}: The formatted number string.
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.numberToString(3.25,
*                function (number) {alert('number:' + number.value + '\n');},
*                function () {},
*                {type:'decimal'});
*/
numberToString:function(number, successCB, failureCB, options) {
    argscheck.checkArgs('nfFO', 'Globalization.numberToString', arguments);
    exec(successCB, failureCB, "Globalization", "numberToString", [{"number": number, "options": options}]);
},

/**
* Parses a number formatted as a string according to the client's user preferences and
* returns the corresponding number. It returns the number to the successCB callback with a
* properties object as a parameter. If there is an error parsing the number string, then
* the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {String} numberString
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return Object.value {Number}: The parsed number.
*
* @error GlobalizationError.PARSING_ERROR
*
* Example
*    globalization.stringToNumber('1234.56',
*                function (number) {alert('Number:' + number.value + '\n');},
*                function () { alert('Error parsing number');});
*/
stringToNumber:function(numberString, successCB, failureCB, options) {
    argscheck.checkArgs('sfFO', 'Globalization.stringToNumber', arguments);
    exec(successCB, failureCB, "Globalization", "stringToNumber", [{"numberString": numberString, "options": options}]);
},

/**
* Returns a pattern string for formatting and parsing numbers according to the client's user
* preferences. It returns the pattern to the successCB callback with a properties object as a
* parameter. If there is an error obtaining the pattern, then the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return    Object.pattern {String}: The number pattern for formatting and parsing numbers.
*                                    The patterns follow Unicode Technical Standard #35.
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.symbol {String}: The symbol to be used when formatting and parsing
*                                    e.g., percent or currency symbol.
*            Object.fraction {Number}: The number of fractional digits to use when parsing and
*                                    formatting numbers.
*            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
*            Object.positive {String}: The symbol to use for positive numbers when parsing and formatting.
*            Object.negative: {String}: The symbol to use for negative numbers when parsing and formatting.
*            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
*            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
*
* @error GlobalizationError.PATTERN_ERROR
*
* Example
*    globalization.getNumberPattern(
*                function (pattern) {alert('Pattern:' + pattern.pattern + '\n');},
*                function () {});
*/
getNumberPattern:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getNumberPattern', arguments);
    exec(successCB, failureCB, "Globalization", "getNumberPattern", [{"options": options}]);
},

/**
* Returns a pattern string for formatting and parsing currency values according to the client's
* user preferences and ISO 4217 currency code. It returns the pattern to the successCB callback with a
* properties object as a parameter. If there is an error obtaining the pattern, then the errorCB
* callback is invoked.
*
* @param {String} currencyCode
* @param {Function} successCB
* @param {Function} errorCB
*
* @return    Object.pattern {String}: The currency pattern for formatting and parsing currency values.
*                                    The patterns follow Unicode Technical Standard #35
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.code {String}: The ISO 4217 currency code for the pattern.
*            Object.fraction {Number}: The number of fractional digits to use when parsing and
*                                    formatting currency.
*            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
*            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
*            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.getCurrencyPattern('EUR',
*                function (currency) {alert('Pattern:' + currency.pattern + '\n');}
*                function () {});
*/
getCurrencyPattern:function(currencyCode, successCB, failureCB) {
    argscheck.checkArgs('sfF', 'Globalization.getCurrencyPattern', arguments);
    exec(successCB, failureCB, "Globalization", "getCurrencyPattern", [{"currencyCode": currencyCode}]);
}

};

module.exports = globalization;

});

/** plugins\cordova-plugin-geolocation\www\android\geolocation.js */

cordova.define("cordova-plugin-geolocation.geolocation", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = cordova.require('cordova/exec');
var utils = require('cordova/utils');
var PositionError = require('./PositionError');

// Native watchPosition method is called async after permissions prompt.
// So we use additional map and own ids to return watch id synchronously.
var pluginToNativeWatchMap = {};

module.exports = {
    getCurrentPosition: function(success, error, args) {
        var win = function() {
          var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
          geo.getCurrentPosition(success, error, args);
        };
        var fail = function() {
            if (error) {
                error(new PositionError (PositionError.PERMISSION_DENIED, 'Illegal Access'));
            }
        };
        exec(win, fail, "Geolocation", "getPermission", []);
    },

    watchPosition: function(success, error, args) {
        var pluginWatchId = utils.createUUID();

        var win = function() {
            var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
            pluginToNativeWatchMap[pluginWatchId] = geo.watchPosition(success, error, args);
        };

        var fail = function() {
            if (error) {
                error(new PositionError(PositionError.PERMISSION_DENIED, 'Illegal Access'));
            }
        };
        exec(win, fail, "Geolocation", "getPermission", []);

        return pluginWatchId;
    },

    clearWatch: function(pluginWatchId) {
        var win = function() {
            var nativeWatchId = pluginToNativeWatchMap[pluginWatchId];
            var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
            geo.clearWatch(nativeWatchId);
        };

        exec(win, null, "Geolocation", "getPermission", []);
    }
};

});

/** plugins\cordova-plugin-geolocation\www\PositionError.js */

cordova.define("cordova-plugin-geolocation.PositionError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Position error object
 *
 * @constructor
 * @param code
 * @param message
 */
var PositionError = function(code, message) {
    this.code = code || null;
    this.message = message || '';
};

PositionError.prototype.PERMISSION_DENIED = PositionError.PERMISSION_DENIED = 1;
PositionError.prototype.POSITION_UNAVAILABLE = PositionError.POSITION_UNAVAILABLE = 2;
PositionError.prototype.TIMEOUT = PositionError.TIMEOUT = 3;

module.exports = PositionError;

});

/** plugins\cordova-plugin-contacts\www\contacts.js */

cordova.define("cordova-plugin-contacts.contacts", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    ContactError = require('./ContactError'),
    Contact = require('./Contact'),
    fieldType = require('./ContactFieldType'),
    convertUtils = require('./convertUtils');

/**
* Represents a group of Contacts.
* @constructor
*/
var contacts = {
    fieldType: fieldType,
    /**
     * Returns an array of Contacts matching the search criteria.
     * @param fields that should be searched
     * @param successCB success callback
     * @param errorCB error callback
     * @param {ContactFindOptions} options that can be applied to contact searching
     * @return array of Contacts matching search criteria
     */
    find: function(fields, successCB, errorCB, options) {
        argscheck.checkArgs('afFO', 'contacts.find', arguments);
        if (!fields.length) {
            if (errorCB) {
                errorCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            }
        } else {
            // missing 'options' param means return all contacts
            options = options || { filter: '', multiple: true };
            var win = function(result) {
                var cs = [];
                for (var i = 0, l = result.length; i < l; i++) {
                    cs.push(convertUtils.toCordovaFormat(contacts.create(result[i])));
                }
                successCB(cs);
            };
            exec(win, errorCB, "Contacts", "search", [fields, options]);
        }
    },
    
    /**
     * This function picks contact from phone using contact picker UI
     * @returns new Contact object
     */
    pickContact: function (successCB, errorCB) {

        argscheck.checkArgs('fF', 'contacts.pick', arguments);

        var win = function (result) {
            // if Contacts.pickContact return instance of Contact object
            // don't create new Contact object, use current
            var contact = result instanceof Contact ? result : contacts.create(result);
            successCB(convertUtils.toCordovaFormat(contact));
        };
        exec(win, errorCB, "Contacts", "pickContact", []);
    },

    /**
     * This function creates a new contact, but it does not persist the contact
     * to device storage. To persist the contact to device storage, invoke
     * contact.save().
     * @param properties an object whose properties will be examined to create a new Contact
     * @returns new Contact object
     */
    create: function(properties) {
        argscheck.checkArgs('O', 'contacts.create', arguments);
        var contact = new Contact();
        for (var i in properties) {
            if (typeof contact[i] !== 'undefined' && properties.hasOwnProperty(i)) {
                contact[i] = properties[i];
            }
        }
        return contact;
    }
};

module.exports = contacts;

});

/** plugins\cordova-plugin-contacts\www\Contact.js */

cordova.define("cordova-plugin-contacts.Contact", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    ContactError = require('./ContactError'),
    utils = require('cordova/utils'),
    convertUtils = require('./convertUtils');

/**
* Contains information about a single contact.
* @constructor
* @param {DOMString} id unique identifier
* @param {DOMString} displayName
* @param {ContactName} name
* @param {DOMString} nickname
* @param {Array.<ContactField>} phoneNumbers array of phone numbers
* @param {Array.<ContactField>} emails array of email addresses
* @param {Array.<ContactAddress>} addresses array of addresses
* @param {Array.<ContactField>} ims instant messaging user ids
* @param {Array.<ContactOrganization>} organizations
* @param {DOMString} birthday contact's birthday
* @param {DOMString} note user notes about contact
* @param {Array.<ContactField>} photos
* @param {Array.<ContactField>} categories
* @param {Array.<ContactField>} urls contact's web sites
*/
var Contact = function (id, displayName, name, nickname, phoneNumbers, emails, addresses,
    ims, organizations, birthday, note, photos, categories, urls) {
    this.id = id || null;
    this.rawId = null;
    this.displayName = displayName || null;
    this.name = name || null; // ContactName
    this.nickname = nickname || null;
    this.phoneNumbers = phoneNumbers || null; // ContactField[]
    this.emails = emails || null; // ContactField[]
    this.addresses = addresses || null; // ContactAddress[]
    this.ims = ims || null; // ContactField[]
    this.organizations = organizations || null; // ContactOrganization[]
    this.birthday = birthday || null;
    this.note = note || null;
    this.photos = photos || null; // ContactField[]
    this.categories = categories || null; // ContactField[]
    this.urls = urls || null; // ContactField[]
};

/**
* Removes contact from device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.remove = function(successCB, errorCB) {
    argscheck.checkArgs('FF', 'Contact.remove', arguments);
    var fail = errorCB && function(code) {
        errorCB(new ContactError(code));
    };
    if (this.id === null) {
        fail(ContactError.UNKNOWN_ERROR);
    }
    else {
        exec(successCB, fail, "Contacts", "remove", [this.id]);
    }
};

/**
* Creates a deep copy of this Contact.
* With the contact ID set to null.
* @return copy of this Contact
*/
Contact.prototype.clone = function() {
    var clonedContact = utils.clone(this);
    clonedContact.id = null;
    clonedContact.rawId = null;

    function nullIds(arr) {
        if (arr) {
            for (var i = 0; i < arr.length; ++i) {
                arr[i].id = null;
            }
        }
    }

    // Loop through and clear out any id's in phones, emails, etc.
    nullIds(clonedContact.phoneNumbers);
    nullIds(clonedContact.emails);
    nullIds(clonedContact.addresses);
    nullIds(clonedContact.ims);
    nullIds(clonedContact.organizations);
    nullIds(clonedContact.categories);
    nullIds(clonedContact.photos);
    nullIds(clonedContact.urls);
    return clonedContact;
};

/**
* Persists contact to device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.save = function(successCB, errorCB) {
    argscheck.checkArgs('FFO', 'Contact.save', arguments);
    var fail = errorCB && function(code) {
        errorCB(new ContactError(code));
    };
    var success = function(result) {
        if (result) {
            if (successCB) {
                var fullContact = require('./contacts').create(result);
                successCB(convertUtils.toCordovaFormat(fullContact));
            }
        }
        else {
            // no Entry object returned
            fail(ContactError.UNKNOWN_ERROR);
        }
    };
    var dupContact = convertUtils.toNativeFormat(utils.clone(this));
    exec(success, fail, "Contacts", "save", [dupContact]);
};


module.exports = Contact;

});

/** plugins\cordova-plugin-contacts\www\convertUtils.js */

cordova.define("cordova-plugin-contacts.convertUtils", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var utils = require('cordova/utils');

module.exports = {
    /**
    * Converts primitives into Complex Object
    * Currently only used for Date fields
    */
    toCordovaFormat: function (contact) {
        var value = contact.birthday;
        if (value !== null) {
            try {
              contact.birthday = new Date(parseFloat(value));
              
              //we might get 'Invalid Date' which does not throw an error
              //and is an instance of Date.
              if (isNaN(contact.birthday.getTime())) {
                contact.birthday = null;
              }

            } catch (exception){
              console.log("Cordova Contact toCordovaFormat error: exception creating date.");
            }
        }
        return contact;
    },

    /**
    * Converts Complex objects into primitives
    * Only conversion at present is for Dates.
    **/
    toNativeFormat: function (contact) {
        var value = contact.birthday;
        if (value !== null) {
            // try to make it a Date object if it is not already
            if (!utils.isDate(value)){
                try {
                    value = new Date(value);
                } catch(exception){
                    value = null;
                }
            }
            if (utils.isDate(value)){
                value = value.valueOf(); // convert to milliseconds
            }
            contact.birthday = value;
        }
        return contact;
    }
};

});

/** plugins\cordova-plugin-contacts\www\ContactAddress.js */

cordova.define("cordova-plugin-contacts.ContactAddress", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
* Contact address.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code
* @param formatted // NOTE: not a W3C standard
* @param streetAddress
* @param locality
* @param region
* @param postalCode
* @param country
*/

var ContactAddress = function(pref, type, formatted, streetAddress, locality, region, postalCode, country) {
    this.id = null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
    this.type = type || null;
    this.formatted = formatted || null;
    this.streetAddress = streetAddress || null;
    this.locality = locality || null;
    this.region = region || null;
    this.postalCode = postalCode || null;
    this.country = country || null;
};

module.exports = ContactAddress;

});

/** plugins\cordova-plugin-contacts\www\ContactError.js */

cordova.define("cordova-plugin-contacts.ContactError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 *  ContactError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var ContactError = function(err) {
    this.code = (typeof err != 'undefined' ? err : null);
};

/**
 * Error codes
 */
ContactError.UNKNOWN_ERROR = 0;
ContactError.INVALID_ARGUMENT_ERROR = 1;
ContactError.TIMEOUT_ERROR = 2;
ContactError.PENDING_OPERATION_ERROR = 3;
ContactError.IO_ERROR = 4;
ContactError.NOT_SUPPORTED_ERROR = 5;
ContactError.OPERATION_CANCELLED_ERROR = 6;
ContactError.PERMISSION_DENIED_ERROR = 20;

module.exports = ContactError;

});

/** plugins\cordova-plugin-contacts\www\ContactField.js */

cordova.define("cordova-plugin-contacts.ContactField", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
* Generic contact field.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code // NOTE: not a W3C standard
* @param type
* @param value
* @param pref
*/
var ContactField = function(type, value, pref) {
    this.id = null;
    this.type = (type && type.toString()) || null;
    this.value = (value && value.toString()) || null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
};

module.exports = ContactField;

});

/** plugins\cordova-plugin-contacts\www\ContactFindOptions.js */

cordova.define("cordova-plugin-contacts.ContactFindOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * ContactFindOptions.
 * @constructor
 * @param filter used to match contacts against
 * @param multiple boolean used to determine if more than one contact should be returned
 * @param desiredFields 
 * @param hasPhoneNumber boolean used to filter the search and only return contacts that have a phone number informed
 */

var ContactFindOptions = function(filter, multiple, desiredFields, hasPhoneNumber) {
    this.filter = filter || '';
    this.multiple = (typeof multiple != 'undefined' ? multiple : false);
    this.desiredFields = typeof desiredFields != 'undefined' ? desiredFields : [];
    this.hasPhoneNumber = typeof hasPhoneNumber != 'undefined' ? hasPhoneNumber : false;
};

module.exports = ContactFindOptions;

});

/** plugins\cordova-plugin-contacts\www\ContactName.js */

cordova.define("cordova-plugin-contacts.ContactName", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
* Contact name.
* @constructor
* @param formatted // NOTE: not part of W3C standard
* @param familyName
* @param givenName
* @param middle
* @param prefix
* @param suffix
*/
var ContactName = function(formatted, familyName, givenName, middle, prefix, suffix) {
    this.formatted = formatted || null;
    this.familyName = familyName || null;
    this.givenName = givenName || null;
    this.middleName = middle || null;
    this.honorificPrefix = prefix || null;
    this.honorificSuffix = suffix || null;
};

module.exports = ContactName;

});

/** plugins\cordova-plugin-contacts\www\ContactOrganization.js */

cordova.define("cordova-plugin-contacts.ContactOrganization", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
* Contact organization.
* @constructor
* @param pref
* @param type
* @param name
* @param dept
* @param title
*/

var ContactOrganization = function(pref, type, name, dept, title) {
    this.id = null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
    this.type = type || null;
    this.name = name || null;
    this.department = dept || null;
    this.title = title || null;
};

module.exports = ContactOrganization;

});

/** plugins\cordova-plugin-contacts\www\ContactFieldType.js */

cordova.define("cordova-plugin-contacts.ContactFieldType", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

    // Possible field names for various platforms.
    // Some field names are platform specific

    var fieldType = {
        addresses:      "addresses",
        birthday:       "birthday",
        categories:     "categories",
        country:        "country",
        department:     "department",
        displayName:    "displayName",
        emails:         "emails",
        familyName:     "familyName",
        formatted:      "formatted",
        givenName:      "givenName",
        honorificPrefix: "honorificPrefix",
        honorificSuffix: "honorificSuffix",
        id:             "id",
        ims:            "ims",
        locality:       "locality",
        middleName:     "middleName",
        name:           "name",
        nickname:       "nickname",
        note:           "note",
        organizations:  "organizations",
        phoneNumbers:   "phoneNumbers",
        photos:         "photos",
        postalCode:     "postalCode",
        region:         "region",
        streetAddress:  "streetAddress",
        title:          "title",
        urls:           "urls"
    };

    module.exports = fieldType;

});

/** plugins\cordova-plugin-device-motion\www\Acceleration.js */

cordova.define("cordova-plugin-device-motion.Acceleration", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var Acceleration = function(x, y, z, timestamp) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.timestamp = timestamp || (new Date()).getTime();
};

module.exports = Acceleration;

});

/** plugins\cordova-plugin-device-motion\www\accelerometer.js */

cordova.define("cordova-plugin-device-motion.accelerometer", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
var argscheck = require('cordova/argscheck'),
    utils = require("cordova/utils"),
    exec = require("cordova/exec"),
    Acceleration = require('./Acceleration');

// Is the accel sensor running?
var running = false;

// Keeps reference to watchAcceleration calls.
var timers = {};

// Array of listeners; used to keep track of when we should call start and stop.
var listeners = [];

// Last returned acceleration object from native
var accel = null;

// Timer used when faking up devicemotion events
var eventTimerId = null;

// Tells native to start.
function start() {
    exec(function (a) {
        var tempListeners = listeners.slice(0);
        accel = new Acceleration(a.x, a.y, a.z, a.timestamp);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].win(accel);
        }
    }, function (e) {
        var tempListeners = listeners.slice(0);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].fail(e);
        }
    }, "Accelerometer", "start", []);
    running = true;
}

// Tells native to stop.
function stop() {
    exec(null, null, "Accelerometer", "stop", []);
    accel = null;
    running = false;
}

// Adds a callback pair to the listeners array
function createCallbackPair(win, fail) {
    return { win: win, fail: fail };
}

// Removes a win/fail listener pair from the listeners array
function removeListeners(l) {
    var idx = listeners.indexOf(l);
    if (idx > -1) {
        listeners.splice(idx, 1);
        if (listeners.length === 0) {
            stop();
        }
    }
}

var accelerometer = {
    /**
     * Asynchronously acquires the current acceleration.
     *
     * @param {Function} successCallback    The function to call when the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     */
    getCurrentAcceleration: function (successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'accelerometer.getCurrentAcceleration', arguments);

        if (cordova.platformId === "windowsphone") {
            exec(function (a) {
                accel = new Acceleration(a.x, a.y, a.z, a.timestamp);
                successCallback(accel);
            }, function (e) {
                errorCallback(e);
            }, "Accelerometer", "getCurrentAcceleration", []);

            return;
        }

        var p;
        var win = function (a) {
            removeListeners(p);
            successCallback(a);
        };
        var fail = function (e) {
            removeListeners(p);
            if (errorCallback) {
                errorCallback(e);
            }
        };

        p = createCallbackPair(win, fail);
        listeners.push(p);

        if (!running) {
            start();
        }
    },

    /**
     * Asynchronously acquires the acceleration repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchAcceleration: function (successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'accelerometer.watchAcceleration', arguments);
        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // Keep reference to watch id, and report accel readings as often as defined in frequency
        var id = utils.createUUID();

        var p = createCallbackPair(function () { }, function (e) {
            removeListeners(p);
            if (errorCallback) {
                errorCallback(e);
            }
        });
        listeners.push(p);

        timers[id] = {
            timer: window.setInterval(function () {
                if (accel) {
                    successCallback(accel);
                }
            }, frequency),
            listeners: p
        };

        if (running) {
            // If we're already running then immediately invoke the success callback
            // but only if we have retrieved a value, sample code does not check for null ...
            if (accel) {
                successCallback(accel);
            }
        } else {
            start();
        }

        if (cordova.platformId === "browser" && !eventTimerId) {
            // Start firing devicemotion events if we haven't already
            var devicemotionEvent = new Event('devicemotion');
            eventTimerId = window.setInterval(function() {
                window.dispatchEvent(devicemotionEvent);
            }, 200);
        }

        return id;
    },

    /**
     * Clears the specified accelerometer watch.
     *
     * @param {String} id       The id of the watch returned from #watchAcceleration.
     */
    clearWatch: function (id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            window.clearInterval(timers[id].timer);
            removeListeners(timers[id].listeners);
            delete timers[id];

            if (eventTimerId && Object.keys(timers).length === 0) {
                // No more watchers, so stop firing 'devicemotion' events
                window.clearInterval(eventTimerId);
                eventTimerId = null;
            }
        }
    }
};
module.exports = accelerometer;

});

/** plugins\cordova-plugin-device-orientation\www\CompassError.js */

cordova.define("cordova-plugin-device-orientation.CompassError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 *  CompassError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var CompassError = function(err) {
    this.code = (err !== undefined ? err : null);
};

CompassError.COMPASS_INTERNAL_ERR = 0;
CompassError.COMPASS_NOT_SUPPORTED = 20;

module.exports = CompassError;

});

/** plugins\cordova-plugin-device-orientation\www\CompassHeading.js */

cordova.define("cordova-plugin-device-orientation.CompassHeading", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var CompassHeading = function(magneticHeading, trueHeading, headingAccuracy, timestamp) {
  this.magneticHeading = magneticHeading;
  this.trueHeading = trueHeading;
  this.headingAccuracy = headingAccuracy;
  this.timestamp = timestamp || new Date().getTime();
};

module.exports = CompassHeading;

});

/** plugins\cordova-plugin-device-orientation\www\compass.js */

cordova.define("cordova-plugin-device-orientation.compass", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    utils = require('cordova/utils'),
    CompassHeading = require('./CompassHeading'),
    CompassError = require('./CompassError'),

    timers = {},
    eventTimerId = null,
    compass = {
        /**
         * Asynchronously acquires the current heading.
         * @param {Function} successCallback The function to call when the heading
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the heading data.
         * @param {CompassOptions} options The options for getting the heading data (not used).
         */
        getCurrentHeading:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'compass.getCurrentHeading', arguments);

            var win = function(result) {
                var ch = new CompassHeading(result.magneticHeading, result.trueHeading, result.headingAccuracy, result.timestamp);
                successCallback(ch);
            };
            var fail = errorCallback && function(code) {
                var ce = new CompassError(code);
                errorCallback(ce);
            };

            // Get heading
            exec(win, fail, "Compass", "getHeading", [options]);
        },

        /**
         * Asynchronously acquires the heading repeatedly at a given interval.
         * @param {Function} successCallback The function to call each time the heading
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the heading data.
         * @param {HeadingOptions} options The options for getting the heading data
         * such as timeout and the frequency of the watch. For iOS, filter parameter
         * specifies to watch via a distance filter rather than time.
         */
        watchHeading:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'compass.watchHeading', arguments);
            // Default interval (100 msec)
            var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;
            var filter = (options !== undefined && options.filter !== undefined) ? options.filter : 0;

            var id = utils.createUUID();
            if (filter > 0) {
                // is an iOS request for watch by filter, no timer needed
                timers[id] = "iOS";
                compass.getCurrentHeading(successCallback, errorCallback, options);
            } else {
                // Start watch timer to get headings
                timers[id] = window.setInterval(function() {
                    compass.getCurrentHeading(successCallback, errorCallback);
                }, frequency);
            }

            if (cordova.platformId === 'browser' && !eventTimerId) {
                // Start firing deviceorientation events if haven't already
                var deviceorientationEvent = new Event('deviceorientation');
                eventTimerId = window.setInterval(function() {
                    window.dispatchEvent(deviceorientationEvent);
                }, 200);
            }

            return id;
        },

        /**
         * Clears the specified heading watch.
         * @param {String} id The ID of the watch returned from #watchHeading.
         */
        clearWatch:function(id) {
            // Stop javascript timer & remove from timer list
            if (id && timers[id]) {
                if (timers[id] != "iOS") {
                    clearInterval(timers[id]);
                } else {
                    // is iOS watch by filter so call into device to stop
                    exec(null, null, "Compass", "stopHeading", []);
                }
                delete timers[id];

                if (eventTimerId && Object.keys(timers).length === 0) {
                    // No more watchers, so stop firing 'deviceorientation' events
                    window.clearInterval(eventTimerId);
                    eventTimerId = null;
                }
            }
        }
    };

module.exports = compass;

});

/** plugins\cordova-plugin-file\www\browser\isChrome.js */

cordova.define("cordova-plugin-file.isChrome", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

module.exports = function () {
    // window.webkitRequestFileSystem and window.webkitResolveLocalFileSystemURL are available only in Chrome and
    // possibly a good flag to indicate that we're running in Chrome
    return window.webkitRequestFileSystem && window.webkitResolveLocalFileSystemURL;
};

});

/** plugins\cordova-plugin-media-capture\www\CaptureAudioOptions.js */

cordova.define("cordova-plugin-media-capture.CaptureAudioOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Encapsulates all audio capture operation configuration options.
 */
var CaptureAudioOptions = function(){
    // Upper limit of sound clips user can record. Value must be equal or greater than 1.
    this.limit = 1;
    // Maximum duration of a single sound clip in seconds.
    this.duration = 0;
};

module.exports = CaptureAudioOptions;

});

/** plugins\cordova-plugin-media-capture\www\CaptureImageOptions.js */

cordova.define("cordova-plugin-media-capture.CaptureImageOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Encapsulates all image capture operation configuration options.
 */
var CaptureImageOptions = function(){
    // Upper limit of images user can take. Value must be equal or greater than 1.
    this.limit = 1;
};

module.exports = CaptureImageOptions;

});

/** plugins\cordova-plugin-media-capture\www\CaptureVideoOptions.js */

cordova.define("cordova-plugin-media-capture.CaptureVideoOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Encapsulates all video capture operation configuration options.
 */
var CaptureVideoOptions = function(){
    // Upper limit of videos user can record. Value must be equal or greater than 1.
    this.limit = 1;
    // Maximum duration of a single video clip in seconds.
    this.duration = 0;
    // Video quality parameter, 0 means low quality, suitable for MMS messages, and value 1 means high quality.
    this.quality = 1;
};

module.exports = CaptureVideoOptions;

});

/** plugins\cordova-plugin-media-capture\www\CaptureError.js */

cordova.define("cordova-plugin-media-capture.CaptureError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * The CaptureError interface encapsulates all errors in the Capture API.
 */
var CaptureError = function(c) {
   this.code = c || null;
};

// Camera or microphone failed to capture image or sound.
CaptureError.CAPTURE_INTERNAL_ERR = 0;
// Camera application or audio capture application is currently serving other capture request.
CaptureError.CAPTURE_APPLICATION_BUSY = 1;
// Invalid use of the API (e.g. limit parameter has value less than one).
CaptureError.CAPTURE_INVALID_ARGUMENT = 2;
// User exited camera application or audio capture application before capturing anything.
CaptureError.CAPTURE_NO_MEDIA_FILES = 3;
// User denied permissions required to perform the capture request.
CaptureError.CAPTURE_PERMISSION_DENIED = 4;
// The requested capture operation is not supported.
CaptureError.CAPTURE_NOT_SUPPORTED = 20;

module.exports = CaptureError;

});

/** plugins\cordova-plugin-media-capture\www\MediaFileData.js */

cordova.define("cordova-plugin-media-capture.MediaFileData", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * MediaFileData encapsulates format information of a media file.
 *
 * @param {DOMString} codecs
 * @param {long} bitrate
 * @param {long} height
 * @param {long} width
 * @param {float} duration
 */
var MediaFileData = function(codecs, bitrate, height, width, duration){
    this.codecs = codecs || null;
    this.bitrate = bitrate || 0;
    this.height = height || 0;
    this.width = width || 0;
    this.duration = duration || 0;
};

module.exports = MediaFileData;

});

/** plugins\cordova-plugin-media-capture\www\MediaFile.js */

cordova.define("cordova-plugin-media-capture.MediaFile", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    File = require('cordova-plugin-file.File'),
    CaptureError = require('./CaptureError');
/**
 * Represents a single file.
 *
 * name {DOMString} name of the file, without path information
 * fullPath {DOMString} the full path of the file, including the name
 * type {DOMString} mime type
 * lastModifiedDate {Date} last modified date
 * size {Number} size of the file in bytes
 */
var MediaFile = function(name, localURL, type, lastModifiedDate, size){
    MediaFile.__super__.constructor.apply(this, arguments);
};

utils.extend(MediaFile, File);

/**
 * Request capture format data for a specific file and type
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 */
MediaFile.prototype.getFormatData = function(successCallback, errorCallback) {
    if (typeof this.fullPath === "undefined" || this.fullPath === null) {
        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
    } else {
        exec(successCallback, errorCallback, "Capture", "getFormatData", [this.localURL, this.type]);
    }
};

module.exports = MediaFile;

});

/** plugins\cordova-plugin-media-capture\www\helpers.js */

cordova.define("cordova-plugin-media-capture.helpers", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var MediaFile = require('./MediaFile');

function wrapMediaFiles(pluginResult) {
    var mediaFiles = [];
    var i;
    for (i = 0; i < pluginResult.length; i++) {
        var mediaFile = new MediaFile();
        mediaFile.name = pluginResult[i].name;

        // Backwards compatibility
        mediaFile.localURL = pluginResult[i].localURL || pluginResult[i].fullPath;
        mediaFile.fullPath = pluginResult[i].fullPath;
        mediaFile.type = pluginResult[i].type;
        mediaFile.lastModifiedDate = pluginResult[i].lastModifiedDate;
        mediaFile.size = pluginResult[i].size;
        mediaFiles.push(mediaFile);
    }
    return mediaFiles;
}

module.exports = {
    wrapMediaFiles: wrapMediaFiles
};
});

/** plugins\cordova-plugin-media-capture\www\capture.js */

cordova.define("cordova-plugin-media-capture.capture", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    helpers = require('./helpers');

/**
 * Launches a capture of different types.
 *
 * @param (DOMString} type
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureVideoOptions} options
 */
function _capture(type, successCallback, errorCallback, options) {
    var win = function(pluginResult) {
        successCallback(helpers.wrapMediaFiles(pluginResult));
    };
    exec(win, errorCallback, "Capture", type, [options]);
}


/**
 * The Capture interface exposes an interface to the camera and microphone of the hosting device.
 */
function Capture() {
    this.supportedAudioModes = [];
    this.supportedImageModes = [];
    this.supportedVideoModes = [];
}

/**
 * Launch audio recorder application for recording audio clip(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureAudioOptions} options
 */
Capture.prototype.captureAudio = function(successCallback, errorCallback, options){
    _capture("captureAudio", successCallback, errorCallback, options);
};

/**
 * Launch camera application for taking image(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureImageOptions} options
 */
Capture.prototype.captureImage = function(successCallback, errorCallback, options){
    _capture("captureImage", successCallback, errorCallback, options);
};

/**
 * Launch device camera application for recording video(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureVideoOptions} options
 */
Capture.prototype.captureVideo = function(successCallback, errorCallback, options){
    _capture("captureVideo", successCallback, errorCallback, options);
};


module.exports = new Capture();

});

/** plugins\cordova-plugin-media-capture\www\android\init.js */

cordova.define("cordova-plugin-media-capture.init", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var cordova = require('cordova'),
    helpers = require('./helpers');

var SUCCESS_EVENT = "pendingcaptureresult";
var FAILURE_EVENT = "pendingcaptureerror";

var sChannel = cordova.addStickyDocumentEventHandler(SUCCESS_EVENT);
var fChannel = cordova.addStickyDocumentEventHandler(FAILURE_EVENT);

// We fire one of two events in the case where the activity gets killed while
// the user is capturing audio, image, video, etc. in a separate activity
document.addEventListener("deviceready", function() {
    document.addEventListener("resume", function(event) {
        if (event.pendingResult && event.pendingResult.pluginServiceName === "Capture") {
            if (event.pendingResult.pluginStatus === "OK") {
                var mediaFiles = helpers.wrapMediaFiles(event.pendingResult.result);
                sChannel.fire(mediaFiles);
            } else {
                fChannel.fire(event.pendingResult.result);
            }
        }
    });
});

});

/** plugins\cordova-plugin-network-information\www\network.js */

cordova.define("cordova-plugin-network-information.network", function(require, exports, module) {
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    cordova = require('cordova'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils');

// Link the onLine property with the Cordova-supplied network info.
// This works because we clobber the navigator object with our own
// object in bootstrap.js.
// Browser platform do not need to define this property, because
// it is already supported by modern browsers
if (cordova.platformId !== 'browser' && typeof navigator != 'undefined') {
    utils.defineGetter(navigator, 'onLine', function() {
        return this.connection.type != 'none';
    });
}

function NetworkConnection() {
    this.type = 'unknown';
}

/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
NetworkConnection.prototype.getInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "NetworkStatus", "getConnectionInfo", []);
};

var me = new NetworkConnection();
var timerId = null;
var timeout = 500;

channel.createSticky('onCordovaConnectionReady');
channel.waitForInitialization('onCordovaConnectionReady');

channel.onCordovaReady.subscribe(function() {
    me.getInfo(function(info) {
        me.type = info;
        if (info === "none") {
            // set a timer if still offline at the end of timer send the offline event
            timerId = setTimeout(function(){
                cordova.fireDocumentEvent("offline");
                timerId = null;
            }, timeout);
        } else {
            // If there is a current offline event pending clear it
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
            cordova.fireDocumentEvent("online");
        }

        // should only fire this once
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
    },
    function (e) {
        // If we can't get the network info we should still tell Cordova
        // to fire the deviceready event.
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
        console.log("Error initializing Network Connection: " + e);
    });
});

module.exports = me;

});

/** plugins\cordova-plugin-network-information\www\Connection.js */

cordova.define("cordova-plugin-network-information.Connection", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Network status
 */
module.exports = {
        UNKNOWN: "unknown",
        ETHERNET: "ethernet",
        WIFI: "wifi",
        CELL_2G: "2g",
        CELL_3G: "3g",
        CELL_4G: "4g",
        CELL:"cellular",
        NONE: "none"
};

});

/** plugins\cordova-plugin-vibration\www\vibration.js */

cordova.define("cordova-plugin-vibration.notification", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

/**
 * Provides access to the vibration mechanism on the device.
 */

module.exports = {

    /**
     * Vibrates the device for a given amount of time or for a given pattern or immediately cancels any ongoing vibrations (depending on the parameter).
     *
     * @param {Integer} param       The number of milliseconds to vibrate (if 0, cancels vibration)
     *
     *
     * @param {Array of Integer} param    Pattern with which to vibrate the device.
     *                                      Pass in an array of integers that
     *                                      are the durations for which to
     *                                      turn on or off the vibrator in
     *                                      milliseconds. The FIRST value
     *                                      indicates the
     *                                      number of milliseconds for which
     *                                      to keep the vibrator ON before
     *                                      turning it off. The NEXT value indicates the
     *                                      number of milliseconds for which
     *                                      to keep the vibrator OFF before
     *                                      turning it on. Subsequent values
     *                                      alternate between durations in
     *                                      milliseconds to turn the vibrator
     *                                      off or to turn the vibrator on.
     *                                      (if empty, cancels vibration)
     */
    vibrate: function(param) {

        /* Aligning with w3c spec */
        
        //vibrate
        if ((typeof param == 'number') && param !== 0)
            exec(null, null, "Vibration", "vibrate", [param]);

        //vibrate with array ( i.e. vibrate([3000]) )
        else if ((typeof param == 'object') && param.length == 1)
        {
            //cancel if vibrate([0])
            if (param[0] === 0)
                exec(null, null, "Vibration", "cancelVibration", []);

            //else vibrate
            else
                exec(null, null, "Vibration", "vibrate", [param[0]]);
        }

        //vibrate with a pattern
        else if ((typeof param == 'object') && param.length > 1)
        {
            var repeat = -1; //no repeat
            exec(null, null, "Vibration", "vibrateWithPattern", [param, repeat]);
        }

        //cancel vibration (param = 0 or [])
        else
            exec(null, null, "Vibration", "cancelVibration", []);

        return true;
    },

    /**
     * Vibrates the device with a given pattern.
     *
     * @param {Array of Integer} pattern    Pattern with which to vibrate the device.
     *                                      Pass in an array of integers that
     *                                      are the durations for which to
     *                                      turn on or off the vibrator in
     *                                      milliseconds. The first value
     *                                      indicates the number of milliseconds
     *                                      to wait before turning the vibrator
     *                                      on. The next value indicates the
     *                                      number of milliseconds for which
     *                                      to keep the vibrator on before
     *                                      turning it off. Subsequent values
     *                                      alternate between durations in
     *                                      milliseconds to turn the vibrator
     *                                      off or to turn the vibrator on.
     *
     * @param {Integer} repeat              Optional index into the pattern array at which
     *                                      to start repeating (will repeat until canceled),
     *                                      or -1 for no repetition (default).
     */
    vibrateWithPattern: function(pattern, repeat) {
        repeat = (typeof repeat !== "undefined") ? repeat : -1;
        pattern.unshift(0); //add a 0 at beginning for backwards compatibility from w3c spec
        exec(null, null, "Vibration", "vibrateWithPattern", [pattern, repeat]);
    },

    /**
     * Immediately cancels any currently running vibration.
     */
    cancelVibration: function() {
        exec(null, null, "Vibration", "cancelVibration", []);
    }
};

});

/** plugins\cordova-plugin-statusbar\www\statusbar.js */

cordova.define("cordova-plugin-statusbar.statusbar", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/* global cordova */

var exec = require('cordova/exec');

var namedColors = {
    "black": "#000000",
    "darkGray": "#A9A9A9",
    "lightGray": "#D3D3D3",
    "white": "#FFFFFF",
    "gray": "#808080",
    "red": "#FF0000",
    "green": "#00FF00",
    "blue": "#0000FF",
    "cyan": "#00FFFF",
    "yellow": "#FFFF00",
    "magenta": "#FF00FF",
    "orange": "#FFA500",
    "purple": "#800080",
    "brown": "#A52A2A"
};

var StatusBar = {

    isVisible: true,

    overlaysWebView: function (doOverlay) {
        exec(null, null, "StatusBar", "overlaysWebView", [doOverlay]);
    },

    styleDefault: function () {
        // dark text ( to be used on a light background )
        exec(null, null, "StatusBar", "styleDefault", []);
    },

    styleLightContent: function () {
        // light text ( to be used on a dark background )
        exec(null, null, "StatusBar", "styleLightContent", []);
    },

    styleBlackTranslucent: function () {
        // #88000000 ? Apple says to use lightContent instead
        exec(null, null, "StatusBar", "styleBlackTranslucent", []);
    },

    styleBlackOpaque: function () {
        // #FF000000 ? Apple says to use lightContent instead
        exec(null, null, "StatusBar", "styleBlackOpaque", []);
    },

    backgroundColorByName: function (colorname) {
        return StatusBar.backgroundColorByHexString(namedColors[colorname]);
    },

    backgroundColorByHexString: function (hexString) {
        if (hexString.charAt(0) !== "#") {
            hexString = "#" + hexString;
        }

        if (hexString.length === 4) {
            var split = hexString.split("");
            hexString = "#" + split[1] + split[1] + split[2] + split[2] + split[3] + split[3];
        }

        exec(null, null, "StatusBar", "backgroundColorByHexString", [hexString]);
    },

    hide: function () {
        exec(null, null, "StatusBar", "hide", []);
        StatusBar.isVisible = false;
    },

    show: function () {
        exec(null, null, "StatusBar", "show", []);
        StatusBar.isVisible = true;
    }

};

// prime it. setTimeout so that proxy gets time to init
window.setTimeout(function () {
    exec(function (res) {
        if (typeof res == 'object') {
            if (res.type == 'tap') {
                cordova.fireWindowEvent('statusTap');
            }
        } else {
            StatusBar.isVisible = res;
        }
    }, null, "StatusBar", "_ready", []);
}, 0);

module.exports = StatusBar;

});

/** plugins\cordova-plugin-media\www\MediaError.js */

cordova.define("cordova-plugin-media.MediaError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * This class contains information about any Media errors.
*/
/*
 According to :: http://dev.w3.org/html5/spec-author-view/video.html#mediaerror
 We should never be creating these objects, we should just implement the interface
 which has 1 property for an instance, 'code'

 instead of doing :
    errorCallbackFunction( new MediaError(3,'msg') );
we should simply use a literal :
    errorCallbackFunction( {'code':3} );
 */

 var _MediaError = window.MediaError;


if(!_MediaError) {
    window.MediaError = _MediaError = function(code, msg) {
        this.code = (typeof code != 'undefined') ? code : null;
        this.message = msg || ""; // message is NON-standard! do not use!
    };
}

_MediaError.MEDIA_ERR_NONE_ACTIVE    = _MediaError.MEDIA_ERR_NONE_ACTIVE    || 0;
_MediaError.MEDIA_ERR_ABORTED        = _MediaError.MEDIA_ERR_ABORTED        || 1;
_MediaError.MEDIA_ERR_NETWORK        = _MediaError.MEDIA_ERR_NETWORK        || 2;
_MediaError.MEDIA_ERR_DECODE         = _MediaError.MEDIA_ERR_DECODE         || 3;
_MediaError.MEDIA_ERR_NONE_SUPPORTED = _MediaError.MEDIA_ERR_NONE_SUPPORTED || 4;
// TODO: MediaError.MEDIA_ERR_NONE_SUPPORTED is legacy, the W3 spec now defines it as below.
// as defined by http://dev.w3.org/html5/spec-author-view/video.html#error-codes
_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;

module.exports = _MediaError;

});

/** plugins\cordova-plugin-media\www\Media.js */

cordova.define("cordova-plugin-media.Media", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var mediaObjects = {};

/**
 * This class provides access to the device media, interfaces to both sound and video
 *
 * @constructor
 * @param src                   The file name or url to play
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var Media = function(src, successCallback, errorCallback, statusCallback) {
    argscheck.checkArgs('sFFF', 'Media', arguments);
    this.id = utils.createUUID();
    mediaObjects[this.id] = this;
    this.src = src;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;
    exec(null, this.errorCallback, "Media", "create", [this.id, this.src]);
};

// Media messages
Media.MEDIA_STATE = 1;
Media.MEDIA_DURATION = 2;
Media.MEDIA_POSITION = 3;
Media.MEDIA_ERROR = 9;

// Media states
Media.MEDIA_NONE = 0;
Media.MEDIA_STARTING = 1;
Media.MEDIA_RUNNING = 2;
Media.MEDIA_PAUSED = 3;
Media.MEDIA_STOPPED = 4;
Media.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];

// "static" function to return existing objs.
Media.get = function(id) {
    return mediaObjects[id];
};

/**
 * Start or resume playing audio file.
 */
Media.prototype.play = function(options) {
    exec(null, null, "Media", "startPlayingAudio", [this.id, this.src, options]);
};

/**
 * Stop playing audio file.
 */
Media.prototype.stop = function() {
    var me = this;
    exec(function() {
        me._position = 0;
    }, this.errorCallback, "Media", "stopPlayingAudio", [this.id]);
};

/**
 * Seek or jump to a new time in the track..
 */
Media.prototype.seekTo = function(milliseconds) {
    var me = this;
    exec(function(p) {
        me._position = p;
    }, this.errorCallback, "Media", "seekToAudio", [this.id, milliseconds]);
};

/**
 * Pause playing audio file.
 */
Media.prototype.pause = function() {
    exec(null, this.errorCallback, "Media", "pausePlayingAudio", [this.id]);
};

/**
 * Get duration of an audio file.
 * The duration is only set for audio that is playing, paused or stopped.
 *
 * @return      duration or -1 if not known.
 */
Media.prototype.getDuration = function() {
    return this._duration;
};

/**
 * Get position of audio.
 */
Media.prototype.getCurrentPosition = function(success, fail) {
    var me = this;
    exec(function(p) {
        me._position = p;
        success(p);
    }, fail, "Media", "getCurrentPositionAudio", [this.id]);
};

/**
 * Start recording audio file.
 */
Media.prototype.startRecord = function() {
    exec(null, this.errorCallback, "Media", "startRecordingAudio", [this.id, this.src]);
};

/**
 * Stop recording audio file.
 */
Media.prototype.stopRecord = function() {
    exec(null, this.errorCallback, "Media", "stopRecordingAudio", [this.id]);
};

/**
 * Pause recording audio file.
 */
Media.prototype.pauseRecord = function() {
    exec(null, this.errorCallback, "Media", "pauseRecordingAudio", [this.id]);
};

/**
* Resume recording audio file.
*/
Media.prototype.resumeRecord = function() {
    exec(null, this.errorCallback, "Media", "resumeRecordingAudio", [this.id]);
};

/**
 * Release the resources.
 */
Media.prototype.release = function() {
    exec(null, this.errorCallback, "Media", "release", [this.id]);
};

/**
 * Adjust the volume.
 */
Media.prototype.setVolume = function(volume) {
    exec(null, null, "Media", "setVolume", [this.id, volume]);
};

/**
 * Adjust the playback rate.
 */
Media.prototype.setRate = function(rate) {
    if (cordova.platformId === 'ios'){
        exec(null, null, "Media", "setRate", [this.id, rate]);
    } else {
        console.warn('media.setRate method is currently not supported for', cordova.platformId, 'platform.');
    }
};

/**
 * Get amplitude of audio.
 */
Media.prototype.getCurrentAmplitude = function(success, fail) {
    exec(function(p) {
        success(p);
    }, fail, "Media", "getCurrentAmplitudeAudio", [this.id]);
};

/**
 * Audio has status update.
 * PRIVATE
 *
 * @param id            The media object id (string)
 * @param msgType       The 'type' of update this is
 * @param value         Use of value is determined by the msgType
 */
Media.onStatus = function(id, msgType, value) {

    var media = mediaObjects[id];

    if (media) {
        switch(msgType) {
            case Media.MEDIA_STATE :
                if (media.statusCallback) {
                    media.statusCallback(value);
                }
                if (value == Media.MEDIA_STOPPED) {
                    if (media.successCallback) {
                        media.successCallback();
                    }
                }
                break;
            case Media.MEDIA_DURATION :
                media._duration = value;
                break;
            case Media.MEDIA_ERROR :
                if (media.errorCallback) {
                    media.errorCallback(value);
                }
                break;
            case Media.MEDIA_POSITION :
                media._position = Number(value);
                break;
            default :
                if (console.error) {
                    console.error("Unhandled Media.onStatus :: " + msgType);
                }
                break;
        }
    } else if (console.error) {
        console.error("Received Media.onStatus callback for unknown media :: " + id);
    }

};

module.exports = Media;

function onMessageFromNative(msg) {
    if (msg.action == 'status') {
        Media.onStatus(msg.status.id, msg.status.msgType, msg.status.value);
    } else {
        throw new Error('Unknown media action' + msg.action);
    }
}

if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

    var channel = require('cordova/channel');

    channel.createSticky('onMediaPluginReady');
    channel.waitForInitialization('onMediaPluginReady');

    channel.onCordovaReady.subscribe(function() {
        exec(onMessageFromNative, undefined, 'Media', 'messageChannel', []);
        channel.initializationComplete('onMediaPluginReady');
    });
}

});

/** plugins\cordova-plugin-splashscreen\www\splashscreen.js */

cordova.define("cordova-plugin-splashscreen.SplashScreen", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

var splashscreen = {
    show:function() {
        exec(null, null, "SplashScreen", "show", []);
    },
    hide:function() {
        exec(null, null, "SplashScreen", "hide", []);
    }
};

module.exports = splashscreen;

});

/** plugins\cordova-plugin-file\www\DirectoryEntry.js */

cordova.define("cordova-plugin-file.DirectoryEntry", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    Entry = require('./Entry'),
    FileError = require('./FileError'),
    DirectoryReader = require('./DirectoryReader');

/**
 * An interface representing a directory on the file system.
 *
 * {boolean} isFile always false (readonly)
 * {boolean} isDirectory always true (readonly)
 * {DOMString} name of the directory, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the directory (readonly)
 * {FileSystem} filesystem on which the directory resides (readonly)
 */
var DirectoryEntry = function(name, fullPath, fileSystem, nativeURL) {

    // add trailing slash if it is missing
    if ((fullPath) && !/\/$/.test(fullPath)) {
        fullPath += "/";
    }
    // add trailing slash if it is missing
    if (nativeURL && !/\/$/.test(nativeURL)) {
        nativeURL += "/";
    }
    DirectoryEntry.__super__.constructor.call(this, false, true, name, fullPath, fileSystem, nativeURL);
};

utils.extend(DirectoryEntry, Entry);

/**
 * Creates a new DirectoryReader to read entries from this directory
 */
DirectoryEntry.prototype.createReader = function() {
    return new DirectoryReader(this.toInternalURL());
};

/**
 * Creates or looks up a directory
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a directory
 * @param {Flags} options to create or exclusively create the directory
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getDirectory = function(path, options, successCallback, errorCallback) {
    argscheck.checkArgs('sOFF', 'DirectoryEntry.getDirectory', arguments);
    var fs = this.filesystem;
    var win = successCallback && function(result) {
        var entry = new DirectoryEntry(result.name, result.fullPath, fs, result.nativeURL);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getDirectory", [this.toInternalURL(), path, options]);
};

/**
 * Deletes a directory and all of it's contents
 *
 * @param {Function} successCallback is called with no parameters
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.removeRecursively = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'DirectoryEntry.removeRecursively', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(successCallback, fail, "File", "removeRecursively", [this.toInternalURL()]);
};

/**
 * Creates or looks up a file
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a file
 * @param {Flags} options to create or exclusively create the file
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getFile = function(path, options, successCallback, errorCallback) {
    argscheck.checkArgs('sOFF', 'DirectoryEntry.getFile', arguments);
    var fs = this.filesystem;
    var win = successCallback && function(result) {
        var FileEntry = require('./FileEntry');
        var entry = new FileEntry(result.name, result.fullPath, fs, result.nativeURL);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getFile", [this.toInternalURL(), path, options]);
};

module.exports = DirectoryEntry;

});

/** plugins\cordova-plugin-file\www\DirectoryReader.js */

cordova.define("cordova-plugin-file.DirectoryReader", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    FileError = require('./FileError') ;

/**
 * An interface that lists the files and directories in a directory.
 */
function DirectoryReader(localURL) {
    this.localURL = localURL || null;
    this.hasReadEntries = false;
}

/**
 * Returns a list of entries from a directory.
 *
 * @param {Function} successCallback is called with a list of entries
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
    // If we've already read and passed on this directory's entries, return an empty list.
    if (this.hasReadEntries) {
        successCallback([]);
        return;
    }
    var reader = this;
    var win = typeof successCallback !== 'function' ? null : function(result) {
        var retVal = [];
        for (var i=0; i<result.length; i++) {
            var entry = null;
            if (result[i].isDirectory) {
                entry = new (require('./DirectoryEntry'))();
            }
            else if (result[i].isFile) {
                entry = new (require('./FileEntry'))();
            }
            entry.isDirectory = result[i].isDirectory;
            entry.isFile = result[i].isFile;
            entry.name = result[i].name;
            entry.fullPath = result[i].fullPath;
            entry.filesystem = new (require('./FileSystem'))(result[i].filesystemName);
            entry.nativeURL = result[i].nativeURL;
            retVal.push(entry);
        }
        reader.hasReadEntries = true;
        successCallback(retVal);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "readEntries", [this.localURL]);
};

module.exports = DirectoryReader;

});

/** plugins\cordova-plugin-file\www\Entry.js */

cordova.define("cordova-plugin-file.Entry", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    FileError = require('./FileError'),
    Metadata = require('./Metadata');

/**
 * Represents a file or directory on the local file system.
 *
 * @param isFile
 *            {boolean} true if Entry is a file (readonly)
 * @param isDirectory
 *            {boolean} true if Entry is a directory (readonly)
 * @param name
 *            {DOMString} name of the file or directory, excluding the path
 *            leading to it (readonly)
 * @param fullPath
 *            {DOMString} the absolute full path to the file or directory
 *            (readonly)
 * @param fileSystem
 *            {FileSystem} the filesystem on which this entry resides
 *            (readonly)
 * @param nativeURL
 *            {DOMString} an alternate URL which can be used by native
 *            webview controls, for example media players.
 *            (optional, readonly)
 */
function Entry(isFile, isDirectory, name, fullPath, fileSystem, nativeURL) {
    this.isFile = !!isFile;
    this.isDirectory = !!isDirectory;
    this.name = name || '';
    this.fullPath = fullPath || '';
    this.filesystem = fileSystem || null;
    this.nativeURL = nativeURL || null;
}

/**
 * Look up the metadata of the entry.
 *
 * @param successCallback
 *            {Function} is called with a Metadata object
 * @param errorCallback
 *            {Function} is called with a FileError
 */
Entry.prototype.getMetadata = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.getMetadata', arguments);
    var success = successCallback && function(entryMetadata) {
        var metadata = new Metadata({
            size: entryMetadata.size,
            modificationTime: entryMetadata.lastModifiedDate
        });
        successCallback(metadata);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(success, fail, "File", "getFileMetadata", [this.toInternalURL()]);
};

/**
 * Set the metadata of the entry.
 *
 * @param successCallback
 *            {Function} is called with a Metadata object
 * @param errorCallback
 *            {Function} is called with a FileError
 * @param metadataObject
 *            {Object} keys and values to set
 */
Entry.prototype.setMetadata = function(successCallback, errorCallback, metadataObject) {
    argscheck.checkArgs('FFO', 'Entry.setMetadata', arguments);
    exec(successCallback, errorCallback, "File", "setMetadata", [this.toInternalURL(), metadataObject]);
};

/**
 * Move a file or directory to a new location.
 *
 * @param parent
 *            {DirectoryEntry} the directory to which to move this entry
 * @param newName
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new DirectoryEntry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.moveTo = function(parent, newName, successCallback, errorCallback) {
    argscheck.checkArgs('oSFF', 'Entry.moveTo', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    var srcURL = this.toInternalURL(),
        // entry name
        name = newName || this.name,
        success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var newFSName = entry.filesystemName || (entry.filesystem && entry.filesystem.name);
                    var fs = newFSName ? new FileSystem(newFSName, { name: "", fullPath: "/" }) : new FileSystem(parent.filesystem.name, { name: "", fullPath: "/" });
                    var result = (entry.isDirectory) ? new (require('./DirectoryEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL) : new (require('cordova-plugin-file.FileEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL);
                    successCallback(result);
                }
            }
            else {
                // no Entry object returned
                if (fail) {
                    fail(FileError.NOT_FOUND_ERR);
                }
            }
        };

    // copy
    exec(success, fail, "File", "moveTo", [srcURL, parent.toInternalURL(), name]);
};

/**
 * Copy a directory to a different location.
 *
 * @param parent
 *            {DirectoryEntry} the directory to which to copy the entry
 * @param newName
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new Entry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.copyTo = function(parent, newName, successCallback, errorCallback) {
    argscheck.checkArgs('oSFF', 'Entry.copyTo', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    var srcURL = this.toInternalURL(),
        // entry name
        name = newName || this.name,
        // success callback
        success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var newFSName = entry.filesystemName || (entry.filesystem && entry.filesystem.name);
                    var fs = newFSName ? new FileSystem(newFSName, { name: "", fullPath: "/" }) : new FileSystem(parent.filesystem.name, { name: "", fullPath: "/" });
                    var result = (entry.isDirectory) ? new (require('./DirectoryEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL) : new (require('cordova-plugin-file.FileEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL);
                    successCallback(result);
                }
            }
            else {
                // no Entry object returned
                if (fail) {
                    fail(FileError.NOT_FOUND_ERR);
                }
            }
        };

    // copy
    exec(success, fail, "File", "copyTo", [srcURL, parent.toInternalURL(), name]);
};

/**
 * Return a URL that can be passed across the bridge to identify this entry.
 */
Entry.prototype.toInternalURL = function() {
    if (this.filesystem && this.filesystem.__format__) {
      return this.filesystem.__format__(this.fullPath, this.nativeURL);
    }
};

/**
 * Return a URL that can be used to identify this entry.
 * Use a URL that can be used to as the src attribute of a <video> or
 * <audio> tag. If that is not possible, construct a cdvfile:// URL.
 */
Entry.prototype.toURL = function() {
    if (this.nativeURL) {
      return this.nativeURL;
    }
    // fullPath attribute may contain the full URL in the case that
    // toInternalURL fails.
    return this.toInternalURL() || "file://localhost" + this.fullPath;
};

/**
 * Backwards-compatibility: In v1.0.0 - 1.0.2, .toURL would only return a
 * cdvfile:// URL, and this method was necessary to obtain URLs usable by the
 * webview.
 * See CB-6051, CB-6106, CB-6117, CB-6152, CB-6199, CB-6201, CB-6243, CB-6249,
 * and CB-6300.
 */
Entry.prototype.toNativeURL = function() {
    console.log("DEPRECATED: Update your code to use 'toURL'");
    return this.toURL();
};

/**
 * Returns a URI that can be used to identify this entry.
 *
 * @param {DOMString} mimeType for a FileEntry, the mime type to be used to interpret the file, when loaded through this URI.
 * @return uri
 */
Entry.prototype.toURI = function(mimeType) {
    console.log("DEPRECATED: Update your code to use 'toURL'");
    return this.toURL();
};

/**
 * Remove a file or directory. It is an error to attempt to delete a
 * directory that is not empty. It is an error to attempt to delete a
 * root directory of a file system.
 *
 * @param successCallback {Function} called with no parameters
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.remove = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.remove', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(successCallback, fail, "File", "remove", [this.toInternalURL()]);
};

/**
 * Look up the parent DirectoryEntry of this entry.
 *
 * @param successCallback {Function} called with the parent DirectoryEntry object
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.getParent = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.getParent', arguments);
    var fs = this.filesystem;
    var win = successCallback && function(result) {
        var DirectoryEntry = require('./DirectoryEntry');
        var entry = new DirectoryEntry(result.name, result.fullPath, fs, result.nativeURL);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getParent", [this.toInternalURL()]);
};

module.exports = Entry;

});

/** plugins\cordova-plugin-file\www\File.js */

cordova.define("cordova-plugin-file.File", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Constructor.
 * name {DOMString} name of the file, without path information
 * fullPath {DOMString} the full path of the file, including the name
 * type {DOMString} mime type
 * lastModifiedDate {Date} last modified date
 * size {Number} size of the file in bytes
 */

var File = function(name, localURL, type, lastModifiedDate, size){
    this.name = name || '';
    this.localURL = localURL || null;
    this.type = type || null;
    this.lastModified = lastModifiedDate || null;
    // For backwards compatibility, store the timestamp in lastModifiedDate as well
    this.lastModifiedDate = lastModifiedDate || null;
    this.size = size || 0;

    // These store the absolute start and end for slicing the file.
    this.start = 0;
    this.end = this.size;
};

/**
 * Returns a "slice" of the file. Since Cordova Files don't contain the actual
 * content, this really returns a File with adjusted start and end.
 * Slices of slices are supported.
 * start {Number} The index at which to start the slice (inclusive).
 * end {Number} The index at which to end the slice (exclusive).
 */
File.prototype.slice = function(start, end) {
    var size = this.end - this.start;
    var newStart = 0;
    var newEnd = size;
    if (arguments.length) {
        if (start < 0) {
            newStart = Math.max(size + start, 0);
        } else {
            newStart = Math.min(size, start);
        }
    }

    if (arguments.length >= 2) {
        if (end < 0) {
            newEnd = Math.max(size + end, 0);
        } else {
            newEnd = Math.min(end, size);
        }
    }

    var newFile = new File(this.name, this.localURL, this.type, this.lastModified, this.size);
    newFile.start = this.start + newStart;
    newFile.end = this.start + newEnd;
    return newFile;
};


module.exports = File;

});

/** plugins\cordova-plugin-file\www\FileEntry.js */

cordova.define("cordova-plugin-file.FileEntry", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    Entry = require('./Entry'),
    FileWriter = require('./FileWriter'),
    File = require('./File'),
    FileError = require('./FileError');

/**
 * An interface representing a file on the file system.
 *
 * {boolean} isFile always true (readonly)
 * {boolean} isDirectory always false (readonly)
 * {DOMString} name of the file, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the file (readonly)
 * {FileSystem} filesystem on which the file resides (readonly)
 */
var FileEntry = function(name, fullPath, fileSystem, nativeURL) {
    // remove trailing slash if it is present
    if (fullPath && /\/$/.test(fullPath)) {
        fullPath = fullPath.substring(0, fullPath.length - 1);
    }
    if (nativeURL && /\/$/.test(nativeURL)) {
        nativeURL = nativeURL.substring(0, nativeURL.length - 1);
    }

    FileEntry.__super__.constructor.apply(this, [true, false, name, fullPath, fileSystem, nativeURL]);
};

utils.extend(FileEntry, Entry);

/**
 * Creates a new FileWriter associated with the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new FileWriter
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.createWriter = function(successCallback, errorCallback) {
    this.file(function(filePointer) {
        var writer = new FileWriter(filePointer);

        if (writer.localURL === null || writer.localURL === "") {
            if (errorCallback) {
                errorCallback(new FileError(FileError.INVALID_STATE_ERR));
            }
        } else {
            if (successCallback) {
                successCallback(writer);
            }
        }
    }, errorCallback);
};

/**
 * Returns a File that represents the current state of the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new File object
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.file = function(successCallback, errorCallback) {
    var localURL = this.toInternalURL();
    var win = successCallback && function(f) {
        var file = new File(f.name, localURL, f.type, f.lastModifiedDate, f.size);
        successCallback(file);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getFileMetadata", [localURL]);
};


module.exports = FileEntry;

});

/** plugins\cordova-plugin-file\www\FileError.js */

cordova.define("cordova-plugin-file.FileError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * FileError
 */
function FileError(error) {
  this.code = error || null;
}

// File error codes
// Found in DOMException
FileError.NOT_FOUND_ERR = 1;
FileError.SECURITY_ERR = 2;
FileError.ABORT_ERR = 3;

// Added by File API specification
FileError.NOT_READABLE_ERR = 4;
FileError.ENCODING_ERR = 5;
FileError.NO_MODIFICATION_ALLOWED_ERR = 6;
FileError.INVALID_STATE_ERR = 7;
FileError.SYNTAX_ERR = 8;
FileError.INVALID_MODIFICATION_ERR = 9;
FileError.QUOTA_EXCEEDED_ERR = 10;
FileError.TYPE_MISMATCH_ERR = 11;
FileError.PATH_EXISTS_ERR = 12;

module.exports = FileError;

});

/** plugins\cordova-plugin-file\www\FileReader.js */

cordova.define("cordova-plugin-file.FileReader", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    modulemapper = require('cordova/modulemapper'),
    utils = require('cordova/utils'),
    FileError = require('./FileError'),
    ProgressEvent = require('./ProgressEvent'),
    origFileReader = modulemapper.getOriginalSymbol(window, 'FileReader');

/**
 * This class reads the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To read from the SD card, the file name is "sdcard/my_file.txt"
 * @constructor
 */
var FileReader = function() {
    this._readyState = 0;
    this._error = null;
    this._result = null;
    this._progress = null;
    this._localURL = '';
    this._realReader = origFileReader ? new origFileReader() : {};
};

/**
 * Defines the maximum size to read at a time via the native API. The default value is a compromise between
 * minimizing the overhead of many exec() calls while still reporting progress frequently enough for large files.
 * (Note attempts to allocate more than a few MB of contiguous memory on the native side are likely to cause
 * OOM exceptions, while the JS engine seems to have fewer problems managing large strings or ArrayBuffers.)
 */
FileReader.READ_CHUNK_SIZE = 256*1024;

// States
FileReader.EMPTY = 0;
FileReader.LOADING = 1;
FileReader.DONE = 2;

utils.defineGetter(FileReader.prototype, 'readyState', function() {
    return this._localURL ? this._readyState : this._realReader.readyState;
});

utils.defineGetter(FileReader.prototype, 'error', function() {
    return this._localURL ? this._error: this._realReader.error;
});

utils.defineGetter(FileReader.prototype, 'result', function() {
    return this._localURL ? this._result: this._realReader.result;
});

function defineEvent(eventName) {
    utils.defineGetterSetter(FileReader.prototype, eventName, function() {
        return this._realReader[eventName] || null;
    }, function(value) {
        this._realReader[eventName] = value;
    });
}
defineEvent('onloadstart');    // When the read starts.
defineEvent('onprogress');     // While reading (and decoding) file or fileBlob data, and reporting partial file data (progress.loaded/progress.total)
defineEvent('onload');         // When the read has successfully completed.
defineEvent('onerror');        // When the read has failed (see errors).
defineEvent('onloadend');      // When the request has completed (either in success or failure).
defineEvent('onabort');        // When the read has been aborted. For instance, by invoking the abort() method.

function initRead(reader, file) {
    // Already loading something
    if (reader.readyState == FileReader.LOADING) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }

    reader._result = null;
    reader._error = null;
    reader._progress = 0;
    reader._readyState = FileReader.LOADING;

    if (typeof file.localURL == 'string') {
        reader._localURL = file.localURL;
    } else {
        reader._localURL = '';
        return true;
    }

    if (reader.onloadstart) {
        reader.onloadstart(new ProgressEvent("loadstart", {target:reader}));
    }
}

/**
 * Callback used by the following read* functions to handle incremental or final success.
 * Must be bound to the FileReader's this along with all but the last parameter,
 * e.g. readSuccessCallback.bind(this, "readAsText", "UTF-8", offset, totalSize, accumulate)
 * @param readType The name of the read function to call.
 * @param encoding Text encoding, or null if this is not a text type read.
 * @param offset Starting offset of the read.
 * @param totalSize Total number of bytes or chars to read.
 * @param accumulate A function that takes the callback result and accumulates it in this._result.
 * @param r Callback result returned by the last read exec() call, or null to begin reading.
 */
function readSuccessCallback(readType, encoding, offset, totalSize, accumulate, r) {
    if (this._readyState === FileReader.DONE) {
        return;
    }

    var CHUNK_SIZE = FileReader.READ_CHUNK_SIZE;
    if (readType === 'readAsDataURL') {
        // Windows proxy does not support reading file slices as Data URLs
        // so read the whole file at once.
        CHUNK_SIZE = cordova.platformId === 'windows' ? totalSize :
            // Calculate new chunk size for data URLs to be multiply of 3
            // Otherwise concatenated base64 chunks won't be valid base64 data
            FileReader.READ_CHUNK_SIZE - (FileReader.READ_CHUNK_SIZE % 3) + 3;
    }

    if (typeof r !== "undefined") {
        accumulate(r);
        this._progress = Math.min(this._progress + CHUNK_SIZE, totalSize);

        if (typeof this.onprogress === "function") {
            this.onprogress(new ProgressEvent("progress", {loaded:this._progress, total:totalSize}));
        }
    }

    if (typeof r === "undefined" || this._progress < totalSize) {
        var execArgs = [
            this._localURL,
            offset + this._progress,
            offset + this._progress + Math.min(totalSize - this._progress, CHUNK_SIZE)];
        if (encoding) {
            execArgs.splice(1, 0, encoding);
        }
        exec(
            readSuccessCallback.bind(this, readType, encoding, offset, totalSize, accumulate),
            readFailureCallback.bind(this),
            "File", readType, execArgs);
    } else {
        this._readyState = FileReader.DONE;

        if (typeof this.onload === "function") {
            this.onload(new ProgressEvent("load", {target:this}));
        }

        if (typeof this.onloadend === "function") {
            this.onloadend(new ProgressEvent("loadend", {target:this}));
        }
    }
}

/**
 * Callback used by the following read* functions to handle errors.
 * Must be bound to the FileReader's this, e.g. readFailureCallback.bind(this)
 */
function readFailureCallback(e) {
    if (this._readyState === FileReader.DONE) {
        return;
    }

    this._readyState = FileReader.DONE;
    this._result = null;
    this._error = new FileError(e);

    if (typeof this.onerror === "function") {
        this.onerror(new ProgressEvent("error", {target:this}));
    }

    if (typeof this.onloadend === "function") {
        this.onloadend(new ProgressEvent("loadend", {target:this}));
    }
}

/**
 * Abort reading file.
 */
FileReader.prototype.abort = function() {
    if (origFileReader && !this._localURL) {
        return this._realReader.abort();
    }
    this._result = null;

    if (this._readyState == FileReader.DONE || this._readyState == FileReader.EMPTY) {
      return;
    }

    this._readyState = FileReader.DONE;

    // If abort callback
    if (typeof this.onabort === 'function') {
        this.onabort(new ProgressEvent('abort', {target:this}));
    }
    // If load end callback
    if (typeof this.onloadend === 'function') {
        this.onloadend(new ProgressEvent('loadend', {target:this}));
    }
};

/**
 * Read text file.
 *
 * @param file          {File} File object containing file properties
 * @param encoding      [Optional] (see http://www.iana.org/assignments/character-sets)
 */
FileReader.prototype.readAsText = function(file, encoding) {
    if (initRead(this, file)) {
        return this._realReader.readAsText(file, encoding);
    }

    // Default encoding is UTF-8
    var enc = encoding ? encoding : "UTF-8";

    var totalSize = file.end - file.start;
    readSuccessCallback.bind(this)("readAsText", enc, file.start, totalSize, function(r) {
        if (this._progress === 0) {
            this._result = "";
        }
        this._result += r;
    }.bind(this));
};


/**
 * Read file and return data as a base64 encoded data url.
 * A data url is of the form:
 *      data:[<mediatype>][;base64],<data>
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsDataURL = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsDataURL(file);
    }

    var totalSize = file.end - file.start;
    readSuccessCallback.bind(this)("readAsDataURL", null, file.start, totalSize, function(r) {
        var commaIndex = r.indexOf(',');
        if (this._progress === 0) {
            this._result = r;
        } else {
            this._result += r.substring(commaIndex + 1);
        }
    }.bind(this));
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsBinaryString = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsBinaryString(file);
    }

    var totalSize = file.end - file.start;
    readSuccessCallback.bind(this)("readAsBinaryString", null, file.start, totalSize, function(r) {
        if (this._progress === 0) {
            this._result = "";
        }
        this._result += r;
    }.bind(this));
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsArrayBuffer = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsArrayBuffer(file);
    }

    var totalSize = file.end - file.start;
    readSuccessCallback.bind(this)("readAsArrayBuffer", null, file.start, totalSize, function(r) {
        var resultArray = (this._progress === 0 ? new Uint8Array(totalSize) : new Uint8Array(this._result));
        resultArray.set(new Uint8Array(r), this._progress);
        this._result = resultArray.buffer;
    }.bind(this));
};

module.exports = FileReader;

});

/** plugins\cordova-plugin-file\www\FileSystem.js */

cordova.define("cordova-plugin-file.FileSystem", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var DirectoryEntry = require('./DirectoryEntry');

/**
 * An interface representing a file system
 *
 * @constructor
 * {DOMString} name the unique name of the file system (readonly)
 * {DirectoryEntry} root directory of the file system (readonly)
 */
var FileSystem = function(name, root) {
    this.name = name;
    if (root) {
        this.root = new DirectoryEntry(root.name, root.fullPath, this, root.nativeURL);
    } else {
        this.root = new DirectoryEntry(this.name, '/', this);
    }
};

FileSystem.prototype.__format__ = function(fullPath, nativeUrl) {
    return fullPath;
};

FileSystem.prototype.toJSON = function() {
    return "<FileSystem: " + this.name + ">";
};

// Use instead of encodeURI() when encoding just the path part of a URI rather than an entire URI.
FileSystem.encodeURIPath = function(path) {
    // Because # is a valid filename character, it must be encoded to prevent part of the
    // path from being parsed as a URI fragment.
    return encodeURI(path).replace(/#/g, '%23');
};

module.exports = FileSystem;

});

/** plugins\cordova-plugin-file\www\FileUploadOptions.js */

cordova.define("cordova-plugin-file.FileUploadOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Options to customize the HTTP request used to upload files.
 * @constructor
 * @param fileKey {String}   Name of file request parameter.
 * @param fileName {String}  Filename to be used by the server. Defaults to image.jpg.
 * @param mimeType {String}  Mimetype of the uploaded file. Defaults to image/jpeg.
 * @param params {Object}    Object with key: value params to send to the server.
 * @param headers {Object}   Keys are header names, values are header values. Multiple
 *                           headers of the same name are not supported.
 */
var FileUploadOptions = function(fileKey, fileName, mimeType, params, headers, httpMethod) {
    this.fileKey = fileKey || null;
    this.fileName = fileName || null;
    this.mimeType = mimeType || null;
    this.params = params || null;
    this.headers = headers || null;
    this.httpMethod = httpMethod || null;
};

module.exports = FileUploadOptions;

});

/** plugins\cordova-plugin-file\www\FileUploadResult.js */

cordova.define("cordova-plugin-file.FileUploadResult", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * FileUploadResult
 * @constructor
 */
module.exports = function FileUploadResult(size, code, content) {
	this.bytesSent = size;
	this.responseCode = code;
	this.response = content;
 };
});

/** plugins\cordova-plugin-file\www\FileWriter.js */

cordova.define("cordova-plugin-file.FileWriter", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    FileError = require('./FileError'),
    ProgressEvent = require('./ProgressEvent');

/**
 * This class writes to the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To write to the SD card, the file name is "sdcard/my_file.txt"
 *
 * @constructor
 * @param file {File} File object containing file properties
 * @param append if true write to the end of the file, otherwise overwrite the file
 */
var FileWriter = function(file) {
    this.fileName = "";
    this.length = 0;
    if (file) {
        this.localURL = file.localURL || file;
        this.length = file.size || 0;
    }
    // default is to write at the beginning of the file
    this.position = 0;

    this.readyState = 0; // EMPTY

    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onwritestart = null;   // When writing starts
    this.onprogress = null;     // While writing the file, and reporting partial file data
    this.onwrite = null;        // When the write has successfully completed.
    this.onwriteend = null;     // When the request has completed (either in success or failure).
    this.onabort = null;        // When the write has been aborted. For instance, by invoking the abort() method.
    this.onerror = null;        // When the write has failed (see errors).
};

// States
FileWriter.INIT = 0;
FileWriter.WRITING = 1;
FileWriter.DONE = 2;

/**
 * Abort writing file.
 */
FileWriter.prototype.abort = function() {
    // check for invalid state
    if (this.readyState === FileWriter.DONE || this.readyState === FileWriter.INIT) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // set error
    this.error = new FileError(FileError.ABORT_ERR);

    this.readyState = FileWriter.DONE;

    // If abort callback
    if (typeof this.onabort === "function") {
        this.onabort(new ProgressEvent("abort", {"target":this}));
    }

    // If write end callback
    if (typeof this.onwriteend === "function") {
        this.onwriteend(new ProgressEvent("writeend", {"target":this}));
    }
};

/**
 * Writes data to the file
 *
 * @param data text or blob to be written
 * @param isPendingBlobReadResult {Boolean} true if the data is the pending blob read operation result
 */
FileWriter.prototype.write = function(data, isPendingBlobReadResult) {

    var that=this;
    var supportsBinary = (typeof window.Blob !== 'undefined' && typeof window.ArrayBuffer !== 'undefined');
    var isProxySupportBlobNatively = (cordova.platformId === "windows8" || cordova.platformId === "windows");
    var isBinary;

    // Check to see if the incoming data is a blob
    if (data instanceof File || (!isProxySupportBlobNatively && supportsBinary && data instanceof Blob)) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
            // Call this method again, with the arraybuffer as argument
            FileWriter.prototype.write.call(that, this.result, true /* isPendingBlobReadResult */);
        };
        fileReader.onerror = function () {
            // DONE state
            that.readyState = FileWriter.DONE;

            // Save error
            that.error = this.error;

            // If onerror callback
            if (typeof that.onerror === "function") {
                that.onerror(new ProgressEvent("error", {"target":that}));
            }

            // If onwriteend callback
            if (typeof that.onwriteend === "function") {
                that.onwriteend(new ProgressEvent("writeend", {"target":that}));
            }
        };

        // WRITING state
        this.readyState = FileWriter.WRITING;

        if (supportsBinary) {
            fileReader.readAsArrayBuffer(data);
        } else {
            fileReader.readAsText(data);
        }
        return;
    }

    // Mark data type for safer transport over the binary bridge
    isBinary = supportsBinary && (data instanceof ArrayBuffer);
    if (isBinary && cordova.platformId === "windowsphone") {
        // create a plain array, using the keys from the Uint8Array view so that we can serialize it
        data = Array.apply(null, new Uint8Array(data));
    }
    
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING && !isPendingBlobReadResult) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":me}));
    }

    // Write file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // position always increases by bytes written because file would be extended
            me.position += r;
            // The length of the file is now where we are done writing.

            me.length = me.position;

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite(new ProgressEvent("write", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Save error
            me.error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        }, "File", "write", [this.localURL, data, this.position, isBinary]);
};

/**
 * Moves the file pointer to the location specified.
 *
 * If the offset is a negative number the position of the file
 * pointer is rewound.  If the offset is greater than the file
 * size the position is set to the end of the file.
 *
 * @param offset is the location to move the file pointer to.
 */
FileWriter.prototype.seek = function(offset) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    if (!offset && offset !== 0) {
        return;
    }

    // See back from end of file.
    if (offset < 0) {
        this.position = Math.max(offset + this.length, 0);
    }
    // Offset is bigger than file size so set position
    // to the end of the file.
    else if (offset > this.length) {
        this.position = this.length;
    }
    // Offset is between 0 and file size so set the position
    // to start writing.
    else {
        this.position = offset;
    }
};

/**
 * Truncates the file to the size specified.
 *
 * @param size to chop the file at.
 */
FileWriter.prototype.truncate = function(size) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":this}));
    }

    // Write file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Update the length of the file
            me.length = r;
            me.position = Math.min(me.position, r);

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite(new ProgressEvent("write", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Save error
            me.error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        }, "File", "truncate", [this.localURL, size]);
};

module.exports = FileWriter;

});

/** plugins\cordova-plugin-file\www\Flags.js */

cordova.define("cordova-plugin-file.Flags", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Supplies arguments to methods that lookup or create files and directories.
 *
 * @param create
 *            {boolean} file or directory if it doesn't exist
 * @param exclusive
 *            {boolean} used with create; if true the command will fail if
 *            target path exists
 */
function Flags(create, exclusive) {
    this.create = create || false;
    this.exclusive = exclusive || false;
}

module.exports = Flags;

});

/** plugins\cordova-plugin-file\www\LocalFileSystem.js */

cordova.define("cordova-plugin-file.LocalFileSystem", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

exports.TEMPORARY = 0;
exports.PERSISTENT = 1;

});

/** plugins\cordova-plugin-file\www\Metadata.js */

cordova.define("cordova-plugin-file.Metadata", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * Information about the state of the file or directory
 *
 * {Date} modificationTime (readonly)
 */
var Metadata = function(metadata) {
    if (typeof metadata == "object") {
        this.modificationTime = new Date(metadata.modificationTime);
        this.size = metadata.size || 0;
    } else if (typeof metadata == "undefined") {
        this.modificationTime = null;
        this.size = 0;
    } else {
        /* Backwards compatiblity with platforms that only return a timestamp */
        this.modificationTime = new Date(metadata);
    }
};

module.exports = Metadata;

});

/** plugins\cordova-plugin-file\www\ProgressEvent.js */

cordova.define("cordova-plugin-file.ProgressEvent", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

// If ProgressEvent exists in global context, use it already, otherwise use our own polyfill
// Feature test: See if we can instantiate a native ProgressEvent;
// if so, use that approach,
// otherwise fill-in with our own implementation.
//
// NOTE: right now we always fill in with our own. Down the road would be nice if we can use whatever is native in the webview.
var ProgressEvent = (function() {
    /*
    var createEvent = function(data) {
        var event = document.createEvent('Events');
        event.initEvent('ProgressEvent', false, false);
        if (data) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    event[i] = data[i];
                }
            }
            if (data.target) {
                // TODO: cannot call <some_custom_object>.dispatchEvent
                // need to first figure out how to implement EventTarget
            }
        }
        return event;
    };
    try {
        var ev = createEvent({type:"abort",target:document});
        return function ProgressEvent(type, data) {
            data.type = type;
            return createEvent(data);
        };
    } catch(e){
    */
        return function ProgressEvent(type, dict) {
            this.type = type;
            this.bubbles = false;
            this.cancelBubble = false;
            this.cancelable = false;
            this.lengthComputable = false;
            this.loaded = dict && dict.loaded ? dict.loaded : 0;
            this.total = dict && dict.total ? dict.total : 0;
            this.target = dict && dict.target ? dict.target : null;
        };
    //}
})();

module.exports = ProgressEvent;

});

/** plugins\cordova-plugin-file\www\fileSystems.js */

cordova.define("cordova-plugin-file.fileSystems", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

// Overridden by Android, BlackBerry 10 and iOS to populate fsMap.
module.exports.getFs = function(name, callback) {
    callback(null);
};

});

/** plugins\cordova-plugin-file\www\requestFileSystem.js */

cordova.define("cordova-plugin-file.requestFileSystem", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

(function() {
    //For browser platform: not all browsers use this file.
    function checkBrowser() {
        if (cordova.platformId === "browser" && require('./isChrome')()) {
            module.exports = window.requestFileSystem || window.webkitRequestFileSystem;
            return true;
        }
        return false;
    }
    if (checkBrowser()) {
        return;
    }

    var argscheck = require('cordova/argscheck'),
        FileError = require('./FileError'),
        FileSystem = require('./FileSystem'),
        exec = require('cordova/exec');
    var fileSystems = require('./fileSystems');

    /**
     * Request a file system in which to store application data.
     * @param type  local file system type
     * @param size  indicates how much storage space, in bytes, the application expects to need
     * @param successCallback  invoked with a FileSystem object
     * @param errorCallback  invoked if error occurs retrieving file system
     */
    var requestFileSystem = function(type, size, successCallback, errorCallback) {
        argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
        var fail = function(code) {
            if (errorCallback) {
                errorCallback(new FileError(code));
            }
        };

        if (type < 0) {
            fail(FileError.SYNTAX_ERR);
        } else {
            // if successful, return a FileSystem object
            var success = function(file_system) {
                if (file_system) {
                    if (successCallback) {
                        fileSystems.getFs(file_system.name, function(fs) {
                            // This should happen only on platforms that haven't implemented requestAllFileSystems (windows)
                            if (!fs) {
                                fs = new FileSystem(file_system.name, file_system.root);
                            }
                            successCallback(fs);
                        });
                    }
                }
                else {
                    // no FileSystem object returned
                    fail(FileError.NOT_FOUND_ERR);
                }
            };
            exec(success, fail, "File", "requestFileSystem", [type, size]);
        }
    };

    module.exports = requestFileSystem;
})();

});

/** plugins\cordova-plugin-file\www\resolveLocalFileSystemURI.js */

cordova.define("cordova-plugin-file.resolveLocalFileSystemURI", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/
(function() {
    //For browser platform: not all browsers use overrided `resolveLocalFileSystemURL`.
    function checkBrowser() {
        if (cordova.platformId === "browser" && require('./isChrome')()) {
            module.exports.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
            return true;
        }
        return false;
    }
    if (checkBrowser()) {
        return;
    }

    var argscheck = require('cordova/argscheck'),
        DirectoryEntry = require('./DirectoryEntry'),
        FileEntry = require('./FileEntry'),
        FileError = require('./FileError'),
        exec = require('cordova/exec');
    var fileSystems = require('./fileSystems');

    /**
     * Look up file system Entry referred to by local URI.
     * @param {DOMString} uri  URI referring to a local file or directory
     * @param successCallback  invoked with Entry object corresponding to URI
     * @param errorCallback    invoked if error occurs retrieving file system entry
     */
    module.exports.resolveLocalFileSystemURL = module.exports.resolveLocalFileSystemURL || function(uri, successCallback, errorCallback) {
        argscheck.checkArgs('sFF', 'resolveLocalFileSystemURI', arguments);
        // error callback
        var fail = function(error) {
            if (errorCallback) {
                errorCallback(new FileError(error));
            }
        };
        // sanity check for 'not:valid:filename' or '/not:valid:filename'
        // file.spec.12 window.resolveLocalFileSystemURI should error (ENCODING_ERR) when resolving invalid URI with leading /.
        if(!uri || uri.split(":").length > 2) {
            setTimeout( function() {
                fail(FileError.ENCODING_ERR);
            },0);
            return;
        }
        // if successful, return either a file or directory entry
        var success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var fsName = entry.filesystemName || (entry.filesystem && entry.filesystem.name) || (entry.filesystem == window.PERSISTENT ? 'persistent' : 'temporary');
                    fileSystems.getFs(fsName, function(fs) {
                        // This should happen only on platforms that haven't implemented requestAllFileSystems (windows)
                        if (!fs) {
                            fs = new FileSystem(fsName, {name:"", fullPath:"/"});
                        }
                        var result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath, fs, entry.nativeURL) : new FileEntry(entry.name, entry.fullPath, fs, entry.nativeURL);
                        successCallback(result);
                    });
                }
            }
            else {
                // no Entry object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };

        exec(success, fail, "File", "resolveLocalFileSystemURI", [uri]);
    };

    module.exports.resolveLocalFileSystemURI = function() {
        console.log("resolveLocalFileSystemURI is deprecated. Please call resolveLocalFileSystemURL instead.");
        module.exports.resolveLocalFileSystemURL.apply(this, arguments);
    };
})();

});

/** plugins\cordova-plugin-file\www\browser\isChrome.js */

cordova.define("cordova-plugin-file.isChrome", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

module.exports = function () {
    // window.webkitRequestFileSystem and window.webkitResolveLocalFileSystemURL are available only in Chrome and
    // possibly a good flag to indicate that we're running in Chrome
    return window.webkitRequestFileSystem && window.webkitResolveLocalFileSystemURL;
};

});

/** plugins\cordova-plugin-file\www\android\FileSystem.js */

cordova.define("cordova-plugin-file.androidFileSystem", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

FILESYSTEM_PROTOCOL = "cdvfile";

module.exports = {
    __format__: function(fullPath, nativeUrl) {
        var path;
        var contentUrlMatch = /^content:\/\//.exec(nativeUrl);
        if (contentUrlMatch) {
            // When available, use the path from a native content URL, which was already encoded by Android.
            // This is necessary because JavaScript's encodeURI() does not encode as many characters as
            // Android, which can result in permission exceptions when the encoding of a content URI
            // doesn't match the string for which permission was originally granted.
            path = nativeUrl.substring(contentUrlMatch[0].length - 1);
        } else {
            path = FileSystem.encodeURIPath(fullPath);
            if (!/^\//.test(path)) {
                path = '/' + path;
            }
            
            var m = /\?.*/.exec(nativeUrl);
            if (m) {
                path += m[0];
            }
        }

        return FILESYSTEM_PROTOCOL + '://localhost/' + this.name + path;
    }
};


});

/** plugins\cordova-plugin-file\www\fileSystems-roots.js */

cordova.define("cordova-plugin-file.fileSystems-roots", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

// Map of fsName -> FileSystem.
var fsMap = null;
var FileSystem = require('./FileSystem');
var exec = require('cordova/exec');

// Overridden by Android, BlackBerry 10 and iOS to populate fsMap.
require('./fileSystems').getFs = function(name, callback) {
    function success(response) {
        fsMap = {};
        for (var i = 0; i < response.length; ++i) {
            var fsRoot = response[i];
            var fs = new FileSystem(fsRoot.filesystemName, fsRoot);
            fsMap[fs.name] = fs;
        }
        callback(fsMap[name]);
    }

    if (fsMap) {
        callback(fsMap[name]);
    } else {
        exec(success, null, "File", "requestAllFileSystems", []);
    }
};


});

/** plugins\cordova-plugin-file\www\fileSystemPaths.js */

cordova.define("cordova-plugin-file.fileSystemPaths", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');
var channel = require('cordova/channel');

exports.file = {
    // Read-only directory where the application is installed.
    applicationDirectory: null,
    // Root of app's private writable storage
    applicationStorageDirectory: null,
    // Where to put app-specific data files.
    dataDirectory: null,
    // Cached files that should survive app restarts.
    // Apps should not rely on the OS to delete files in here.
    cacheDirectory: null,
    // Android: the application space on external storage.
    externalApplicationStorageDirectory: null,
    // Android: Where to put app-specific data files on external storage.
    externalDataDirectory: null,
    // Android: the application cache on external storage.
    externalCacheDirectory: null,
    // Android: the external storage (SD card) root.
    externalRootDirectory: null,
    // iOS: Temp directory that the OS can clear at will.
    tempDirectory: null,
    // iOS: Holds app-specific files that should be synced (e.g. to iCloud).
    syncedDataDirectory: null,
    // iOS: Files private to the app, but that are meaningful to other applications (e.g. Office files)
    documentsDirectory: null,
    // BlackBerry10: Files globally available to all apps
    sharedDirectory: null
};

channel.waitForInitialization('onFileSystemPathsReady');
channel.onCordovaReady.subscribe(function() {
    function after(paths) {
        for (var k in paths) {
            exports.file[k] = paths[k];
        }
        channel.initializationComplete('onFileSystemPathsReady');
    }
    exec(after, null, 'File', 'requestAllPaths', []);
});


});

/** plugins\cordova-plugin-file-transfer\www\FileTransferError.js */

cordova.define("cordova-plugin-file-transfer.FileTransferError", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * FileTransferError
 * @constructor
 */
var FileTransferError = function(code, source, target, status, body, exception) {
    this.code = code || null;
    this.source = source || null;
    this.target = target || null;
    this.http_status = status || null;
    this.body = body || null;
    this.exception = exception || null;
};

FileTransferError.FILE_NOT_FOUND_ERR = 1;
FileTransferError.INVALID_URL_ERR = 2;
FileTransferError.CONNECTION_ERR = 3;
FileTransferError.ABORT_ERR = 4;
FileTransferError.NOT_MODIFIED_ERR = 5;

module.exports = FileTransferError;

});

/** plugins\cordova-plugin-file-transfer\www\FileTransfer.js */

cordova.define("cordova-plugin-file-transfer.FileTransfer", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/* global cordova, FileSystem */

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    FileTransferError = require('./FileTransferError'),
    ProgressEvent = require('cordova-plugin-file.ProgressEvent');

function newProgressEvent(result) {
    var pe = new ProgressEvent();
    pe.lengthComputable = result.lengthComputable;
    pe.loaded = result.loaded;
    pe.total = result.total;
    return pe;
}

function getUrlCredentials(urlString) {
    var credentialsPattern = /^https?\:\/\/(?:(?:(([^:@\/]*)(?::([^@\/]*))?)?@)?([^:\/?#]*)(?::(\d*))?).*$/,
        credentials = credentialsPattern.exec(urlString);

    return credentials && credentials[1];
}

function getBasicAuthHeader(urlString) {
    var header =  null;


    // This is changed due to MS Windows doesn't support credentials in http uris
    // so we detect them by regexp and strip off from result url
    // Proof: http://social.msdn.microsoft.com/Forums/windowsapps/en-US/a327cf3c-f033-4a54-8b7f-03c56ba3203f/windows-foundation-uri-security-problem

    if (window.btoa) {
        var credentials = getUrlCredentials(urlString);
        if (credentials) {
            var authHeader = "Authorization";
            var authHeaderValue = "Basic " + window.btoa(credentials);

            header = {
                name : authHeader,
                value : authHeaderValue
            };
        }
    }

    return header;
}

function convertHeadersToArray(headers) {
    var result = [];
    for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
            var headerValue = headers[header];
            result.push({
                name: header,
                value: headerValue.toString()
            });
        }
    }
    return result;
}

var idCounter = 0;

/**
 * FileTransfer uploads a file to a remote server.
 * @constructor
 */
var FileTransfer = function() {
    this._id = ++idCounter;
    this.onprogress = null; // optional callback
};

/**
* Given an absolute file path, uploads a file on the device to a remote server
* using a multipart HTTP request.
* @param filePath {String}           Full path of the file on the device
* @param server {String}             URL of the server to receive the file
* @param successCallback (Function}  Callback to be invoked when upload has completed
* @param errorCallback {Function}    Callback to be invoked upon error
* @param options {FileUploadOptions} Optional parameters such as file name and mimetype
* @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
*/
FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, trustAllHosts) {
    argscheck.checkArgs('ssFFO*', 'FileTransfer.upload', arguments);
    // check for options
    var fileKey = null;
    var fileName = null;
    var mimeType = null;
    var params = null;
    var chunkedMode = true;
    var headers = null;
    var httpMethod = null;
    var basicAuthHeader = getBasicAuthHeader(server);
    if (basicAuthHeader) {
        server = server.replace(getUrlCredentials(server) + '@', '');

        options = options || {};
        options.headers = options.headers || {};
        options.headers[basicAuthHeader.name] = basicAuthHeader.value;
    }

    if (options) {
        fileKey = options.fileKey;
        fileName = options.fileName;
        mimeType = options.mimeType;
        headers = options.headers;
        httpMethod = options.httpMethod || "POST";
        if (httpMethod.toUpperCase() == "PUT"){
            httpMethod = "PUT";
        } else {
            httpMethod = "POST";
        }
        if (options.chunkedMode !== null || typeof options.chunkedMode != "undefined") {
            chunkedMode = options.chunkedMode;
        }
        if (options.params) {
            params = options.params;
        }
        else {
            params = {};
        }
    }

    if (cordova.platformId === "windowsphone") {
        headers = headers && convertHeadersToArray(headers);
        params = params && convertHeadersToArray(params);
    }

    var fail = errorCallback && function(e) {
        var error = new FileTransferError(e.code, e.source, e.target, e.http_status, e.body, e.exception);
        errorCallback(error);
    };

    var self = this;
    var win = function(result) {
        if (typeof result.lengthComputable != "undefined") {
            if (self.onprogress) {
                self.onprogress(newProgressEvent(result));
            }
        } else {
            if (successCallback) {
                successCallback(result);
            }
        }
    };
    exec(win, fail, 'FileTransfer', 'upload', [filePath, server, fileKey, fileName, mimeType, params, trustAllHosts, chunkedMode, headers, this._id, httpMethod]);
};

/**
 * Downloads a file form a given URL and saves it to the specified directory.
 * @param source {String}          URL of the server to receive the file
 * @param target {String}         Full path of the file on the device
 * @param successCallback (Function}  Callback to be invoked when upload has completed
 * @param errorCallback {Function}    Callback to be invoked upon error
 * @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
 * @param options {FileDownloadOptions} Optional parameters such as headers
 */
FileTransfer.prototype.download = function(source, target, successCallback, errorCallback, trustAllHosts, options) {
    argscheck.checkArgs('ssFF*', 'FileTransfer.download', arguments);
    var self = this;

    var basicAuthHeader = getBasicAuthHeader(source);
    if (basicAuthHeader) {
        source = source.replace(getUrlCredentials(source) + '@', '');

        options = options || {};
        options.headers = options.headers || {};
        options.headers[basicAuthHeader.name] = basicAuthHeader.value;
    }

    var headers = null;
    if (options) {
        headers = options.headers || null;
    }

    if (cordova.platformId === "windowsphone" && headers) {
        headers = convertHeadersToArray(headers);
    }

    var win = function(result) {
        if (typeof result.lengthComputable != "undefined") {
            if (self.onprogress) {
                return self.onprogress(newProgressEvent(result));
            }
        } else if (successCallback) {
            var entry = null;
            if (result.isDirectory) {
                entry = new (require('cordova-plugin-file.DirectoryEntry'))();
            }
            else if (result.isFile) {
                entry = new (require('cordova-plugin-file.FileEntry'))();
            }
            entry.isDirectory = result.isDirectory;
            entry.isFile = result.isFile;
            entry.name = result.name;
            entry.fullPath = result.fullPath;
            entry.filesystem = new FileSystem(result.filesystemName || (result.filesystem == window.PERSISTENT ? 'persistent' : 'temporary'));
            entry.nativeURL = result.nativeURL;
            successCallback(entry);
        }
    };

    var fail = errorCallback && function(e) {
        var error = new FileTransferError(e.code, e.source, e.target, e.http_status, e.body, e.exception);
        errorCallback(error);
    };

    exec(win, fail, 'FileTransfer', 'download', [source, target, trustAllHosts, this._id, headers]);
};

/**
 * Aborts the ongoing file transfer on this object. The original error
 * callback for the file transfer will be called if necessary.
 */
FileTransfer.prototype.abort = function() {
    exec(null, null, 'FileTransfer', 'abort', [this._id]);
};

module.exports = FileTransfer;

});

/** plugins\cordova-plugin-device\www\device.js */

cordova.define("cordova-plugin-device.device", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version = null;
    this.uuid = null;
    this.cordova = null;
    this.model = null;
    this.manufacturer = null;
    this.isVirtual = null;
    this.serial = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getInfo(function(info) {
            //ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js
            //TODO: CB-5105 native implementations should not return info.cordova
            var buildLabel = cordova.version;
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.uuid = info.uuid;
            me.cordova = buildLabel;
            me.model = info.model;
            me.isVirtual = info.isVirtual;
            me.manufacturer = info.manufacturer || 'unknown';
            me.serial = info.serial || 'unknown';
            channel.onCordovaInfoReady.fire();
        },function(e) {
            me.available = false;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function(successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Device.getInfo', arguments);
    exec(successCallback, errorCallback, "Device", "getDeviceInfo", []);
};

module.exports = new Device();

});

/** plugins\cordova-plugin-dialogs\www\notification.js */

cordova.define("cordova-plugin-dialogs.notification", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');
var platform = require('cordova/platform');

/**
 * Provides access to notifications on the device.
 */

module.exports = {

    /**
     * Open a native alert dialog, with a customizable title and button text.
     *
     * @param {String} message              Message to print in the body of the alert
     * @param {Function} completeCallback   The callback that is called when user clicks on a button.
     * @param {String} title                Title of the alert dialog (default: Alert)
     * @param {String} buttonLabel          Label of the close button (default: OK)
     */
    alert: function(message, completeCallback, title, buttonLabel) {
        var _title = (typeof title === "string" ? title : "Alert");
        var _buttonLabel = (buttonLabel || "OK");
        exec(completeCallback, null, "Notification", "alert", [message, _title, _buttonLabel]);
    },

    /**
     * Open a native confirm dialog, with a customizable title and button text.
     * The result that the user selects is returned to the result callback.
     *
     * @param {String} message              Message to print in the body of the alert
     * @param {Function} resultCallback     The callback that is called when user clicks on a button.
     * @param {String} title                Title of the alert dialog (default: Confirm)
     * @param {Array} buttonLabels          Array of the labels of the buttons (default: ['OK', 'Cancel'])
     */
    confirm: function(message, resultCallback, title, buttonLabels) {
        var _title = (typeof title === "string" ? title : "Confirm");
        var _buttonLabels = (buttonLabels || ["OK", "Cancel"]);

        // Strings are deprecated!
        if (typeof _buttonLabels === 'string') {
            console.log("Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).");
        }

        // Some platforms take an array of button label names.
        // Other platforms take a comma separated list.
        // For compatibility, we convert to the desired type based on the platform.
        if (platform.id == "amazon-fireos" || platform.id == "android" || platform.id == "ios" ||
            platform.id == "windowsphone" || platform.id == "firefoxos" || platform.id == "ubuntu" ||
            platform.id == "windows8" || platform.id == "windows") {

            if (typeof _buttonLabels === 'string') {
                _buttonLabels = _buttonLabels.split(","); // not crazy about changing the var type here
            }
        } else {
            if (Array.isArray(_buttonLabels)) {
                var buttonLabelArray = _buttonLabels;
                _buttonLabels = buttonLabelArray.toString();
            }
        }
        exec(resultCallback, null, "Notification", "confirm", [message, _title, _buttonLabels]);
    },

    /**
     * Open a native prompt dialog, with a customizable title and button text.
     * The following results are returned to the result callback:
     *  buttonIndex     Index number of the button selected.
     *  input1          The text entered in the prompt dialog box.
     *
     * @param {String} message              Dialog message to display (default: "Prompt message")
     * @param {Function} resultCallback     The callback that is called when user clicks on a button.
     * @param {String} title                Title of the dialog (default: "Prompt")
     * @param {Array} buttonLabels          Array of strings for the button labels (default: ["OK","Cancel"])
     * @param {String} defaultText          Textbox input value (default: empty string)
     */
    prompt: function(message, resultCallback, title, buttonLabels, defaultText) {
        var _message = (typeof message === "string" ? message : "Prompt message");
        var _title = (typeof title === "string" ? title : "Prompt");
        var _buttonLabels = (buttonLabels || ["OK","Cancel"]);
        var _defaultText = (defaultText || "");
        exec(resultCallback, null, "Notification", "prompt", [_message, _title, _buttonLabels, _defaultText]);
    },

    /**
     * Causes the device to beep.
     * On Android, the default notification ringtone is played "count" times.
     *
     * @param {Integer} count       The number of beeps.
     */
    beep: function(count) {
        var defaultedCount = count || 1;
        exec(null, null, "Notification", "beep", [ defaultedCount ]);
    }
};

});

/** plugins\cordova-plugin-dialogs\www\android\notification.js */

cordova.define("cordova-plugin-dialogs.notification_android", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

/**
 * Provides Android enhanced notification API.
 */
module.exports = {
    activityStart : function(title, message) {
        // If title and message not specified then mimic Android behavior of
        // using default strings.
        if (typeof title === "undefined" && typeof message == "undefined") {
            title = "Busy";
            message = 'Please wait...';
        }

        exec(null, null, 'Notification', 'activityStart', [ title, message ]);
    },

    /**
     * Close an activity dialog
     */
    activityStop : function() {
        exec(null, null, 'Notification', 'activityStop', []);
    },

    /**
     * Display a progress dialog with progress bar that goes from 0 to 100.
     *
     * @param {String}
     *            title Title of the progress dialog.
     * @param {String}
     *            message Message to display in the dialog.
     */
    progressStart : function(title, message) {
        exec(null, null, 'Notification', 'progressStart', [ title, message ]);
    },

    /**
     * Close the progress dialog.
     */
    progressStop : function() {
        exec(null, null, 'Notification', 'progressStop', []);
    },

    /**
     * Set the progress dialog value.
     *
     * @param {Number}
     *            value 0-100
     */
    progressValue : function(value) {
        exec(null, null, 'Notification', 'progressValue', [ value ]);
    }
};

});

/** plugins\cordova-plugin-inappbrowser\www\inappbrowser.js */

cordova.define("cordova-plugin-inappbrowser.inappbrowser", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

(function() {
    // special patch to correctly work on Ripple emulator (CB-9760)
    if (window.parent && !!window.parent.ripple) { // https://gist.github.com/triceam/4658021
        module.exports = window.open.bind(window); // fallback to default window.open behaviour
        return;
    }

    var exec = require('cordova/exec');
    var channel = require('cordova/channel');
    var modulemapper = require('cordova/modulemapper');
    var urlutil = require('cordova/urlutil');

    function InAppBrowser() {
       this.channels = {
            'loadstart': channel.create('loadstart'),
            'loadstop' : channel.create('loadstop'),
            'loaderror' : channel.create('loaderror'),
            'exit' : channel.create('exit')
       };
    }

    InAppBrowser.prototype = {
        _eventHandler: function (event) {
            if (event && (event.type in this.channels)) {
                this.channels[event.type].fire(event);
            }
        },
        close: function (eventname) {
            exec(null, null, "InAppBrowser", "close", []);
        },
        show: function (eventname) {
          exec(null, null, "InAppBrowser", "show", []);
        },
        addEventListener: function (eventname,f) {
            if (eventname in this.channels) {
                this.channels[eventname].subscribe(f);
            }
        },
        removeEventListener: function(eventname, f) {
            if (eventname in this.channels) {
                this.channels[eventname].unsubscribe(f);
            }
        },

        executeScript: function(injectDetails, cb) {
            if (injectDetails.code) {
                exec(cb, null, "InAppBrowser", "injectScriptCode", [injectDetails.code, !!cb]);
            } else if (injectDetails.file) {
                exec(cb, null, "InAppBrowser", "injectScriptFile", [injectDetails.file, !!cb]);
            } else {
                throw new Error('executeScript requires exactly one of code or file to be specified');
            }
        },

        insertCSS: function(injectDetails, cb) {
            if (injectDetails.code) {
                exec(cb, null, "InAppBrowser", "injectStyleCode", [injectDetails.code, !!cb]);
            } else if (injectDetails.file) {
                exec(cb, null, "InAppBrowser", "injectStyleFile", [injectDetails.file, !!cb]);
            } else {
                throw new Error('insertCSS requires exactly one of code or file to be specified');
            }
        }
    };

    module.exports = function(strUrl, strWindowName, strWindowFeatures, callbacks) {
        // Don't catch calls that write to existing frames (e.g. named iframes).
        if (window.frames && window.frames[strWindowName]) {
            var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
            return origOpenFunc.apply(window, arguments);
        }

        strUrl = urlutil.makeAbsolute(strUrl);
        var iab = new InAppBrowser();

        callbacks = callbacks || {};
        for (var callbackName in callbacks) {
            iab.addEventListener(callbackName, callbacks[callbackName]);
        }

        var cb = function(eventname) {
           iab._eventHandler(eventname);
        };

        strWindowFeatures = strWindowFeatures || "";

        exec(cb, cb, "InAppBrowser", "open", [strUrl, strWindowName, strWindowFeatures]);
        return iab;
    };
})();

});

/** plugins\cordova-plugin-appversion\www\app-version.js */

cordova.define("cordova-plugin-appversion.RareloopAppVersion", function(require, exports, module) {
/**
 * Copyright (c) 2015 Rareloop Ltd
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var exec = require('cordova/exec');
var channel = require('cordova/channel');
var utils = require('cordova/utils');

channel.createSticky('onCordovaAppVersionReady');
// Wait on the onCordovaAppVersionReady event
channel.waitForInitialization('onCordovaAppVersionReady');

/**
 * Object representing the app's native version and build number
 * @constructor
 */
var RareloopAppVersion = function () {
    this.version = null;
    this.build = null;
    this.available = false;

    var _this = this;

    channel.onCordovaReady.subscribe(function() {
        _this.getInfo(function(info) {
            _this.available = true;

            _this.version = info.version;
            _this.build = parseInt(info.build, 10);

            channel.onCordovaAppVersionReady.fire();
        },function(e) {
            _this.available = false;
            utils.alert("[ERROR] Error initializing Version Plugin: " + e);
        });
    });
};

/**
 * Get the app version
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
RareloopAppVersion.prototype.getInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "RareloopAppVersion", "getAppVersion", []);
};

// Export the module
module.exports = new RareloopAppVersion();

});

/** plugins\cordova-plugin-camera\www\CameraConstants.js */

cordova.define("cordova-plugin-camera.Camera", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * @module Camera
 */
module.exports = {
  /**
   * @enum {number}
   */
  DestinationType:{
    /** Return base64 encoded string. DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible */
    DATA_URL: 0,
    /** Return file uri (content://media/external/images/media/2 for Android) */
    FILE_URI: 1,
    /** Return native uri (eg. asset-library://... for iOS) */
    NATIVE_URI: 2
  },
  /**
   * @enum {number}
   */
  EncodingType:{
    /** Return JPEG encoded image */
    JPEG: 0,
    /** Return PNG encoded image */
    PNG: 1
  },
  /**
   * @enum {number}
   */
  MediaType:{
    /** Allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType */
    PICTURE: 0,
    /** Allow selection of video only, ONLY RETURNS URL */
    VIDEO: 1,
    /** Allow selection from all media types */
    ALLMEDIA : 2
  },
  /**
   * @enum {number}
   */
  PictureSourceType:{
    /** Choose image from picture library (same as SAVEDPHOTOALBUM for Android) */
    PHOTOLIBRARY : 0,
    /** Take picture from camera */
    CAMERA : 1,
    /** Choose image from picture library (same as PHOTOLIBRARY for Android) */
    SAVEDPHOTOALBUM : 2
  },
  /**
   * Matches iOS UIPopoverArrowDirection constants to specify arrow location on popover.
   * @enum {number}
   */
  PopoverArrowDirection:{
      ARROW_UP : 1,
      ARROW_DOWN : 2,
      ARROW_LEFT : 4,
      ARROW_RIGHT : 8,
      ARROW_ANY : 15
  },
  /**
   * @enum {number}
   */
  Direction:{
      /** Use the back-facing camera */
      BACK: 0,
      /** Use the front-facing camera */
      FRONT: 1
  }
};

});

/** plugins\cordova-plugin-camera\www\CameraPopoverOptions.js */

cordova.define("cordova-plugin-camera.CameraPopoverOptions", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var Camera = require('./Camera');

/** 
 * @namespace navigator
 */

/**
 * iOS-only parameters that specify the anchor element location and arrow
 * direction of the popover when selecting images from an iPad's library
 * or album.
 * Note that the size of the popover may change to adjust to the
 * direction of the arrow and orientation of the screen.  Make sure to
 * account for orientation changes when specifying the anchor element
 * location.
 * @module CameraPopoverOptions
 * @param {Number} [x=0] - x pixel coordinate of screen element onto which to anchor the popover.
 * @param {Number} [y=32] - y pixel coordinate of screen element onto which to anchor the popover.
 * @param {Number} [width=320] - width, in pixels, of the screen element onto which to anchor the popover.
 * @param {Number} [height=480] - height, in pixels, of the screen element onto which to anchor the popover.
 * @param {module:Camera.PopoverArrowDirection} [arrowDir=ARROW_ANY] - Direction the arrow on the popover should point.
 */
var CameraPopoverOptions = function (x, y, width, height, arrowDir) {
    // information of rectangle that popover should be anchored to
    this.x = x || 0;
    this.y = y || 32;
    this.width = width || 320;
    this.height = height || 480;
    this.arrowDir = arrowDir || Camera.PopoverArrowDirection.ARROW_ANY;
};

module.exports = CameraPopoverOptions;

});

/** plugins\cordova-plugin-camera\www\Camera.js */

cordova.define("cordova-plugin-camera.camera", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    Camera = require('./Camera');
    // XXX: commented out
    //CameraPopoverHandle = require('./CameraPopoverHandle');

/**
 * @namespace navigator
 */

/**
 * @exports camera
 */
var cameraExport = {};

// Tack on the Camera Constants to the base camera plugin.
for (var key in Camera) {
    cameraExport[key] = Camera[key];
}

/**
 * Callback function that provides an error message.
 * @callback module:camera.onError
 * @param {string} message - The message is provided by the device's native code.
 */

/**
 * Callback function that provides the image data.
 * @callback module:camera.onSuccess
 * @param {string} imageData - Base64 encoding of the image data, _or_ the image file URI, depending on [`cameraOptions`]{@link module:camera.CameraOptions} in effect.
 * @example
 * // Show image
 * //
 * function cameraCallback(imageData) {
 *    var image = document.getElementById('myImage');
 *    image.src = "data:image/jpeg;base64," + imageData;
 * }
 */

/**
 * Optional parameters to customize the camera settings.
 * * [Quirks](#CameraOptions-quirks)
 * @typedef module:camera.CameraOptions
 * @type {Object}
 * @property {number} [quality=50] - Quality of the saved image, expressed as a range of 0-100, where 100 is typically full resolution with no loss from file compression. (Note that information about the camera's resolution is unavailable.)
 * @property {module:Camera.DestinationType} [destinationType=FILE_URI] - Choose the format of the return value.
 * @property {module:Camera.PictureSourceType} [sourceType=CAMERA] - Set the source of the picture.
 * @property {Boolean} [allowEdit=true] - Allow simple editing of image before selection.
 * @property {module:Camera.EncodingType} [encodingType=JPEG] - Choose the  returned image file's encoding.
 * @property {number} [targetWidth] - Width in pixels to scale image. Must be used with `targetHeight`. Aspect ratio remains constant.
 * @property {number} [targetHeight] - Height in pixels to scale image. Must be used with `targetWidth`. Aspect ratio remains constant.
 * @property {module:Camera.MediaType} [mediaType=PICTURE] - Set the type of media to select from.  Only works when `PictureSourceType` is `PHOTOLIBRARY` or `SAVEDPHOTOALBUM`.
 * @property {Boolean} [correctOrientation] - Rotate the image to correct for the orientation of the device during capture.
 * @property {Boolean} [saveToPhotoAlbum] - Save the image to the photo album on the device after capture.
 * @property {module:CameraPopoverOptions} [popoverOptions] - iOS-only options that specify popover location in iPad.
 * @property {module:Camera.Direction} [cameraDirection=BACK] - Choose the camera to use (front- or back-facing).
 */

/**
 * @description Takes a photo using the camera, or retrieves a photo from the device's
 * image gallery.  The image is passed to the success callback as a
 * Base64-encoded `String`, or as the URI for the image file.
 *
 * The `camera.getPicture` function opens the device's default camera
 * application that allows users to snap pictures by default - this behavior occurs,
 * when `Camera.sourceType` equals [`Camera.PictureSourceType.CAMERA`]{@link module:Camera.PictureSourceType}.
 * Once the user snaps the photo, the camera application closes and the application is restored.
 *
 * If `Camera.sourceType` is `Camera.PictureSourceType.PHOTOLIBRARY` or
 * `Camera.PictureSourceType.SAVEDPHOTOALBUM`, then a dialog displays
 * that allows users to select an existing image.  The
 * `camera.getPicture` function returns a [`CameraPopoverHandle`]{@link module:CameraPopoverHandle} object,
 * which can be used to reposition the image selection dialog, for
 * example, when the device orientation changes.
 *
 * The return value is sent to the [`cameraSuccess`]{@link module:camera.onSuccess} callback function, in
 * one of the following formats, depending on the specified
 * `cameraOptions`:
 *
 * - A `String` containing the Base64-encoded photo image.
 *
 * - A `String` representing the image file location on local storage (default).
 *
 * You can do whatever you want with the encoded image or URI, for
 * example:
 *
 * - Render the image in an `<img>` tag, as in the example below
 *
 * - Save the data locally (`LocalStorage`, [Lawnchair](http://brianleroux.github.com/lawnchair/), etc.)
 *
 * - Post the data to a remote server
 *
 * __NOTE__: Photo resolution on newer devices is quite good. Photos
 * selected from the device's gallery are not downscaled to a lower
 * quality, even if a `quality` parameter is specified.  To avoid common
 * memory problems, set `Camera.destinationType` to `FILE_URI` rather
 * than `DATA_URL`.
 *
 * __Supported Platforms__
 *
 * - Android
 * - BlackBerry
 * - Browser
 * - Firefox
 * - FireOS
 * - iOS
 * - Windows
 * - WP8
 * - Ubuntu
 *
 * More examples [here](#camera-getPicture-examples). Quirks [here](#camera-getPicture-quirks).
 *
 * @example
 * navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
 * @param {module:camera.onSuccess} successCallback
 * @param {module:camera.onError} errorCallback
 * @param {module:camera.CameraOptions} options CameraOptions
 */
cameraExport.getPicture = function(successCallback, errorCallback, options) {
    argscheck.checkArgs('fFO', 'Camera.getPicture', arguments);
    options = options || {};
    var getValue = argscheck.getValue;

    var quality = getValue(options.quality, 50);
    var destinationType = getValue(options.destinationType, Camera.DestinationType.FILE_URI);
    var sourceType = getValue(options.sourceType, Camera.PictureSourceType.CAMERA);
    var targetWidth = getValue(options.targetWidth, -1);
    var targetHeight = getValue(options.targetHeight, -1);
    var encodingType = getValue(options.encodingType, Camera.EncodingType.JPEG);
    var mediaType = getValue(options.mediaType, Camera.MediaType.PICTURE);
    var allowEdit = !!options.allowEdit;
    var correctOrientation = !!options.correctOrientation;
    var saveToPhotoAlbum = !!options.saveToPhotoAlbum;
    var popoverOptions = getValue(options.popoverOptions, null);
    var cameraDirection = getValue(options.cameraDirection, Camera.Direction.BACK);

    var args = [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, popoverOptions, cameraDirection];

    exec(successCallback, errorCallback, "Camera", "takePicture", args);
    // XXX: commented out
    //return new CameraPopoverHandle();
};

/**
 * Removes intermediate image files that are kept in temporary storage
 * after calling [`camera.getPicture`]{@link module:camera.getPicture}. Applies only when the value of
 * `Camera.sourceType` equals `Camera.PictureSourceType.CAMERA` and the
 * `Camera.destinationType` equals `Camera.DestinationType.FILE_URI`.
 *
 * __Supported Platforms__
 *
 * - iOS
 *
 * @example
 * navigator.camera.cleanup(onSuccess, onFail);
 *
 * function onSuccess() {
 *     console.log("Camera cleanup success.")
 * }
 *
 * function onFail(message) {
 *     alert('Failed because: ' + message);
 * }
 */
cameraExport.cleanup = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "Camera", "cleanup", []);
};

module.exports = cameraExport;

});

/** plugins\cordova-plugin-camera\www\CameraPopoverHandle.js */

cordova.define("cordova-plugin-camera.CameraPopoverHandle", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * @ignore in favour of iOS' one
 * A handle to an image picker popover.
 */
var CameraPopoverHandle = function() {
    this.setPosition = function(popoverOptions) {
        console.log('CameraPopoverHandle.setPosition is only supported on iOS.');
    };
};

module.exports = CameraPopoverHandle;

});

/** plugins\cordova-plugin-x-toast\www\Toast.js */

cordova.define("cordova-plugin-x-toast.Toast", function(require, exports, module) {
function Toast() {
}

Toast.prototype.optionsBuilder = function () {

  // defaults
  var message = null;
  var duration = "short";
  var position = "center";
  var addPixelsY = 0;

  return {
    withMessage: function(m) {
      message = m.toString();
      return this;
    },

    withDuration: function(d) {
      duration = d.toString();
      return this;
    },

    withPosition: function(p) {
      position = p;
      return this;
    },

    withAddPixelsY: function(y) {
      addPixelsY = y;
      return this;
    },

    build: function() {
      return {
        message: message,
        duration: duration,
        position: position,
        addPixelsY: addPixelsY
      };
    }
  };
};


Toast.prototype.showWithOptions = function (options, successCallback, errorCallback) {
  options.duration = (options.duration === undefined ? 'long' : options.duration.toString());
  options.message = options.message.toString();
  cordova.exec(successCallback, errorCallback, "Toast", "show", [options]);
};

Toast.prototype.show = function (message, duration, position, successCallback, errorCallback) {
  this.showWithOptions(
      this.optionsBuilder()
          .withMessage(message)
          .withDuration(duration)
          .withPosition(position)
          .build(),
      successCallback,
      errorCallback);
};

Toast.prototype.showShortTop = function (message, successCallback, errorCallback) {
  this.show(message, "short", "top", successCallback, errorCallback);
};

Toast.prototype.showShortCenter = function (message, successCallback, errorCallback) {
  this.show(message, "short", "center", successCallback, errorCallback);
};

Toast.prototype.showShortBottom = function (message, successCallback, errorCallback) {
  this.show(message, "short", "bottom", successCallback, errorCallback);
};

Toast.prototype.showLongTop = function (message, successCallback, errorCallback) {
  this.show(message, "long", "top", successCallback, errorCallback);
};

Toast.prototype.showLongCenter = function (message, successCallback, errorCallback) {
  this.show(message, "long", "center", successCallback, errorCallback);
};

Toast.prototype.showLongBottom = function (message, successCallback, errorCallback) {
  this.show(message, "long", "bottom", successCallback, errorCallback);
};

Toast.prototype.hide = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "Toast", "hide", []);
};

Toast.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.toast = new Toast();
  return window.plugins.toast;
};

cordova.addConstructor(Toast.install);
});

/** plugins\cordova-plugin-x-toast\test\tests.js */

cordova.define("cordova-plugin-x-toast.tests", function(require, exports, module) {
exports.defineAutoTests = function() {

  var fail = function (done) {
    expect(true).toBe(false);
    done();
  },
  succeed = function (done) {
    expect(true).toBe(true);
    done();
  };

  describe('Plugin availability', function () {
    it("window.plugins.toast should exist", function() {
      expect(window.plugins.toast).toBeDefined();
    });
  });

  describe('API functions', function () {
    it("should define show", function() {
      expect(window.plugins.toast.show).toBeDefined();
    });

    it("should define showWithOptions", function() {
      expect(window.plugins.toast.showWithOptions).toBeDefined();
    });

    it("should define optionsBuilder", function() {
      expect(window.plugins.toast.optionsBuilder).toBeDefined();
    });

    it("should define showShortTop", function() {
      expect(window.plugins.toast.showShortTop).toBeDefined();
    });

    it("should define showShortCenter", function() {
      expect(window.plugins.toast.showShortCenter).toBeDefined();
    });

    it("should define showShortBottom", function() {
      expect(window.plugins.toast.showShortBottom).toBeDefined();
    });

    it("should define showLongTop", function() {
      expect(window.plugins.toast.showLongTop).toBeDefined();
    });

    it("should define showLongCenter", function() {
      expect(window.plugins.toast.showLongCenter).toBeDefined();
    });

    it("should define showLongBottom", function() {
      expect(window.plugins.toast.showLongBottom).toBeDefined();
    });
  });

  describe('Invalid usage', function () {
    it("should fail due to an invalid position", function(done) {
      window.plugins.toast.show('hi', 'short', 'nowhere', fail.bind(null, done), succeed.bind(null, done));
    });
  });
};

});

/** plugins\cordova-plugin-actionsheet\www\ActionSheet.js */

cordova.define("cordova-plugin-actionsheet.ActionSheet", function(require, exports, module) {
function ActionSheet() {
}

ActionSheet.prototype.show = function (options, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "ActionSheet", "show", [options]);
};

ActionSheet.prototype.hide = function (options, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "ActionSheet", "hide", [options]);
};

ActionSheet.prototype.ANDROID_THEMES = {
  THEME_TRADITIONAL          : 1, // default
  THEME_HOLO_DARK            : 2,
  THEME_HOLO_LIGHT           : 3,
  THEME_DEVICE_DEFAULT_DARK  : 4,
  THEME_DEVICE_DEFAULT_LIGHT : 5
};

ActionSheet.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.actionsheet = new ActionSheet();

  return window.plugins.actionsheet;
};

cordova.addConstructor(ActionSheet.install);
});

/** plugins\cordova-plugin-background-mode\www\background-mode.js */

cordova.define("cordova-plugin-background-mode.BackgroundMode", function(require, exports, module) {
/*
    Copyright 2013-2014 appPlant UG

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var exec    = require('cordova/exec'),
    channel = require('cordova/channel');


// Override back button action to prevent being killed
document.addEventListener('backbutton', function () {}, false);

// Called before 'deviceready' listener will be called
channel.onCordovaReady.subscribe(function () {
    // Device plugin is ready now
    channel.onCordovaInfoReady.subscribe(function () {
        // Set the defaults
        exports.setDefaults({});
    });

    // Only enable WP8 by default
    if (['WinCE', 'Win32NT'].indexOf(device.platform) > -1) {
        exports.enable();
    }
});


/**
 * @private
 *
 * Flag indicated if the mode is enabled.
 */
exports._isEnabled = false;

/**
 * @private
 *
 * Flag indicated if the mode is active.
 */
exports._isActive = false;

/**
 * @private
 *
 * Default values of all available options.
 */
exports._defaults = {
    title:  'App is running in background',
    text:   'Doing heavy tasks.',
    ticker: 'App is running in background',
    resume: true,
    silent: false
};


/**
 * Activates the background mode. When activated the application
 * will be prevented from going to sleep while in background
 * for the next time.
 */
exports.enable = function () {
    this._isEnabled = true;
    cordova.exec(null, null, 'BackgroundMode', 'enable', []);
};

/**
 * Deactivates the background mode. When deactivated the application
 * will not stay awake while in background.
 */
exports.disable = function () {
    this._isEnabled = false;
    cordova.exec(null, null, 'BackgroundMode', 'disable', []);
};

/**
 * List of all available options with their default value.
 *
 * @return {Object}
 */
exports.getDefaults = function () {
    return this._defaults;
};

/**
 * Overwrite default settings
 *
 * @param {Object} overrides
 *      Dict of options which shall be overridden
 */
exports.setDefaults = function (overrides) {
    var defaults = this.getDefaults();

    for (var key in defaults) {
        if (overrides.hasOwnProperty(key)) {
            defaults[key] = overrides[key];
        }
    }

    if (device.platform == 'Android') {
        cordova.exec(null, null, 'BackgroundMode', 'configure', [defaults, false]);
    }
};

/**
 * Configures the notification settings for Android.
 * Will be merged with the defaults.
 *
 * @param {Object} options
 *      Dict with key/value pairs
 */
exports.configure = function (options) {
    var settings = this.mergeWithDefaults(options);

    if (device.platform == 'Android') {
        cordova.exec(null, null, 'BackgroundMode', 'configure', [settings, true]);
    }
};

/**
 * If the mode is enabled or disabled.
 *
 * @return {Boolean}
 */
exports.isEnabled = function () {
    return this._isEnabled;
};

/**
 * If the mode is active.
 *
 * @return {Boolean}
 */
exports.isActive = function () {
    return this._isActive;
};

/**
 * Called when the background mode has been activated.
 */
exports.onactivate = function () {};

/**
 * Called when the background mode has been deaktivated.
 */
exports.ondeactivate = function () {};

/**
 * Called when the background mode could not been activated.
 *
 * @param {Integer} errorCode
 *      Error code which describes the error
 */
exports.onfailure = function () {};

/**
 * @private
 *
 * Merge settings with default values.
 *
 * @param {Object} options
 *      The custom options
 *
 * @return {Object}
 *      Default values merged
 *      with custom values
 */
exports.mergeWithDefaults = function (options) {
    var defaults = this.getDefaults();

    for (var key in defaults) {
        if (!options.hasOwnProperty(key)) {
            options[key] = defaults[key];
            continue;
        }
    }

    return options;
};

});

/** plugins\phonegap-plugin-barcodescanner\www\barcodescanner.js */

cordova.define("phonegap-plugin-barcodescanner.BarcodeScanner", function(require, exports, module) {
/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */


        var exec = require("cordova/exec");

        /**
         * Constructor.
         *
         * @returns {BarcodeScanner}
         */
        function BarcodeScanner() {

            /**
             * Encoding constants.
             *
             * @type Object
             */
            this.Encode = {
                TEXT_TYPE: "TEXT_TYPE",
                EMAIL_TYPE: "EMAIL_TYPE",
                PHONE_TYPE: "PHONE_TYPE",
                SMS_TYPE: "SMS_TYPE"
                //  CONTACT_TYPE: "CONTACT_TYPE",  // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
                //  LOCATION_TYPE: "LOCATION_TYPE" // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
            };

    /**
     * Barcode format constants, defined in ZXing library.
     *
     * @type Object
     */
    this.format = {
        "all_1D": 61918,
        "aztec": 1,
        "codabar": 2,
        "code_128": 16,
        "code_39": 4,
        "code_93": 8,
        "data_MATRIX": 32,
        "ean_13": 128,
        "ean_8": 64,
        "itf": 256,
        "maxicode": 512,
        "msi": 131072,
        "pdf_417": 1024,
        "plessey": 262144,
        "qr_CODE": 2048,
        "rss_14": 4096,
        "rss_EXPANDED": 8192,
        "upc_A": 16384,
        "upc_E": 32768,
        "upc_EAN_EXTENSION": 65536
        };
  }

/**
 * Read code from scanner.
 *
 * @param {Function} successCallback This function will recieve a result object: {
         *        text : '12345-mock',    // The code that was scanned.
         *        format : 'FORMAT_NAME', // Code format.
         *        cancelled : true/false, // Was canceled.
         *    }
 * @param {Function} errorCallback
 * @param config
 */
BarcodeScanner.prototype.scan = function (successCallback, errorCallback, config) {

            if (config instanceof Array) {
                // do nothing
            } else {
                if (typeof(config) === 'object') {
                    config = [ config ];
                } else {
                    config = [];
                }
            }

            if (errorCallback == null) {
                errorCallback = function () {
                };
            }

            if (typeof errorCallback != "function") {
                console.log("BarcodeScanner.scan failure: failure parameter not a function");
                return;
            }

            if (typeof successCallback != "function") {
                console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
                return;
            }

    exec(successCallback, errorCallback, 'BarcodeScanner', 'scan', config);
        };

        //-------------------------------------------------------------------
        BarcodeScanner.prototype.encode = function (type, data, successCallback, errorCallback, options) {
            if (errorCallback == null) {
                errorCallback = function () {
                };
            }

            if (typeof errorCallback != "function") {
                console.log("BarcodeScanner.encode failure: failure parameter not a function");
                return;
            }

            if (typeof successCallback != "function") {
                console.log("BarcodeScanner.encode failure: success callback parameter must be a function");
                return;
            }

            exec(successCallback, errorCallback, 'BarcodeScanner', 'encode', [
                {"type": type, "data": data, "options": options}
            ]);
        };

        var barcodeScanner = new BarcodeScanner();
        module.exports = barcodeScanner;

});

/** plugins\org.binarypark.cordova.plugins.version\www\getAppVersion.js */

cordova.define("org.binarypark.cordova.plugins.version.getAppVersion", function(require, exports, module) {
module.exports.getAppVersion = function() { return "0.0.0";};
});

/** plugins\de.appplant.cordova.plugin.local-notification\www\local-notification.js */

cordova.define("de.appplant.cordova.plugin.local-notification.LocalNotification", function(require, exports, module) {
/*
 * Copyright (c) 2013-2015 by appPlant UG. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */


/*************
 * INTERFACE *
 *************/

/**
 * Returns the default settings.
 *
 * @return {Object}
 */
exports.getDefaults = function () {
    return this.core.getDefaults();
};

/**
 * Overwrite default settings.
 *
 * @param {Object} defaults
 */
exports.setDefaults = function (defaults) {
    this.core.setDefaults(defaults);
};

/**
 * Schedule a new local notification.
 *
 * @param {Object} notifications
 *      The notification properties
 * @param {Function} callback
 *      A function to be called after the notification has been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 * @param {Object?} args
 *      skipPermission:true schedules the notifications immediatly without
 *                          registering or checking for permission
 */
exports.schedule = function (notifications, callback, scope, args) {
    this.core.schedule(notifications, callback, scope, args);
};

/**
 * Update existing notifications specified by IDs in options.
 *
 * @param {Object} notifications
 *      The notification properties to update
 * @param {Function} callback
 *      A function to be called after the notification has been updated
 * @param {Object?} scope
 *      The scope for the callback function
 * @param {Object?} args
 *      skipPermission:true schedules the notifications immediatly without
 *                          registering or checking for permission
 */
exports.update = function (notifications, callback, scope, args) {
    this.core.update(notifications, callback, scope, args);
};

/**
 * Clear the specified notification.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A function to be called after the notification has been cleared
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.clear = function (ids, callback, scope) {
    this.core.clear(ids, callback, scope);
};

/**
 * Clear all previously sheduled notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been cleared
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.clearAll = function (callback, scope) {
    this.core.clearAll(callback, scope);
};

/**
 * Cancel the specified notifications.
 *
 * @param {String[]} ids
 *      The IDs of the notifications
 * @param {Function} callback
 *      A function to be called after the notifications has been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.cancel = function (ids, callback, scope) {
    this.core.cancel(ids, callback, scope);
};

/**
 * Remove all previously registered notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.cancelAll = function (callback, scope) {
    this.core.cancelAll(callback, scope);
};

/**
 * Check if a notification with an ID is present.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isPresent = function (id, callback, scope) {
    this.core.isPresent(id, callback, scope);
};

/**
 * Check if a notification with an ID is scheduled.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isScheduled = function (id, callback, scope) {
    this.core.isScheduled(id, callback, scope);
};

/**
 * Check if a notification with an ID was triggered.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isTriggered = function (id, callback, scope) {
    this.core.isTriggered(id, callback, scope);
};

/**
 * List all local notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllIds = function (callback, scope) {
    this.core.getAllIds(callback, scope);
};

/**
 * Alias for `getAllIds`.
 */
exports.getIds = function () {
    this.getAllIds.apply(this, arguments);
};

/**
 * List all scheduled notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getScheduledIds = function (callback, scope) {
    this.core.getScheduledIds(callback, scope);
};

/**
 * List all triggered notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getTriggeredIds = function (callback, scope) {
    this.core.getTriggeredIds(callback, scope);
};

/**
 * Property list for given local notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.get = function () {
    this.core.get.apply(this.core, arguments);
};

/**
 * Property list for all local notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAll = function (callback, scope) {
    this.core.getAll(callback, scope);
};

/**
 * Property list for given scheduled notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getScheduled = function () {
    this.core.getScheduled.apply(this.core, arguments);
};

/**
 * Property list for all scheduled notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllScheduled = function (callback, scope) {
    this.core.getAllScheduled(callback, scope);
};

/**
 * Property list for given triggered notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getTriggered = function () {
    this.core.getTriggered.apply(this.core, arguments);
};

/**
 * Property list for all triggered notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllTriggered = function (callback, scope) {
    this.core.getAllTriggered(callback, scope);
};

/**
 * Informs if the app has the permission to show notifications.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.hasPermission = function (callback, scope) {
    this.core.hasPermission(callback, scope);
};

/**
 * Register permission to show notifications if not already granted.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.registerPermission = function (callback, scope) {
    this.core.registerPermission(callback, scope);
};


/****************
 * DEPRECATIONS *
 ****************/

/**
 * Schedule a new local notification.
 */
exports.add = function () {
    console.warn('Depreated: Please use `notification.local.schedule` instead.');

    this.schedule.apply(this, arguments);
};

/**
 * Register permission to show notifications
 * if not already granted.
 */
exports.promptForPermission = function () {
    console.warn('Depreated: Please use `notification.local.registerPermission` instead.');

    this.registerPermission.apply(this, arguments);
};


/**********
 * EVENTS *
 **********/

/**
 * Register callback for given event.
 *
 * @param {String} event
 *      The event's name
 * @param {Function} callback
 *      The function to be exec as callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.on = function (event, callback, scope) {
    this.core.on(event, callback, scope);
};

/**
 * Unregister callback for given event.
 *
 * @param {String} event
 *      The event's name
 * @param {Function} callback
 *      The function to be exec as callback
 */
exports.un = function (event, callback) {
    this.core.un(event, callback, scope);
};

});

/** plugins\de.appplant.cordova.plugin.local-notification\www\local-notification-core.js */

cordova.define("de.appplant.cordova.plugin.local-notification.LocalNotification.Core", function(require, exports, module) {
/*
 * Copyright (c) 2013-2015 by appPlant UG. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */

var exec = require('cordova/exec');


/********
 * CORE *
 ********/

/**
 * Returns the default settings.
 *
 * @return {Object}
 */
exports.getDefaults = function () {
    return this._defaults;
};

/**
 * Overwrite default settings.
 *
 * @param {Object} defaults
 */
exports.setDefaults = function (newDefaults) {
    var defaults = this.getDefaults();

    for (var key in defaults) {
        if (newDefaults.hasOwnProperty(key)) {
            defaults[key] = newDefaults[key];
        }
    }
};

/**
 * Schedule a new local notification.
 *
 * @param {Object} msgs
 *      The notification properties
 * @param {Function} callback
 *      A function to be called after the notification has been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 * @param {Object?} args
 *      skipPermission:true schedules the notifications immediatly without
 *                          registering or checking for permission
 */
exports.schedule = function (msgs, callback, scope, args) {
    var fn = function(granted) {

        if (!granted) return;

        var notifications = Array.isArray(msgs) ? msgs : [msgs];

        for (var i = 0; i < notifications.length; i++) {
            var notification = notifications[i];

            this.mergeWithDefaults(notification);
            this.convertProperties(notification);
        }

        this.exec('schedule', notifications, callback, scope);
    };

    if (args && args.skipPermission) {
        fn.call(this, true);
    } else {
        this.registerPermission(fn, this);
    }
};

/**
 * Update existing notifications specified by IDs in options.
 *
 * @param {Object} notifications
 *      The notification properties to update
 * @param {Function} callback
 *      A function to be called after the notification has been updated
 * @param {Object?} scope
 *      The scope for the callback function
 * @param {Object?} args
 *      skipPermission:true schedules the notifications immediatly without
 *                          registering or checking for permission
 */
exports.update = function (msgs, callback, scope, args) {
    var fn = function(granted) {

        if (!granted) return;

        var notifications = Array.isArray(msgs) ? msgs : [msgs];

        for (var i = 0; i < notifications.length; i++) {
            var notification = notifications[i];

            this.convertProperties(notification);
        }

        this.exec('update', notifications, callback, scope);
    };

    if (args && args.skipPermission) {
        fn.call(this, true);
    } else {
        this.registerPermission(fn, this);
    }
};

/**
 * Clear the specified notification.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A function to be called after the notification has been cleared
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.clear = function (ids, callback, scope) {
    ids = Array.isArray(ids) ? ids : [ids];
    ids = this.convertIds(ids);

    this.exec('clear', ids, callback, scope);
};

/**
 * Clear all previously sheduled notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been cleared
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.clearAll = function (callback, scope) {
    this.exec('clearAll', null, callback, scope);
};

/**
 * Cancel the specified notifications.
 *
 * @param {String[]} ids
 *      The IDs of the notifications
 * @param {Function} callback
 *      A function to be called after the notifications has been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.cancel = function (ids, callback, scope) {
    ids = Array.isArray(ids) ? ids : [ids];
    ids = this.convertIds(ids);

    this.exec('cancel', ids, callback, scope);
};

/**
 * Remove all previously registered notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been canceled
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.cancelAll = function (callback, scope) {
    this.exec('cancelAll', null, callback, scope);
};

/**
 * Check if a notification with an ID is present.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isPresent = function (id, callback, scope) {
    this.exec('isPresent', id || 0, callback, scope);
};

/**
 * Check if a notification with an ID is scheduled.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isScheduled = function (id, callback, scope) {
    this.exec('isScheduled', id || 0, callback, scope);
};

/**
 * Check if a notification with an ID was triggered.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.isTriggered = function (id, callback, scope) {
    this.exec('isTriggered', id || 0, callback, scope);
};

/**
 * List all local notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllIds = function (callback, scope) {
    this.exec('getAllIds', null, callback, scope);
};

/**
 * Alias for `getAllIds`.
 */
exports.getIds = function () {
    this.getAllIds.apply(this, arguments);
};

/**
 * List all scheduled notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getScheduledIds = function (callback, scope) {
    this.exec('getScheduledIds', null, callback, scope);
};

/**
 * List all triggered notification IDs.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getTriggeredIds = function (callback, scope) {
    this.exec('getTriggeredIds', null, callback, scope);
};

/**
 * Property list for given local notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.get = function () {
    var args = Array.apply(null, arguments);

    if (typeof args[0] == 'function') {
        args.unshift([]);
    }

    var ids      = args[0],
        callback = args[1],
        scope    = args[2];

    if (!Array.isArray(ids)) {
        this.exec('getSingle', Number(ids), callback, scope);
        return;
    }

    ids = this.convertIds(ids);

    this.exec('getAll', ids, callback, scope);
};

/**
 * Property list for all local notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAll = function (callback, scope) {
    this.exec('getAll', null, callback, scope);
};

/**
 * Property list for given scheduled notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getScheduled = function () {
    var args = Array.apply(null, arguments);

    if (typeof args[0] == 'function') {
        args.unshift([]);
    }

    var ids      = args[0],
        callback = args[1],
        scope    = args[2];

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    if (!Array.isArray(ids)) {
        this.exec('getSingleScheduled', Number(ids), callback, scope);
        return;
    }

    ids = this.convertIds(ids);

    this.exec('getScheduled', ids, callback, scope);
};

/**
 * Property list for all scheduled notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllScheduled = function (callback, scope) {
    this.exec('getScheduled', null, callback, scope);
};

/**
 * Property list for given triggered notifications.
 * If called without IDs, all notification will be returned.
 *
 * @param {Number[]?} ids
 *      Set of notification IDs
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getTriggered = function () {
    var args = Array.apply(null, arguments);

    if (typeof args[0] == 'function') {
        args.unshift([]);
    }

    var ids      = args[0],
        callback = args[1],
        scope    = args[2];

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    if (!Array.isArray(ids)) {
        this.exec('getSingleTriggered', Number(ids), callback, scope);
        return;
    }

    ids = this.convertIds(ids);

    this.exec('getTriggered', ids, callback, scope);
};

/**
 * Property list for all triggered notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object?} scope
 *      The scope for the callback function
 */
exports.getAllTriggered = function (callback, scope) {
    this.exec('getTriggered', null, callback, scope);
};

/**
 * Informs if the app has the permission to show notifications.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.hasPermission = function (callback, scope) {
    var fn = this.createCallbackFn(callback, scope);

    if (device.platform != 'iOS') {
        fn(true);
        return;
    }

    exec(fn, null, 'LocalNotification', 'hasPermission', []);
};

/**
 * Register permission to show notifications if not already granted.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.registerPermission = function (callback, scope) {

    if (this._registered) {
        return this.hasPermission(callback, scope);
    } else {
        this._registered = true;
    }

    var fn = this.createCallbackFn(callback, scope);

    if (device.platform != 'iOS') {
        fn(true);
        return;
    }

    exec(fn, null, 'LocalNotification', 'registerPermission', []);
};


/**********
 * EVENTS *
 **********/

/**
 * Register callback for given event.
 *
 * @param {String} event
 *      The event's name
 * @param {Function} callback
 *      The function to be exec as callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.on = function (event, callback, scope) {

    if (typeof callback !== "function")
        return;

    if (!this._listener[event]) {
        this._listener[event] = [];
    }

    var item = [callback, scope || window];

    this._listener[event].push(item);
};

/**
 * Unregister callback for given event.
 *
 * @param {String} event
 *      The event's name
 * @param {Function} callback
 *      The function to be exec as callback
 */
exports.un = function (event, callback) {
    var listener = this._listener[event];

    if (!listener)
        return;

    for (var i = 0; i < listener.length; i++) {
        var fn = listener[i][0];

        if (fn == callback) {
            listener.splice(i, 1);
            break;
        }
    }
};

});

/** plugins\de.appplant.cordova.plugin.local-notification\www\local-notification-util.js */

cordova.define("de.appplant.cordova.plugin.local-notification.LocalNotification.Util", function(require, exports, module) {
/*
 * Copyright (c) 2013-2015 by appPlant UG. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */

var exec    = require('cordova/exec'),
    channel = require('cordova/channel');


/***********
 * MEMBERS *
 ***********/

// Default values
exports._defaults = {
    text:  '',
    title: '',
    sound: 'res://platform_default',
    badge: 0,
    id:    0,
    data:  undefined,
    every: undefined,
    at:    undefined
};

// listener
exports._listener = {};

// Registered permission flag
exports._registered = false;


/********
 * UTIL *
 ********/

/**
 * Merge platform specific properties into the default ones.
 *
 * @return {Object}
 *      The default properties for the platform
 */
exports.applyPlatformSpecificOptions = function () {
    var defaults = this._defaults;

    switch (device.platform) {
    case 'Android':
        defaults.icon      = 'res://ic_popup_reminder';
        defaults.smallIcon = undefined;
        defaults.ongoing   = false;
        defaults.autoClear = true;
        defaults.led       = 'FF0000';
        defaults.color     = undefined;
        break;
    }

    return defaults;
};

/**
 * Merge custom properties with the default values.
 *
 * @param {Object} options
 *      Set of custom values
 *
 * @retrun {Object}
 *      The merged property list
 */
exports.mergeWithDefaults = function (options) {
    var defaults = this.getDefaults();

    options.at   = this.getValueFor(options, 'at', 'firstAt', 'date');
    options.text = this.getValueFor(options, 'text', 'message');
    options.data = this.getValueFor(options, 'data', 'json');

    if (defaults.hasOwnProperty('autoClear')) {
        options.autoClear = this.getValueFor(options, 'autoClear', 'autoCancel');
    }

    if (options.autoClear !== true && options.ongoing) {
        options.autoClear = false;
    }

    if (options.at === undefined || options.at === null) {
        options.at = new Date();
    }

    for (var key in defaults) {
        if (options[key] === null || options[key] === undefined) {
            if (options.hasOwnProperty(key) && ['data','sound'].indexOf(key) > -1) {
                options[key] = undefined;
            } else {
                options[key] = defaults[key];
            }
        }
    }

    for (key in options) {
        if (!defaults.hasOwnProperty(key)) {
            delete options[key];
            console.warn('Unknown property: ' + key);
        }
    }

    return options;
};

/**
 * Convert the passed values to their required type.
 *
 * @param {Object} options
 *      Set of custom values
 *
 * @retrun {Object}
 *      The converted property list
 */
exports.convertProperties = function (options) {

    if (options.id) {
        if (isNaN(options.id)) {
            options.id = this.getDefaults().id;
            console.warn('Id is not a number: ' + options.id);
        } else {
            options.id = Number(options.id);
        }
    }

    if (options.title) {
        options.title = options.title.toString();
    }

    if (options.text) {
        options.text  = options.text.toString();
    }

    if (options.badge) {
        if (isNaN(options.badge)) {
            options.badge = this.getDefaults().badge;
            console.warn('Badge number is not a number: ' + options.id);
        } else {
            options.badge = Number(options.badge);
        }
    }

    if (options.at) {
        if (typeof options.at == 'object') {
            options.at = options.at.getTime();
        }

        options.at = Math.round(options.at/1000);
    }

    if (typeof options.data == 'object') {
        options.data = JSON.stringify(options.data);
    }

    if (options.every) {
        if (device.platform == 'iOS' && typeof options.every != 'string') {
            options.every = this.getDefaults().every;
            var warning = 'Every option is not a string: ' + options.id;
            warning += '. Expects one of: second, minute, hour, day, week, ';
            warning += 'month, year on iOS.';
            console.warn(warning);
        }
    }

    return options;
};

/**
 * Create callback, which will be executed within a specific scope.
 *
 * @param {Function} callbackFn
 *      The callback function
 * @param {Object} scope
 *      The scope for the function
 *
 * @return {Function}
 *      The new callback function
 */
exports.createCallbackFn = function (callbackFn, scope) {

    if (typeof callbackFn != 'function')
        return;

    return function () {
        callbackFn.apply(scope || this, arguments);
    };
};

/**
 * Convert the IDs to numbers.
 *
 * @param {String/Number[]} ids
 *
 * @return Array of Numbers
 */
exports.convertIds = function (ids) {
    var convertedIds = [];

    for (var i = 0; i < ids.length; i++) {
        convertedIds.push(Number(ids[i]));
    }

    return convertedIds;
};

/**
 * First found value for the given keys.
 *
 * @param {Object} options
 *      Object with key-value properties
 * @param {String[]} keys*
 *      Key list
 */
exports.getValueFor = function (options) {
    var keys = Array.apply(null, arguments).slice(1);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (options.hasOwnProperty(key)) {
            return options[key];
        }
    }
};

/**
 * Fire event with given arguments.
 *
 * @param {String} event
 *      The event's name
 * @param {args*}
 *      The callback's arguments
 */
exports.fireEvent = function (event) {
    var args     = Array.apply(null, arguments).slice(1),
        listener = this._listener[event];

    if (!listener)
        return;

    for (var i = 0; i < listener.length; i++) {
        var fn    = listener[i][0],
            scope = listener[i][1];

        fn.apply(scope, args);
    }
};

/**
 * Execute the native counterpart.
 *
 * @param {String} action
 *      The name of the action
 * @param args[]
 *      Array of arguments
 * @param {Function} callback
 *      The callback function
 * @param {Object} scope
 *      The scope for the function
 */
exports.exec = function (action, args, callback, scope) {
    var fn = this.createCallbackFn(callback, scope),
        params = [];

    if (Array.isArray(args)) {
        params = args;
    } else if (args) {
        params.push(args);
    }

    exec(fn, null, 'LocalNotification', action, params);
};


/*********
 * HOOKS *
 *********/

// Called after 'deviceready' event
channel.deviceready.subscribe(function () {
    // Device is ready now, the listeners are registered
    // and all queued events can be executed.
    exec(null, null, 'LocalNotification', 'deviceready', []);
});

// Called before 'deviceready' event
channel.onCordovaReady.subscribe(function () {
    // Device plugin is ready now
    channel.onCordovaInfoReady.subscribe(function () {
        // Merge platform specifics into defaults
        exports.applyPlatformSpecificOptions();
    });
});

});

/** plugins\cordova-plugin-app-version\www\AppVersionPlugin.js */

cordova.define("cordova-plugin-app-version.AppVersionPlugin", function(require, exports, module) {
/*jslint indent: 2 */
/*global window, jQuery, angular, cordova */
"use strict";

// Returns a jQuery or AngularJS deferred object, or pass a success and fail callbacks if you don't want to use jQuery or AngularJS
var getPromisedCordovaExec = function (command, success, fail) {
  var toReturn, deferred, injector, $q;
  if (success === undefined) {
    if (window.jQuery) {
      deferred = jQuery.Deferred();
      success = deferred.resolve;
      fail = deferred.reject;
      toReturn = deferred;
    } else if (window.angular) {
      injector = angular.injector(["ng"]);
      $q = injector.get("$q");
      deferred = $q.defer();
      success = deferred.resolve;
      fail = deferred.reject;
      toReturn = deferred.promise;
    } else if (window.Promise) {
      toReturn = new Promise(function(c, e) {
        success = c;
        fail = e;
      });
    } else if (window.WinJS && window.WinJS.Promise) {
      toReturn = new WinJS.Promise(function(c, e) {
        success = c;
        fail = e;
      });
    } else {
      return console.error('AppVersion either needs a success callback, or jQuery/AngularJS/Promise/WinJS.Promise defined for using promises');
    }
  }
  // 5th param is NOT optional. must be at least empty array
  cordova.exec(success, fail, "AppVersion", command, []);
  return toReturn;
};

var getAppVersion = function (success, fail) {
  return getPromisedCordovaExec('getVersionNumber', success, fail);
};

getAppVersion.getAppName = function (success, fail) {
  return getPromisedCordovaExec('getAppName', success, fail);
};

getAppVersion.getPackageName = function (success, fail) {
  return getPromisedCordovaExec('getPackageName', success, fail);
};

getAppVersion.getVersionNumber = function (success, fail) {
  return getPromisedCordovaExec('getVersionNumber', success, fail);
};

getAppVersion.getVersionCode = function (success, fail) {
  return getPromisedCordovaExec('getVersionCode', success, fail);
};

module.exports = getAppVersion;

});

/** plugins\cordova-plugin-appavailability\www\AppAvailability.js */

cordova.define("cordova-plugin-appavailability.AppAvailability", function(require, exports, module) {
var appAvailability = {
    
    check: function(urlScheme, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    },
    
    checkBool: function(urlScheme, callback) {
        cordova.exec(
            function(success) { callback(success); },
            function(error) { callback(error); },
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    }
    
};

module.exports = appAvailability;
});

/** plugins\cordova-open\www\disusered.open.js */

cordova.define("cordova-open.Open", function(require, exports, module) {
/**
 * disusered.open.js
 *
 * @overview Open documents with compatible apps.
 * @author Carlos Antonio
 * @license MIT
*/

var exec = require('cordova/exec');

/**
 * open
 *
 * @param {String} uri File URI
 * @param {Function} success Success callback
 * @param {Function} error Failure callback
 * @param {Boolean} trustAllCertificates Trusts any certificate when the connection is done over HTTPS.
 * @returns {void}
 */
exports.open = function(uri, success, error, trustAllCertificates) {
  if (!uri || arguments.length === 0) { return false; }

  uri = encodeURI(uri);

  if (uri.match('http')) {
    downloadAndOpen(uri, success, error, trustAllCertificates);
  } else {
    exec(onSuccess.bind(this, uri, success),
         onError.bind(this, error), 'Open', 'open', [uri]);
  }
};

/**
 * downloadAndOpen
 *
 * @param {String} url File URI
 * @param {Function} success Success callback
 * @param {Function} error Failure callback
 * @param {Boolean} trustAllCertificates Trusts any certificate when the connection is done over HTTPS.
 * @returns {void}
 */
function downloadAndOpen(url, success, error, trustAllCertificates) {
  var ft = new FileTransfer();
  var ios = cordova.file.cacheDirectory;
  var ext = cordova.file.externalCacheDirectory;
  var dir = (ext) ? ext : ios;
  var name = url.substring(url.lastIndexOf('/') + 1);
  var path = dir + name;

  if (typeof trustAllCertificates !== 'boolean') {
    // Defaults to false
    trustAllCertificates = false;
  }

  ft.download(url, path,
      function done(entry) {
        var file = entry.toURL();
        exec(onSuccess.bind(this, file, success),
             onError.bind(this, error), 'Open', 'open', [file]);
      },
      onError.bind(this, error),
      trustAllCertificates
  );
}

/**
 * onSuccess
 *
 * @param {String} path File URI
 * @param {Function} callback Callback
 * @returns {String} File URI
 */
function onSuccess(path, callback) {
  fire('success', path);
  if (typeof callback === 'function') {
    callback(path);
  }
  return path;
}

/**
 * onError
 *
 * @param {Function} callback Callback
 * @returns {Number} Error Code
 */
function onError(callback) {
  var code = (arguments.length > 1) ? arguments[1] : 0;
  fire('error', code);
  if (typeof callback === 'function') {
    callback(code);
  }
  return code;
}

/**
 * fire
 *
 * @param {String} event Event name
 * @param {String} data Success or error data
 * @returns {void}
 */
function fire(event, data) {
  var channel = require('cordova/channel');
  var cordova = require('cordova');
  var payload = {};

  channel.onCordovaReady.subscribe(function() {
    var name = 'open.' + event;
    var prop = (event === 'error') ? event : 'data';
    payload[prop] = data;
    cordova.fireDocumentEvent(name, payload);
  });
}

});

/** plugins\xsf\www\xsf.js */

cordova.define("xsf", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "XSFPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		getDeviceId : function(callback){
			call('getDeviceId',[],callback);
		},getDeviceInfo : function(callback){
			call('getDeviceInfo',[],callback);
		},set : function(key,value){
			xsfStore.set(key,value);
		},get : function(key,defaultValue,callback){
			xsfStore.get(key,defaultValue,callback);
		},openApp : function(packageName,className,params){
			call('openApp',[packageName,className,params||{}]);
		},startService : function(ation,params){
			call('startService',[ation,params||{}]);
		},playVideo : function(url){
			call('playVideo',[url]);
		},openUrl : function(url){
			call('openUrl',[path]);
		},open:function(path){
			xsfFileOpener.open(path);
		},install:function(path,packageUri,onSucceed,onError){
			if(packageUri == undefined || packageUri == null || packageUri == ""){
				call('install',[path]);
			}else{
				call('install',[path,packageUri]);
			}
		},kill:function(){
			//call('kill',[]);
			exec(onSucceed,onError, "ChatPlugin", "kill",[]);
		}
	};
	//

});

/** plugins\xsf.window\www\window.js */

var __ret = {};
function doChildViewDidUnload(){
    if(typeof(__ret.onClose) == "function"){
        __ret.onClose();
    }else{
        if(typeof(__ret.onExit) == "function"){
            __ret.onExit();
        }
    }
}
cordova.define("xsf.window", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "WindowPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		open : function(url,title,isToolBar){
            if(isToolBar){
            //alert(isToolBar)
               return window.open(url, '_blank', 'title=' + title + ',location=yes');
            }else{
               if(url.indexOf(":")<0){
                    var href = window.location.href;
                    var p = href.lastIndexOf("/");
                    if(p > 0){
                        url = href.substring(0,p+1) + url;
                    }
               }
               //alert(url);
               call('open',[url,title]);
               return __ret;
            }
		},
		open1 : function(url,title,callback){
            call('open1',[url,title],callback);
        },
        showTab : function(json,callback){
            call('showTab',[json],callback);
            return __ret;
        },
        close : function(n,callback){
            call('close',n?[n]:[],callback);
        },
        rotation : function(n,callback){
            call('rotation',[],callback);
        },
        resetRotation : function(n,callback){
            call('resetRotation',[],callback);
        },
        zoom : function(isZoom,callback){
            call('zoom',[isZoom],callback);
        }
               
	};

});

/** plugins\xsf.wps\www\wps.js */

cordova.define("xsf.wps", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
        onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "WPSPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		open : function(url,fileName,id,readOnly,revision,succeedCallback,errorCallback){
			call('open',[url,fileName,id,readOnly,revision],succeedCallback,errorCallback);
		}
	};

});

/** plugins\org.pgsqlite\www\SQLitePlugin.js */

cordova.define("org.pgsqlite.SQLitePlugin", function(require, exports, module) {
//
//(function() {
  var READ_ONLY_REGEX, SQLiteFactory, SQLitePlugin, SQLitePluginTransaction, argsArray, nextTick, root, txLocks;

  root = this;

  READ_ONLY_REGEX = /^\s*(?:drop|delete|insert|update|create)\s/i;

  txLocks = {};

  nextTick = window.setImmediate || function(fun) {
    window.setTimeout(fun, 0);
  };


  /*
    Utility that avoids leaking the arguments object. See
    https://www.npmjs.org/package/argsarray
   */

  argsArray = function(fun) {
    return function() {
      var args, i, len;
      len = arguments.length;
      if (len) {
        args = [];
        i = -1;
        while (++i < len) {
          args[i] = arguments[i];
        }
        return fun.call(this, args);
      } else {
        return fun.call(this, []);
      }
    };
  };

  SQLitePlugin = function(openargs, openSuccess, openError) {
    var dbname;
    console.log("SQLitePlugin openargs: " + (JSON.stringify(openargs)));
    if (!(openargs && openargs['name'])) {
      throw new Error("Cannot create a SQLitePlugin instance without a db name");
    }
    dbname = openargs.name;
    this.openargs = openargs;
    this.dbname = dbname;
    this.openSuccess = openSuccess;
    this.openError = openError;
    this.openSuccess || (this.openSuccess = function() {
      console.log("DB opened: " + dbname);
    });
    this.openError || (this.openError = function(e) {
      console.log(e.message);
    });
    this.open(this.openSuccess, this.openError);
  };

  SQLitePlugin.prototype.databaseFeatures = {
    isSQLitePluginDatabase: true
  };

  SQLitePlugin.prototype.openDBs = {};

  SQLitePlugin.prototype.addTransaction = function(t) {
    if (!txLocks[this.dbname]) {
      txLocks[this.dbname] = {
        queue: [],
        inProgress: false
      };
    }
    txLocks[this.dbname].queue.push(t);
    this.startNextTransaction();
  };

  SQLitePlugin.prototype.transaction = function(fn, error, success) {
    if (!this.openDBs[this.dbname]) {
      error('database not open');
      return;
    }
    this.addTransaction(new SQLitePluginTransaction(this, fn, error, success, true, false));
  };

  SQLitePlugin.prototype.readTransaction = function(fn, error, success) {
    if (!this.openDBs[this.dbname]) {
      error('database not open');
      return;
    }
    this.addTransaction(new SQLitePluginTransaction(this, fn, error, success, true, true));
  };

  SQLitePlugin.prototype.startNextTransaction = function() {
    var self;
    self = this;
    nextTick(function() {
      var txLock;
      txLock = txLocks[self.dbname];
      if (txLock.queue.length > 0 && !txLock.inProgress) {
        txLock.inProgress = true;
        txLock.queue.shift().start();
      }
    });
  };

  SQLitePlugin.prototype.open = function(success, error) {
    var onSuccess;
    onSuccess = (function(_this) {
      return function() {
        return success(_this);
      };
    })(this);
    if (!(this.dbname in this.openDBs)) {
      this.openDBs[this.dbname] = true;
      cordova.exec(onSuccess, error, "SQLitePlugin", "open", [this.openargs]);
    } else {

      /*
      for a re-open run onSuccess async so that the openDatabase return value
      can be used in the success handler as an alternative to the handler's
      db argument
       */
      nextTick(function() {
        return onSuccess();
      });
    }
  };

  SQLitePlugin.prototype.close = function(success, error) {
    if (this.dbname in this.openDBs) {
      delete this.openDBs[this.dbname];
      cordova.exec(success, error, "SQLitePlugin", "close", [
        {
          path: this.dbname
        }
      ]);
    }
  };

  SQLitePlugin.prototype.executeSql = function(statement, params, success, error) {
    var myerror, myfn, mysuccess;
    mysuccess = function(t, r) {
      if (!!success) {
        return success(r);
      }
    };
    myerror = function(t, e) {
      if (!!error) {
        return error(e);
      }
    };
    myfn = function(tx) {
      tx.executeSql(statement, params, mysuccess, myerror);
    };
    this.addTransaction(new SQLitePluginTransaction(this, myfn, null, null, false, false));
  };


  /*
  Transaction batching object:
   */

  SQLitePluginTransaction = function(db, fn, error, success, txlock, readOnly) {
    if (typeof fn !== "function") {

      /*
      This is consistent with the implementation in Chrome -- it
      throws if you pass anything other than a function. This also
      prevents us from stalling our txQueue if somebody passes a
      false value for fn.
       */
      throw new Error("transaction expected a function");
    }
    this.db = db;
    this.fn = fn;
    this.error = error;
    this.success = success;
    this.txlock = txlock;
    this.readOnly = readOnly;
    this.executes = [];
    if (txlock) {
      this.executeSql("BEGIN", [], null, function(tx, err) {
        throw new Error("unable to begin transaction: " + err.message);
      });
    }
  };

  SQLitePluginTransaction.prototype.start = function() {
    var err;
    try {
      this.fn(this);
      this.run();
    } catch (_error) {
      err = _error;

      /*
      If "fn" throws, we must report the whole transaction as failed.
       */
      txLocks[this.db.dbname].inProgress = false;
      this.db.startNextTransaction();
      if (this.error) {
        this.error(err);
      }
    }
  };

  SQLitePluginTransaction.prototype.executeSql = function(sql, values, success, error) {
    var qid;
    if (this.readOnly && READ_ONLY_REGEX.test(sql)) {
      this.handleStatementFailure(error, {
        message: 'invalid sql for a read-only transaction'
      });
      return;
    }
    qid = this.executes.length;
    this.executes.push({
      success: success,
      error: error,
      qid: qid,
      sql: sql,
      params: values || []
    });
  };

  SQLitePluginTransaction.prototype.handleStatementSuccess = function(handler, response) {
    var payload, rows;
    if (!handler) {
      return;
    }
    rows = response.rows || [];
    payload = {
      rows: {
        item: function(i) {
          return rows[i];
        },
        length: rows.length
      },
      rowsAffected: response.rowsAffected || 0,
      insertId: response.insertId || void 0
    };
    handler(this, payload);
  };

  SQLitePluginTransaction.prototype.handleStatementFailure = function(handler, response) {
    if (!handler) {
      throw new Error("a statement with no error handler failed: " + response.message);
    }
    if (handler(this, response)) {
      throw new Error("a statement error callback did not return false");
    }
  };

  SQLitePluginTransaction.prototype.run = function() {
    var batchExecutes, handlerFor, i, mycb, mycbmap, qid, request, tropts, tx, txFailure, waiting;
    txFailure = null;
    tropts = [];
    batchExecutes = this.executes;
    waiting = batchExecutes.length;
    this.executes = [];
    tx = this;
    handlerFor = function(index, didSucceed) {
      return function(response) {
        var err;
        try {
          if (didSucceed) {
            tx.handleStatementSuccess(batchExecutes[index].success, response);
          } else {
            tx.handleStatementFailure(batchExecutes[index].error, response);
          }
        } catch (_error) {
          err = _error;
          if (!txFailure) {
            txFailure = err;
          }
        }
        if (--waiting === 0) {
          if (txFailure) {
            tx.abort(txFailure);
          } else if (tx.executes.length > 0) {

            /*
            new requests have been issued by the callback
            handlers, so run another batch.
             */
            tx.run();
          } else {
            tx.finish();
          }
        }
      };
    };
    i = 0;
    mycbmap = {};
    while (i < batchExecutes.length) {
      request = batchExecutes[i];
      qid = request.qid;
      mycbmap[qid] = {
        success: handlerFor(i, true),
        error: handlerFor(i, false)
      };
      tropts.push({
        qid: qid,
        query: [request.sql].concat(request.params),
        sql: request.sql,
        params: request.params
      });
      i++;
    }
    mycb = function(result) {
      var q, r, res, type, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        r = result[_i];
        type = r.type;
        qid = r.qid;
        res = r.result;
        q = mycbmap[qid];
        if (q) {
          if (q[type]) {
            q[type](res);
          }
        }
      }
    };
    cordova.exec(mycb, null, "SQLitePlugin", "backgroundExecuteSqlBatch", [
      {
        dbargs: {
          dbname: this.db.dbname
        },
        executes: tropts
      }
    ]);
  };

  SQLitePluginTransaction.prototype.abort = function(txFailure) {
    var failed, succeeded, tx;
    if (this.finalized) {
      return;
    }
    tx = this;
    succeeded = function(tx) {
      txLocks[tx.db.dbname].inProgress = false;
      tx.db.startNextTransaction();
      if (tx.error) {
        tx.error(txFailure);
      }
    };
    failed = function(tx, err) {
      txLocks[tx.db.dbname].inProgress = false;
      tx.db.startNextTransaction();
      if (tx.error) {
        tx.error(new Error("error while trying to roll back: " + err.message));
      }
    };
    this.finalized = true;
    if (this.txlock) {
      this.executeSql("ROLLBACK", [], succeeded, failed);
      this.run();
    } else {
      succeeded(tx);
    }
  };

  SQLitePluginTransaction.prototype.finish = function() {
    var failed, succeeded, tx;
    if (this.finalized) {
      return;
    }
    tx = this;
    succeeded = function(tx) {
      txLocks[tx.db.dbname].inProgress = false;
      tx.db.startNextTransaction();
      if (tx.success) {
        tx.success();
      }
    };
    failed = function(tx, err) {
      txLocks[tx.db.dbname].inProgress = false;
      tx.db.startNextTransaction();
      if (tx.error) {
        tx.error(new Error("error while trying to commit: " + err.message));
      }
    };
    this.finalized = true;
    if (this.txlock) {
      this.executeSql("COMMIT", [], succeeded, failed);
      this.run();
    } else {
      succeeded(tx);
    }
  };

  SQLiteFactory = {

    /*
    NOTE: this function should NOT be translated from Javascript
    back to CoffeeScript by js2coffee.
    If this function is edited in Javascript then someone will
    have to translate it back to CoffeeScript by hand.
     */
    open: argsArray(function(args) {
      var errorcb, first, okcb, openargs;
      if (args.length < 1) {
        return null;
      }
      first = args[0];
      openargs = null;
      okcb = null;
      errorcb = null;
      if (first.constructor === String) {
        openargs = {
          name: first
        };
        if (args.length >= 5) {
          okcb = args[4];
          if (args.length > 5) {
            errorcb = args[5];
          }
        }
      } else {
        openargs = first;
        if (args.length >= 2) {
          okcb = args[1];
          if (args.length > 2) {
            errorcb = args[2];
          }
        }
      }
      return new SQLitePlugin(openargs, okcb, errorcb);
    }),
    delete: function(databaseName, success, error) {
      delete SQLitePlugin.prototype.openDBs[databaseName];
      return cordova.exec(success, error, "SQLitePlugin", "delete", [
        {
          path: databaseName
        }
      ]);
    }
  };

  root.sqlitePlugin = {
    sqliteFeatures: {
      isSQLitePlugin: true
    }//,
    //openDatabase: SQLiteFactory.opendb,
    //deleteDatabase: SQLiteFactory.deleteDb
  };
    module.exports = SQLiteFactory;
//}).call(this);
//
});

/** plugins\xsf.http\www\http.js */

cordova.define("xsf.http", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "HttpPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		get : function(url,params,onSucceed,onError){
			call('get',[url,params,'text'],onSucceed,onError);
        },getJSON : function(url,params,onSucceed,onError){
            call('get',[url,params,'json'],onSucceed,onError);
        },post : function(url,params,onSucceed,onError){
            call('post',[url,params,'text'],onSucceed,onError);
        },postJSON : function(url,params,onSucceed,onError){
            call('post',[url,params,'json'],onSucceed,onError);
        },postData : function(url,data,onSucceed,onError){
            call('postData',[url,data,'json'],onSucceed,onError);
        },download : function(url,filePath,onSucceed,onError){
            //call('download',[url],onSucceed,onError);
            var fileTransfer = new xsf.FileTransfer();
            fileTransfer.download(
                url,
                filePath,
                onSucceed,
                onError,
                false,{}
            );
            return fileTransfer;
        },upload : function(path,url,onSucceed,onError){
            //call('upload',[path,url],onSucceed,onError);
            var fileTransfer = new xsf.FileTransfer();
            fileTransfer.upload(
                path,
                url,
                onSucceed,
                onError,
                {}
            );
            return fileTransfer;
        },ajax : function(options){
            if(options.dataType == 'jsonp'){
               options.dataType = 'json';
            }
            if(options.type == null ||
            	typeof(options.type) == "undefined"){
            	options.type = "get"
            }
            if(options.type == "GET" || options.type == "get" ){
                call('get',[options.url,options.data,options.dataType],options.success,options.error);
            }else if(options.type == "POST" || options.type == "post" ){
                call('post',[options.url,options.data,options.dataType],options.success,options.error);
            }
        }
        
	};

});

/** plugins\com.phonegap.plugins.fileopener\www\fileopener.js */

cordova.define("com.phonegap.plugins.fileopener.FileOpener", function(require, exports, module) { /*
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2011, IBM Corporation
 */

/**
 * Constructor
 */
/*
function FileOpener() {
};

FileOpener.prototype.open = function(url) {

};
*/
/**
 * Load Plugin
 */
/*
if(!window.plugins) {
    window.plugins = {};
}

if (!window.plugins.fileOpener) {
    window.plugins.fileOpener = function (url) {
        cordova.exec(null, null, "FileOpener", "openFile", [url]);
    };
}
*/


var fileOpener = {
    open : function (url) {
         cordova.exec(null, null, "FileOpener", "openFile", [url]);
    }
};

module.exports = fileOpener;
});

/** plugins\xsf.mobile\www\mobile.js */

cordova.define("xsf.mobile", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "MobilePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		telto : function(tel){
			call('telto',[tel]);
		},
		smsto : function(tel){
			call('smsto',[tel]);
		}
	};

});

/** plugins\xsf.record\www\record.js */

cordova.define("xsf.record", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succees,error){
		succees = succees || onSucceed;
		error = error || error;
		exec(succees,error, "RecordPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		start : function(path,succees,error){
			call('start',[path],succees,error);
		},
		pause : function(succees,error){
			call('pause',[],succees,error);
		},
		resume : function(succees,error){
			call('resume',[],succees,error);
		},
		stop : function(succees,error){
			call('stop',[],succees,error);
		}
	};

});

/** plugins\xsf.recognition\www\recognition.js */

cordova.define("xsf.recognition", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succees,error){
		succees = succees || onSucceed;
		error = error || error;
		exec(succees,error, "RecognitionPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		start : function(succees,error){
			call('start',[],succees,error);
		}
	};

});

/** plugins\xsf.zip\www\zip.js */

cordova.define("xsf.zip", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "ZipPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		zip : function(from,to,onSucceed,onError){
			call('zip',[from,to],onSucceed,onError);
        },unzip : function(from,to,onSucceed,onError){
            call('unzip',[from,to],onSucceed,onError);
        }
	};

});

/** plugins\xsf.nfc\www\nfc.js */

cordova.define("xsf.nfc", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "NFCPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		getData : function(onSucceed,onError){
			call('getData',[],onSucceed,onError);
        },
        clear : function(onSucceed,onError){
			call('clear',[],onSucceed,onError);
        }
	};

});

/** plugins\xsf.signature\www\signature.js */

cordova.define("xsf.signature", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "SignaturePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		show : function(onSucceed,onError){
			call('show',[],onSucceed,onError);
        }
	};

});

/** plugins\xsf.store\www\store.js */

cordova.define("xsf.store", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "StorePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		get : function(key,defaultValue,onSucceed,onError){
			if(typeof(defaultValue) == "function"){//考虑兼容
				onSucceed = defaultValue;
				defaultValue = null;
				onError = null;
			}
			call('get',[key,defaultValue],onSucceed,onError);
        },set : function(key,value,onSucceed,onError){
            call('set',[key,value],onSucceed,onError);
        },remove : function(key,onSucceed,onError){
            call('remove',[key],onSucceed,onError);
        },clear : function(onSucceed,onError){
            call('clear',[],onSucceed,onError);
        },save : function(data,onSucceed,onError){
        	call('save',[data],onSucceed,onError);
        },insert : function(data,filter,onSucceed,onError){
        	call('insert',[data],onSucceed,onError);
        },update : function(data,filter,onSucceed,onError){
        	call('update',[data,filter],onSucceed,onError);
        },delete : function(filter,onSucceed,onError){
        	call('delete',[filter],onSucceed,onError);
        },query : function(filter,onSucceed,onError){
        	call('query',[filter],onSucceed,onError);
        }
	};

});

/** plugins\xsf.store\www\storeEx.js */

cordova.define("xsf.storeEx", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "StorePluginEx", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		get : function(key,defaultValue,onSucceed,onError){
			if(typeof(defaultValue) == "function"){//考虑兼容
				onSucceed = defaultValue;
				defaultValue = null;
				onError = null;
			}
			call('get',[key,defaultValue],onSucceed,onError);
        },set : function(key,value,onSucceed,onError){
            call('set',[key,value],onSucceed,onError);
        },remove : function(key,onSucceed,onError){
            call('remove',[key],onSucceed,onError);
        },clear : function(onSucceed,onError){
            call('clear',[],onSucceed,onError);
        },save : function(data,onSucceed,onError){
        	call('save',[data],onSucceed,onError);
        },insert : function(data,filter,onSucceed,onError){
        	call('insert',[data],onSucceed,onError);
        },update : function(data,filter,onSucceed,onError){
        	call('update',[data,filter],onSucceed,onError);
        },delete : function(filter,onSucceed,onError){
        	call('delete',[filter],onSucceed,onError);
        },query : function(filter,onSucceed,onError){
        	call('query',[filter],onSucceed,onError);
        }
	};

});

/** plugins\xsf.bdmap\www\bdmap.js */

cordova.define("xsf.bdmap", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "BDMapPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
		openMultiRoutePlan : function(url,isWebViewVisible,onSucceed,onError){
			call('openMultiRoutePlan',[url , isWebViewVisible],onSucceed,onError);
        },loadMultiRoutePlan : function(data,onSucceed,onError){
			call('loadMultiRoutePlan',[data],onSucceed,onError);
        },loadCurrentPosition : function(onSucceed,onError){
			call('loadCurrentPosition',[],onSucceed,onError);
        },getCurrentPosition : function(onSucceed,onError){
			call('getCurrentPosition',[],onSucceed,onError);
		},loadAddressByPosition : function(lat, lng,onSucceed,onError){
			call('loadAddressByPosition',[lat, lng],onSucceed,onError);
        },getAddressByPosition : function(lat, lng,onSucceed,onError){
			call('getAddressByPosition',[lat, lng],onSucceed,onError);
        },openAddressByPostion : function(lat, lng,onSucceed,onError){
			call('openAddressByPosition',[lat, lng],onSucceed,onError);
        },loadPositionByAddress : function(data, onSucceed,onError){
			call('loadPositionByAddress',[data],onSucceed,onError);
        },getPositionByAddress : function(data, onSucceed,onError){
			call('getPositionByAddress',[data],onSucceed,onError);
        },openPositionByAddress : function(data,onSucceed,onError){
			call('openPositionByAddress',[data],onSucceed,onError);
        },openBaseMap : function(url,isWebViewVisible,onSucceed,onError){
			call('openBaseMap',[url,isWebViewVisible],onSucceed,onError);
        },setPoint : function(data,onSucceed,onError){
			call('setPoint',[data],onSucceed,onError);
        },searchPOI : function(onSucceed,onError){
			call('searchPOI',[],onSucceed,onError);
        },getSearchPOI : function(onSucceed,onError){
			call('getSearchPOI',[],onSucceed,onError);
        },aroundPOI : function(onSucceed,onError){
			call('aroundPOI',[],onSucceed,onError);
        },getAroundPOI : function(onSucceed,onError){
			call('getAroundPOI',[],onSucceed,onError);
        },openSetting : function(onSucceed,onError){
			call('openSetting',[],onSucceed,onError);
        },openOfflineMap : function(onSucceed,onError){
			call('openOfflineMap',[],onSucceed,onError);
        },routePlan : function(type, startLat, startLng, endLat, endLng, onSucceed,onError){
			call('routePlan',[type, startLat, startLng, endLat, endLng],onSucceed,onError);
        },getRoutePlan : function(type, startLat, startLng, endLat, endLng, onSucceed,onError){
			call('getRoutePlan',[type, startLat, startLng, endLat, endLng],onSucceed,onError);
        },loadInspectionPoint : function(data, onSucceed,onError){
			call('loadInspectionPoint',[data],onSucceed,onError);
        },openInspectionPoint : function(isWebViewVisible, data, onSucceed,onError){
			call('openInspectionPoint',[isWebViewVisible, data],onSucceed,onError);
        },openNavigator : function(data, onSucceed,onError){
			call('openNavigator', [data] ,onSucceed,onError);
        },setOptions : function(type,state, onSucceed,onError){
			call('setOptions', [type,state] ,onSucceed,onError);
        }
	};
});

/** plugins\xsf.datetimepicker\www\datetimepicker.js */

cordova.define("xsf.datetimepicker", function(require, exports, module) {

	function onSucceed(args){
		alert("succeed:" + args);
	}
	function onError(err){
		alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError,"DateTimePickerPlugin", callee,args);
	}	
	var exec = require('cordova/exec');
	module.exports = {
    		pick:function(dateType,defauleDate,startDate,endDate,onSucceed,onError){	
    			call("pick", [dateType,defauleDate,startDate,endDate],onSucceed,onError);
			}
	};
});

/** plugins\xsf.orguserpicker\www\orguserpicker.js */

cordova.define("xsf.orguserpicker", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "OrgUserPickerPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
			pick : function(dataJson, parameterJson,onSucceed,onError){
			call('pick',[dataJson, parameterJson],onSucceed,onError);
        }
	};
});

/** plugins\xsf.datasync\www\datasync.js */

cordova.define("xsf.datasync", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "DataSyncPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
		dataSync : function(onSucceed,onError){
			call('dataSync',[],onSucceed,onError);
        }, upload : function(onSucceed,onError){
        	call('upload',[],onSucceed,onError);
        }
	};
});

/** plugins\xsf.pushmessage\www\pushmessage.js */

cordova.define("xsf.pushmessage", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "PushMessagePlugin", callee,args);
	}
	
	
	var exec = require('cordova/exec');
	module.exports = {
		startPushMessage : function(data,onSucceed,onError){
			call('startPushMessage',[data],onSucceed,onError);
        },stopPushMessage : function(onSucceed,onError){
			call('stopPushMessage',[],onSucceed,onError);
        }
	};
});
