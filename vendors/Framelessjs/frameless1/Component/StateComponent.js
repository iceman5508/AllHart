/**
 * Component class
 * for templating
 * Isaac Parker 2/10/2019
 */
class StateComponent {



    /**
     * constructor
     *
     */
    constructor(params) {

        let self = this;
        if (new.target === StateComponent) {
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

/**
 * Class for handling state subscribers
 * and state publisher
 * Isaac Parker 2/10/2019
 */
class Dispatch{
    constructor(){
        this.events = {};
    }

    /**
     * Create a unique event and the callback for the event
     * @param event
     * @param callback
     */
    subscribe(event,callback){
        let self=this;

        if(!self.events.hasOwnProperty(event)){
            self.events[event] = [];
        }

        return self.events[event].push(callback);

    }

    /**
     * execute the callback function for a particular event
     * @param event - the event to publish
     * @param data - the params
     * @returns {*}
     */
    publish(event, data={}){
        let self=this;

        if(!self.events.hasOwnProperty(event)){
            return [];
        }

        return self.events[event].map(callback=>callback(data));
    }
}
/**
 * Core state manager class for handling states
 * as well as managing subscriptions and publishing events
 * Isaac Parker 2/10/2019
 *
 * credit: Andy Bell github andybelldesign
 * https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
 *
 * Modified version of script above
 */
class StateManager {
    constructor(params) {
        let self= this;
        self.actions={};
        self.mutations = {};
        self.state = {};
        self.status = 'observing';


        self.events = new Dispatch();

        if(params.hasOwnProperty('actions')){
            self.actions=params.actions;
        }
        if(params.hasOwnProperty('mutations')){
            self.mutations=params.mutations;
        }


        self.state = new Proxy((params.state || {}), {
            set:function (state, key, value) {
                state[key] = value;

                console.log(`stateChange: ${key}: ${value}`);

                self.events.publish('stateChange', self.state);

                if(self.status !=='mutation'){
                    console.warn(`You should use a mutation to set ${key}`);
                }

                self.status = 'observing';
                return true;
            }
        });

    }

    /**
     * Call the event action
     * @param action - the action
     * @param params - the params for the action
     */
    dispatch(action, params){
        let self=this;

        if(typeof self.actions[action] !== 'function'){
            console.error((`Action ${action} does not exist`));
            return false;
        }

        console.groupCollapsed(`Action: ${action}`);

        self.status = 'action';

        self.actions[action](self, params);

        console.groupEnd();

        return true;
    }

    /**
     * Calls our mutation
     * @param mutation - mutation
     * @param params - params
     */
    commit(mutation, params){
        let self=this;

        if(typeof self.mutations[mutation] !== 'function'){
            console.error((`Mutation ${mutation} does not exist`));
            return false;
        }

        self.status = 'mutation';

        let newState = self.mutations[mutation](self.state, params);

        self.state = Object.assign(self.state, newState);

        return true;
    }


}