import Dispatch from './Dispatch.js';

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
export default  class StateManager {
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