import React from 'react'

export const PlanCheckMark = (props) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px">
            <title>03</title>
            <g data-name="Group">
                <path fill={(props.data.cardStatus === 'basic' || props.data.cardStatus === (props.data.planRow && props.data.planRow.id)) ? 'white' : '#39B54A'} data-name="Path" d="M84.68,34.8l-5.49,2.41A31.85,31.85,0,1,1,65.06,21.92l2.84-5.29A37.82,37.82,0,1,0,84.68,34.8Z"></path>
                <polygon fill={(props.data.cardStatus === 'basic' || props.data.cardStatus === (props.data.planRow && props.data.planRow.id)) ? 'white' : '#39B54A'} data-name="Path" points="33.04 38.93 28.89 43.27 48.73 62.24 84.62 22.32 80.16 18.31 48.41 53.62 33.04 38.93"></polygon>
            </g>
        </svg>
    )
};