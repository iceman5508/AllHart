import StateManager from  '../StateManager/StateManager.js';
/**
 * Component class
 * for templating
 * Isaac Parker 2/10/2019
 */
export default class Component {



    /**
     * constructor
     *
     */
    constructor(params) {

        let self = this;
        if (new.target === Component) {
            throw new TypeError("You must extend this class");
        }

        this.render = this.render || function () {};

        this.template='';

        this.props = params || {StateManager : new StateManager()};

        if(self.props.StateManager instanceof  StateManager){
            self.props.StateManager.events.subscribe('stateChange', ()=>self.render());
        }

        if(self.props.hasOwnProperty('element')) {
            this.element = self.props.element;
        }






    }

    /**
     * sets the template as html data given or from external url
     * @param temp - the template. Can be html or url to html file
     * if false then temp is html data
     */
    setTemplate(temp, callback, params={} ){


        if(this.isHTML(temp) == false){
            this.loadRemoteTemplate(temp,callback,params);


        }else{

            this.template = this.templateParams(temp, params);

        }

    }


    /**
     * Load the template url
     * @param url
     */
    loadRemoteTemplate(url, callback, params={}) {

        let _this = this;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) return;

            if (this.status == 200) {


                _this.template =  _this.templateParams(this.responseText,params);




                callback(_this.template);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    /**
     *parent draw function.
     * Can be used inside empty render function
     */
    draw(id){

        id = id || this.element.id;

        if(this.isElement(this.template)){
            document.getElementById(id).appendChild(this.template);

        }else {
            document.getElementById(id).innerHTML = this.template;
        }
    }




    isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );


    }

    /**
     * Attach parameters to a template
     * @param template - the template
     * @param params - the parameters
     * @returns {*}
     */
    templateParams(template, params){
        if(Object.keys(params).length > 0) {
            let param2 = [];
            for (let key in params) {
                let val = '{{' + key + '}}';
                param2[val] = params[key];
            }

            var re = new RegExp(Object.keys(param2).join("|"), "gi");
            template = template.replace(re, function (matched) {
                return param2[matched];
            });
        }
        return template;
    }

    /**
     * check if string is html or not
     * @param str
     * @returns {boolean}
     */
    isHTML(str) {
        let a = document.createElement('div');
        a.innerHTML = str;

        for (let c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) return true;
        }

        return false;
    }


};
