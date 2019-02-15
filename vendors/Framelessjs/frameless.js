/**
 * Created by iparker1 on 2/7/2019.
 * frameless framework
 *Created to allow for the creation of simple single page applications
 *
 */


let frameless = (function () {
    let clicked_element = 0;
    let previous_clicked = 0;

    return {clicked_element, previous_clicked}

})();


/**********************************************Modules************************************************/

/**
 * client side router
 * @type {{run, add, routerLink}}
 */
frameless.Router = (function () {

    let routes = [];


    function getHash() {
        let fragment = window.location.hash.substring(1);
        return '/'+cleanPath(fragment);
    }

    function cleanPath(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    function check(route) {
        var hash2 = route || getHash();
        var  keys, match, routeParams;
        for (var i = 0, max = routes.length; i < max; i++ ) {
            routeParams = {}
            keys = routes[i].path.match(/:([^\/]+)/g);
            match = hash2.match(new RegExp(routes[i].path.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                routes[i].action.call({}, routeParams);
                return this;
            }
        }
        return this;
    }

    /**
     * Add a route to the router
     * @param path - the path
     * @param action - the function to run
     * @returns {add} - the router object
     */
    function add (path ='', action) {
        if(typeof path == 'function') {
            action = path;
            path = '';
        }
        routes.push({ path: path, action: action});
        return this;
    }

    /**
     * This method is required  after adding all routes
     * @returns {run}
     */
    function run() {

        var current = '';

        var fn = function() {
            if(current !== getHash()) {
                current = getHash();
                check(current);
            }
        };
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    }

    /**
     * The router link method for
     * creating links in the html
     * @param route - the route to post as link
     * @param params - the parameters
     */
    function routerLink(route, params = {}, topscroll = false) {
        if(Object.keys(params).length > 0)
        {
            var re = new RegExp(Object.keys(params).join("|"),"gi");
            route = route.replace(re, function(matched){
                return params[matched];
            });
        }

        if(route=='/' || route=='#' ){
            route='';
        }

        let target = event.target;
        if(frameless.clicked_element == 0)
        {
            frameless.clicked_element = event.target;
            frameless.previous_clicked = event.target;
        }else{

            frameless.previous_clicked = frameless.clicked_element;
            frameless.clicked_element = event.target;
        }
        if(topscroll){
            window.scrollTo(0,0);
        }
        target.href='#'+route;
    }


    /**
     * The public methods to use
     */
    return {
        run
        ,add
        ,routerLink
    }
})();



/**
 * Http module
 * @type {{post, get}}
 */
frameless.http = (function () {


    /**
     * The get method for making get requests
     * @param url
     * @param params
     * @param callback
     */
    function get(url, params={}, callback) {
        var xhr = new XMLHttpRequest();

        var param = typeof params == 'string' ? params : Object.keys(params).map(
            function(k){ return encodeURComponent(k) + '=' + encodeURComponent(params[k]) }
        ).join('&');



        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status == 200) {
                callback(this.responseText);
            }


        };

        xhr.open('GET', url+'?'+param, true);
        xhr.send();
    }

    /**
     * Post request
     * @param url
     * @param params
     * @param callback
     */
    function post(url, params={}, callback) {
        var xhr = new XMLHttpRequest();

        var param = typeof params == 'string' ? params : Object.keys(params).map(
            function(k){ return encodeURComponent(k) + '=' + encodeURComponent(params[k]) }
        ).join('&');

        xhr.setRequestHeader('Content-Type', 'application/json');


        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status == 200) {
                callback(this.responseText);
            }


        };

        xhr.open('POST', url+'?'+param, true);
        xhr.send();
    }

    return {
        post
        ,get

    };

})();

/**
 * URL module
 * @type {{getParam, currentPage, url, hash, currentHost, projectFolder, previousPage, redirect}}
 */
frameless.URL = (function () {

    /**
     * Return param values
     * @param name - the name
     * @param url - the url
     * @returns {*}
     */
    function getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
     * Return the current page being viewed
     * @returns {*}
     */
    function currentPage() {
        var path =  window.location.pathname;
        return path.split("/").pop();
    }

    /**
     * Return the current url
     */
    function url() {
        return window.location.href;
    }

    /**
     * Return all hash in the url
     * @returns {string}
     */
    function hash() {
        return location.hash;
    }

    /**
     * Return the current Host
     * @returns {string}
     */
    function currentHost() {
        return window.location.hostname;
    }

    /**
     * Get the current project folder
     * @returns {*}
     */
    function projectFolder() {
        var pathArray = location.pathname.split('/');
        var appPath = "";
        for(var i=1; i<pathArray.length-1; i++) {
            appPath += pathArray[i] + "/";
        }
        return appPath;
    }

    /**
     * Return the url
     * @returns {string}
     */
    function previousPage() {
        return document.referrer
    }

    /**
     * redirect the url to another location
     * @param url
     */
    function redirect(url) {
        window.location = url;
    }


    return {
        getParam : getParam
        ,currentPage : currentPage
        ,url : url
        ,hash:hash
        ,currentHost : currentHost
        ,projectFolder : projectFolder
        ,previousPage : previousPage
        ,redirect : redirect
    }

})();



