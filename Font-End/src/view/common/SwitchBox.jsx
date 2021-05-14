import React from "react";
import '../common/scss/components/SwitchBox.scss';

export default class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            randomKey: Math.round(Math.random() * 9999)
        }
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        this.props.onChangeSwitch(e)
    }
    render() {
        const { randomKey } = this.state;
        const { labelText, checked } = this.props;
        return (
            <div className="comp-switch">
                {/* <div className="checkbox"> */}
                    {/* <input type="checkbox" name="check-remember" value={remember_me}
                    checked={remember_me === true}
                    onChange={this.onChangeRememberMe} /> */}
                    {/* <input type="checkbox"/>
                    <label className="label-check">
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                    </label>
                </div>
                <label>Mega Menu</label> */}
                {
                    checked && 
                    <input type="checkbox" 
                        checked id={`id-switch-${randomKey}`} 
                        onChange={e => this.onChange(e)}
                        className="switch-input" />
                }
                {
                    !checked && 
                    <input 
                        type="checkbox"
                        onChange={e => this.onChange(e)}
                        id={`id-switch-${randomKey}`} 
                        className="switch-input" />
                }
                
	            <label htmlFor={`id-switch-${randomKey}`} className="switch-label">{labelText}</label>
            </div>
        )
    }
}