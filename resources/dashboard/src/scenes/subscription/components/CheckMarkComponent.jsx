import React from 'react'
import { PlanCheckMark } from '../../app/components/lib/elements'
import styles from './styles.scss'

export const CurrentCheckMark = (props) => {
    return(
        <div className={(props.cardStatus === 'basic' || props.cardStatus === (props.planRow && props.planRow.id)) ? styles.checkMarkActive : styles.checkMarkContainer}>
            <div className={styles.checkMarkImage}><PlanCheckMark data={props} /></div>
            <div className={styles.checkMarkText}><span>Current plan</span></div>
        </div>
    )
};
