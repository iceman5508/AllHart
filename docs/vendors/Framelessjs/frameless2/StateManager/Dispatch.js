/**
 * Class for handling state subscribers
 * and state publisher
 * Isaac Parker 2/10/2019
 */
export default class Dispatch{
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