/**
 * Handle date formating
 * @type {{alpha, numeric}}
 */
frameless.DateFormat =  (function () {

    var alpha = {dmy:ADMY, mdy:AMDY,dmy2:ADMY2, mdy2:AMDY2};
    var numeric = {dmy:NMDY};

    /**
     * Return alpha day month year format
     * @param date
     * @returns {string}
     */
    function ADMY(date) {
        var date = new Date(date);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ', ' + monthNames[monthIndex] + ', ' + year;
    }

    /**
     * Return alpha  month day year format
     * @param date
     * @returns {string}
     */
    function AMDY(date) {
        var date = new Date(date);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }

    /**
     * Return alpha day month year format
     * @param date
     * @returns {string}
     */
    function ADMY2(date) {
        var date = new Date(date);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var day = date.getDay();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return days[day] + ', ' + monthNames[monthIndex] + ' '+date.getDate()+' , ' + year;
    }

    /**
     * Return alpha  month day year format
     * @param date
     * @returns {string}
     */
    function AMDY2(date) {
        var date = new Date(date);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var day = date.getDay();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + days[day] +' '+date.getDate()+', ' + year;
    }

    /**
     * Return numeric date in month day year format
     * @param date
     * @returns {string|Date}
     * @constructor
     */
    function NMDY(date){
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10){dd = '0'+dd}
        if(mm<10){mm = '0'+mm}
        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }






    return {
        alpha
        ,numeric
    }

})();

/**
 * handle time formating
 * @type {{hoursBetween, amPm}}
 */
frameless.TimeFormat = (function () {

    /**
     * Return the hours between two give date(time)
     * @param date1
     * @param date2
     * @returns {number}
     */
    function getHoursBetween(date1, date2){
        return Math.abs(new Date(date1) - new Date(date2)) / 36e5;
    }

    /**
     * Format time to am and pm
     * @param time - the time to format
     * @returns {string} - string of formatted time
     */
    function ampm(time) {
        let date = new Date(time);
        time = date.getHours()+' '+date.getMinutes();
        var hours = time.substring(0, 2);
        var minutes = time.substring(3, 5);
        var ampm = hours >= 12 ? 'pm' : 'am'; hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm; return strTime;
    }



    return {
        hoursBetween : getHoursBetween
        ,amPm:ampm
    }

})();

/**
 * pagination
 * @type {{paginate}}
 */
frameless.Paginate = (function () {

    /**
     *
     * @param items
     * @param page
     * @param per_page
     * @returns {{page: (*|number), per_page: (*|number), pre_page: *, next_page: null, total: *, total_pages: number, data: *}}
     * @constructor
     */
    function Paginator(items, page, per_page) {

        var page = page || 1,
            per_page = per_page || 10,
            offset = (page - 1) * per_page,

            paginatedItems = items.slice(offset).slice(0, per_page),
            total_pages = Math.ceil(items.length / per_page);
        return {
            page: page,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: items.length,
            total_pages: total_pages,
            data: paginatedItems
        };
    }

    /**
     *
     */
    return {
        paginate: Paginator

    }

})();



/***************************************Classes************************************************************/

/**
 * Session manager
 * @constructor
 */
frameless.Session=function(){var t=!1,e=!1;function o(t){for(var e=t+"=",o=document.cookie.split(";"),r=0;r<o.length;r++){for(var n=o[r];" "==n.charAt(0);)n=n.substring(1,n.length);if(0==n.indexOf(e))return n.substring(e.length,n.length)}return null}function r(t){document.cookie=t+"=; Max-Age=-99999999;"}this.compatible=function(){"undefined"!=typeof Storage?e=!0:navigator.cookieEnabled&&(t=!0,e=!0)},this.compatible(),this.put=function(o,r){return e?(t?function(t,e,o){var r="";if(o){var n=new Date;n.setTime(n.getTime()+24*o*60*60*1e3),r="; expires="+n.toUTCString()}document.cookie=t+"="+(e||"")+r+"; path=/"}(o,r,7):localStorage.setItem(o,r),!0):(alert("Your browser does not support our storage method! Application will not work as expected!"),!1)},this.get=function(r){if(e)return t?o(r):localStorage.getItem(r);alert("Your browser does not support our storage method! Application will not work as expected!")},this.delete=function(o){return e?(t?r(o):localStorage.removeItem(o),!0):(alert("Your browser does not support our storage method! Application will not work as expected!"),!1)},this.clearAll=function(){if(e){if(t)for(var o=document.cookie.split(";"),n=0;n<o.length;n++)r(o[n].split("=")[0]);else localStorage.clear();return!0}return alert("Your browser does not support our storage method! Application will not work as expected!"),!1},this.exists=function(r){return e?t?null!=o(r):null!==localStorage.getItem(r):(alert("Your browser does not support our storage method! Application will not work as expected!"),!1)}}

/**
 * Manages and clean form data
 * @constructor
 */
