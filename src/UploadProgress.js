import React, {Component} from "react";
import CountUp from "react-countup";

export default class UploadProgress extends Component {
    render() {
        return (
            <CountUp
                start={0}
                end={100000}
                duration={250000}
                delay={0}>
                {({countUpRef}) => (
                    <div>
                        <span ref={countUpRef}/>
                    </div>
                )}
            </CountUp>
        );
    }
}