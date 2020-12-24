import {


    SET_STATE,
} from './types';

import React from 'react';
import {I18nManager, View} from 'react-native';
import {DEFINITIONS, TYPE_OF_SNACK_BAR} from "../utils";

const initialState = {
    [DEFINITIONS.IS_LOG_IN]: false,
    [DEFINITIONS.SNACK_BAR]:{
        [DEFINITIONS.SHOW_SNACK_BAR]:false,
        [DEFINITIONS.ACTION_ON_SNACK_BAR]:()=>{},
        [DEFINITIONS.SNACK_BAR_TYPE]:TYPE_OF_SNACK_BAR.WARNING,
        [DEFINITIONS.TEXT_ON_SNACK_BAR]:'',
        [DEFINITIONS.TIME_TO_SHOW_SNACK_BAR]:0,
        [DEFINITIONS.TITLE_ON_SNACK_BAR]:'',

    },
    [DEFINITIONS.USER]:{
        [DEFINITIONS.USER_NAME]:'',
        [DEFINITIONS.USER_EMAIL]:'',
    },
    [DEFINITIONS.COURSE_CODE]:"0",
    [DEFINITIONS.TEXT_ON_HEADER]:'שיעורים',
    [DEFINITIONS.TEXT_SIZE]:0,
    [DEFINITIONS.POPUP]:{
        [DEFINITIONS.POPUP_CHILDREN]:<View/>,
        [DEFINITIONS.POPUP_VISIBLE]:false

    }
};

export const setState = (state) => ({
    type: SET_STATE,
    state,
});



const calculateTimeToShowSnackBar=(textOnSnackBar,title)=>{
    let timeToShow=3000;
    return (textOnSnackBar.toString().length*100+title.toString().length*100)>timeToShow?(textOnSnackBar.toString().length*100+title.toString().length*100):timeToShow
};

const AppReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_STATE:
            let stateToChange = {...state};
            try {
                let isSnackBar=false;
                Object.keys(action.state).map((key) => {
                    stateToChange = {...stateToChange, [key]: action.state[key]};
                    if(key===DEFINITIONS.SNACK_BAR){
                        isSnackBar=true;
                    }


                });
                if(isSnackBar) {

                    const time=   calculateTimeToShowSnackBar(stateToChange[DEFINITIONS.SNACK_BAR][DEFINITIONS.TEXT_ON_SNACK_BAR],stateToChange[DEFINITIONS.SNACK_BAR][DEFINITIONS.TITLE_ON_SNACK_BAR]);

                    const snackBar=stateToChange[DEFINITIONS.SNACK_BAR];
                    snackBar[DEFINITIONS.TIME_TO_SHOW_SNACK_BAR]=time;
                    stateToChange={...stateToChange,snackBar}
                }



            } catch (e) {
            }

            return {
                ...stateToChange,
            };

        default:
            return state;
    }
};

export default AppReducer;


export const mapStateToProps = (state) => {
    return state.appReducer;
};

export const mapDispatchToProps = (dispatch) => {

    return {
        [SET_STATE]: (state) => dispatch(setState(state)),
    };
};