frameless.FormCleaner = function(){this.hijackForm=function(id,dataRules,Callback=function(status,data){console.log(data)}){var form=document.getElementById(id);form.addEventListener("submit",function(e){var formData=new n_formData(id);new n_validator(formData,dataRules);if(formData.error.length>0){e.preventDefault();Callback(!1,formData.error)}else{Callback(!0,{})}})}};function n_formData(formId){this.tag=formId;this.data={};this.error=[];this.getFormData=function(){var elements=document.getElementById(this.tag).elements;var obj={};for(var i=0;i<elements.length;i++){var item=elements.item(i);obj[item.name]=item.value}
    this.data=obj};this.getFormData();this.getData=function(name){return this.data[name]};this.toString=function(){return JSON.stringify(this.data)};this.isFieldEmpty=function(name){if(typeof this.data[name]==='undefined'){return!0}
    if(!this.data[name]){return!0}
    return!1};this.compareFields=function(field1,field2){var val1=this.data[field1].trim();var val2=this.data[field2].trim();return(val1.toLowerCase().localeCompare(val2.toLowerCase())==0?!0:!1)}};n_dataType=new function(){this.isNumeric=function(data){var t1=!Array.isArray(data)&&(data-parseFloat(data)+1)>=0;var t2=!isNaN(parseFloat(data))&&isFinite(data);return t2||t1?true:!1}
    this.isString=function(data){if(typeof data==='string'||data instanceof String){if(!this.isNumeric(data)){return!0}}return!1}
    this.isBoolean=function(data){return(typeof(data)==typeof(!0))}};n_pattern=new function(){this.isEmail=function(data){var email=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return email.test(String(data).toLowerCase())}
    this.isSocial=function(data){var ssn=/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;return ssn.test(data)}
    this.isPhone=function(data){var phone=/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;return phone.test(data)}
    this.patternMatch=function(data,pattern){var patternArray=pattern.split('');var dataArray=data.split('');var valid=!1;if(patternArray.length==dataArray.length){for(var i=0;i<patternArray.length;i++){var value=dataArray[i];if(patternArray[i]=='n'){if(n_dataType.isNumeric(value)){valid=!0}}else if(patternArray[i]=='a'){if(!n_dataType.isNumeric(value)&&value==value.toLowerCase()){valid=!0}}else if(patternArray[i]=='A'){if(!n_dataType.isNumeric(value)&&value==value.toUpperCase()){valid=!0}}else if(patternArray[i]==value){valid=!0}else{valid=!1}
        if(!valid){break}}}
        return valid}};n_validator=function(formData,dataRule={}){this.data={};this.constructor=function(){this.data=formData.data;for(var field in dataRule){var value=this.data[field];var name=dataRule[field].displayName;var validData=!0;for(var rule in dataRule[field]){var ruleValue=dataRule[field][rule];switch(rule){case 'max':if(!this.maxCheck(value,ruleValue)){formData.error.push(name+" has more char than the max of "+ruleValue);validData=!1}
    break;case 'min':if(!this.minCheck(value,ruleValue)){formData.error.push(name+" must be at least "+ruleValue+" chars.");validData=!1}
    break;case 'required':if(this.requiredCheck(field,ruleValue)){formData.error.push(name+" is a required field");validData=!1}
    break;case 'dataType':if(!this.typeCheck(value,ruleValue.toLowerCase())){formData.error.push(name+" is expected to be of type "+ruleValue);validData=!1}
    break;case 'patternType':if(!this.patternCheck(value,ruleValue.toLowerCase())){formData.error.push(name+" is expected to be a valid "+ruleValue);validData=!1}
    break;case 'matchField':if(!this.matchCheck(field,ruleValue)){formData.error.push(name+" does not match the "+ruleValue+" field.");validData=!1}
    break;case 'myPattern':if(!this.myPatternCheck(value,ruleValue)){formData.error.push(name+" is expected to be in a format as such:  "+ruleValue);validData=!1}
    break;default:break}}
    var erroredField=document.getElementById(formData.tag).elements[field];if(validData==!1){if(!erroredField.classList.contains('n_err')){erroredField.classList.add("n_err")}}else{if(erroredField.classList.contains('n_err')){erroredField.classList.remove("n_err")}}}}
    this.minCheck=function(data,min){return data.length>=min?!0:!1}
    this.maxCheck=function(data,max){return data.length<=max?!0:!1}
    this.requiredCheck=function(data,required){if(required===!0){return formData.isFieldEmpty(data)}else return!1}
    this.patternCheck=function(data,pattern){switch(pattern){case 'email':return n_pattern.isEmail(data);break;case 'ssn':return n_pattern.isSocial(data);break;case 'phone':return n_pattern.isPhone(data);break;default:return!1;break}}
    this.myPatternCheck=function(data,patter){return n_pattern.patternMatch(data,patter)}
    this.typeCheck=function(data,dataType){switch(dataType){case 'string':return n_dataType.isString(data);break;case 'number':return n_dataType.isNumeric(data);break;case 'boolean':return n_dataType.isBoolean(data);break;default:return!1;break}}
    this.matchCheck=function(fieldName,compareFieldName){return formData.compareFields(fieldName,compareFieldName)}
    this.constructor()};