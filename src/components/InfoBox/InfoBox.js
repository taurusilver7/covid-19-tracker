import React from 'react';
import './InfoBox.css'
import {Card, Typography, CardContent} from '@material-ui/core';

const InfoBox = ({title, cases, active, isRed, total, ...props }) => {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            <CardContent>
                {/* Title-- covid cases */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* 120k no.of.cases */}
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>

                {/* 1.2M  total */}
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
